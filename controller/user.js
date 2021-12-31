var db = require('../database/init').getDb()
var bcrypt = require('bcrypt');
var crypto = require('crypto');

const TOKEN_LENGTH = 48

// Store user token in memory
// token => [tokenObj]
// tokenObj => {userId, not_after}
var loggedUser = new Map();

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
                return Promise.reject('User does not exist')
            }
        })
        .then(result => {
            if (result) {
                let sql = "DELETE FROM user WHERE id = ?"
                return db.query(sql, userId)
                    .then(() => {
                        loggedUser.forEach((value, key) => {
                            if (value.id === userId){
                                loggedUser.delete(key)
                            }
                        })
                    })
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
                    let token = crypto.randomBytes(TOKEN_LENGTH).toString('hex');
                    let not_after = (3 * 24 * 3600 * 1000 + Date.now()) // 3 days
                    loggedUser.set(token, {'name': result.user.name, 'id': result.user.id, 'not_after': not_after})
                    return token
                }else{
                    return Promise.reject('Invalid password')
                }
            })
    } else {
        return Promise.reject('Invalid parameters')
    }
}

function verifyUser(token) {
    return new Promise((resolve, reject) => {
        loggedUser.forEach((value, key) => {
            if (value.not_after < Date.now()){
                loggedUser.delete(key)
            }
        })
        if (loggedUser.has(token)){
            resolve(loggedUser.get(token))
        }else{
            reject('Invalid token')
        }
    })
}

function logoutUser(token) {
    loggedUser.delete(token)
    return Promise.resolve()
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
    console.log(loggedUser)
    return Promise.resolve(loggedUser)
}

module.exports = {addUser, getUser, getUserInfo, deleteUser, loginUser, verifyUser, logoutUser, dumpUsers, dumpSession}