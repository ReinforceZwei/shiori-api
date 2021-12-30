var db = require('../database/init').getDb()
var bcrypt = require('bcrypt');
var crypto = require('crypto');

const TOKEN_LENGTH = 48

// Store user token in memory
// token => [tokenObj]
// tokenObj => {userId, not_after}
var loggedUser = new Map();

function addUser(name, password) {
    return new Promise((resolve, reject) => {
        return bcrypt.hash(password, 10)
            .then(hashed => {
                let sql = "INSERT INTO user (name, password) VALUES (?, ?)"
                db.run(sql, [name, hashed], (err) => {
                    if (err){
                        reject(err)
                    }else{
                        resolve()
                    }
                })
            })
    })
}

function getUser(userId) {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM user WHERE id = ?'
        db.get(sql, [userId], (err, row) => {
            if (err){
                reject(err)
            }else{
                resolve(row)
            }
        })
    })
}

// Private use only
function getUserInfo(name) {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM user WHERE name = ?'
        db.get(sql, name, (err, row) => {
            if (err) {
                reject(err)
            } else {
                resolve(row)
            }
        })
    })
}

function deleteUser(userId, password) {
    return new Promise((resolve, reject) => {
        getUser(userId)
            .then(user => {
                return bcrypt.compare(password, user.password)
            })
            .then(result => {
                if (result) {
                    let sql = "DELETE FROM user WHERE id = ?"
                    db.run(sql, userId, (err) => {
                        if (err){
                            reject(err)
                        }else{
                            loggedUser.forEach((value, key) => {
                                if (value.id === userId){
                                    loggedUser.delete(key)
                                }
                            })
                            resolve()
                        }
                    })
                }else{
                    reject('Invalid password')
                }
            })
    })
}

function loginUser(name, password) {
    if (typeof name === 'string' && typeof password === 'string'){
        // Get user info from db
        return getUserInfo(name)
            .then(async value => {
                if (value !== undefined){
                    // Return promise
                    let compareResult = await bcrypt.compare(password, value.password)
                    return {compare: compareResult, user: value}
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

function dumpUsers(){
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM user", [], (err, rows) => {
            if (err){
                reject(err)
            }else{
                console.log(rows)
                resolve(rows)
            }
        })
    })
}

function dumpSession(){
    console.log(loggedUser)
}

module.exports = {addUser, getUser, deleteUser, loginUser, verifyUser, dumpUsers, dumpSession}