let fs = require('fs')
fs.unlinkSync('testdb.db')
require('../database/init').init('testdb.db')
var user = require('./user')

user.addUser('testacc', '12345678')
.then(() => {
    return user.addUser('reinforce', 'abc')
})
.then(()=>{
    return user.dumpUsers()
})
.then(() => {
    return Promise.all([
        user.loginUser('reinforce', 'abc'),
        user.loginUser('reinforce', 'abc'),
        user.loginUser('testacc', '12345678')
    ])
})
.then(() => {
    return user.dumpSession()
})
.then(() => {
    return user.deleteUser(1, '12345678')
})
.then(() => {
    return user.dumpUsers()
})
.then(() => {
    return user.dumpSession()
})
.then(() => {
    return user.loginUser('reinforce', 'abc')
})
.then(async token => {
    await user.dumpSession()
    await user.logoutUser(token)
    return user.verifyUser(token)
})
.catch(err => {
    console.error(err)
})


