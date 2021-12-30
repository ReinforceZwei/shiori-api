let fs = require('fs')
fs.unlinkSync('testdb.db')
require('../database/init').init('testdb.db')
var user = require('./user')

Promise.all([
    user.addUser('testacc', '12345678'),
    user.addUser('reinforce', 'abc'),
])
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
.catch(err => {
    console.error(err)
})


