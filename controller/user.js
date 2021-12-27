var db = require('../database/init').getDb()

// Store user token in memory
// token => [tokenObj]
// tokenObj => {userId, not_after}
var loggedUser = new Map();

function addUser(name, password) {
    // Do db operation
}

function getUser(userId) {
    //
}

function deleteUser(userId, password) {
    //
}

function loginUser(name, password) {

    // return token
}

function verifyUser(token) {
    // return bool?
}

module.exports = {addUser, getUser, deleteUser, loginUser, verifyUser}