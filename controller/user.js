var db = require('../database/init').getDb()
var bcrypt = require('bcrypt');
var crypto = require('crypto');

const TOKEN_LENGTH = 48

function addUser(name, password) {
    return bcrypt.hash(password, 10)
        .then(hashed => {
            let sql = "INSERT INTO user (name, password) VALUES (?, ?)"
            return db.query(sql, [name, hashed])
        })
}

function getUser(userId) {
    let sql = 'SELECT * FROM user WHERE id = ?'
    return db.query(sql, [userId])
}

// Private use only
function getUserInfo(name) {
    let sql = 'SELECT * FROM user WHERE name = ?'
    return db.query(sql, name)
}

function deleteUser(userId, password) {
    return getUser(userId)
        .then(user => {
            if (user.length === 1){
                return bcrypt.compare(password, user[0].password)
            }else{
                return Promise.reject('User not exist')
            }
        })
        .then(result => {
            if (result) {
                let sql = "DELETE FROM user WHERE id = ?"
                return db.query(sql, userId)
            }else{
                return Promise.reject('Invalid password')
            }
        })
    
}

function loginUser(name, password) {
    if (typeof name === 'string' && typeof password === 'string'){
        // Get user info from db
        return getUserInfo(name)
            .then(async value => {
                if (value.length === 1){
                    let user = value[0]
                    // Return promise
                    let compareResult = await bcrypt.compare(password, user.password)
                    return {compare: compareResult, user: user}
                }else{
                    return Promise.reject('Invalid user' + name)
                }
            })
            .then(result => {
                if (result.compare){
                    // Generate user token
                    let token = crypto.randomBytes(TOKEN_LENGTH).toString('base64');
                    let not_after = (new Date(3 * 24 * 3600 * 1000 + new Date().getTime()).toISOString()) // 3 days
                    let sql = "INSERT INTO session (user_id, token, not_after) VALUES (?, ?, ?)"
                    return db.query(sql, [result.user.id, token, not_after])
                        .then(() => {
                            return token
                        })
                }else{
                    return Promise.reject('Invalid password')
                }
            })
    } else {
        return Promise.reject('Invalid parameters')
    }
}

function verifyUser(token) {
    return cleanupSession()
        .then(() => {
            let sql = "SELECT user.* FROM session JOIN user ON session.user_id = user.id WHERE token = ?"
            return db.query(sql, [token])
        })
        .then(rows => {
            if (rows.length === 1){
                return rows[0]
            }else{
                return Promise.reject('Invalid token')
            }
        })
}

function cleanupSession(){
    let sql = "DELETE FROM session WHERE not_after < ?"
    let now = new Date().toISOString()
    return db.query(sql, [now])
}

function logoutUser(token) {
    let sql = "DELETE FROM session WHERE token = ?"
    return db.query(sql, [token])
}

function dumpUsers(){
    return db.query("SELECT * FROM user", [])
        .then((rows) => {
            console.log(rows)
            return rows
        })
        .catch(err => {
            console.error(err)
        })
}

function dumpSession(){
    return db.query("SELECT * FROM session", [])
        .then((rows) => {
            console.log(rows)
            return rows
        })
        .catch(err => {
            console.error(err)
        })
}

module.exports = {addUser, getUser, getUserInfo, deleteUser, loginUser, verifyUser, logoutUser, dumpUsers, dumpSession}