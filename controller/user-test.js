let fs = require('fs')
if (fs.existsSync('testdb.db')) {fs.unlinkSync('testdb.db')}
require('../database/init').init('sqlite', 'testdb.db')

// let mysqlConfig = {
//     host     : 'localhost',
//     user     : 'user',
//     password : '-',
//     database : 'shiori'
// };
// require('../database/init').init('mysql', mysqlConfig);

var user = require('./user');

(async () => {
    await user.addUser('testacc', '12345678')
    await user.addUser('reinforce', 'abc')
    let users = await user.dumpUsers()
    console.assert(users.length === 2, 'Create users, number not match')

    await Promise.all([
        user.loginUser('reinforce', 'abc'),
        user.loginUser('reinforce', 'abc'),
        user.loginUser('testacc', '12345678')
    ])

    let sessions = await user.dumpSession()
    console.assert(sessions.length === 3, 'Login users, session count not match')

    await user.deleteUser(1, '12345678')
    users = await user.dumpUsers()
    console.assert(users.length === 1, 'Delete users, number not match')

    sessions = await user.dumpSession()
    console.assert(sessions.length === 2, 'Delete users, session count not match')

    let token = await user.loginUser('reinforce', 'abc')
    sessions = await user.dumpSession()
    console.assert(sessions.length === 3, 'Login users, session count not match')

    let loginUser = await user.verifyUser(token)
    console.assert(loginUser.id === 2, 'Verify user, user id not match')

    await user.logoutUser(token)
    try{
        await user.verifyUser(token)
        console.assert(true, 'Verify user, did not throw error after logout')
    }catch(e){
        // pass
    }

    console.log('Test done!')
})()

// user.addUser('testacc', '12345678')
// .then(() => {
//     return user.addUser('reinforce', 'abc')
// })
// .then(()=>{
//     return user.dumpUsers()
// })
// .then(() => {
//     return Promise.all([
//         user.loginUser('reinforce', 'abc'),
//         user.loginUser('reinforce', 'abc'),
//         user.loginUser('testacc', '12345678')
//     ])
// })
// .then(() => {
//     return user.dumpSession()
// })
// .then(() => {
//     return user.deleteUser(1, '12345678')
// })
// .then(() => {
//     return user.dumpUsers()
// })
// .then(() => {
//     return user.dumpSession()
// })
// .then(() => {
//     return user.loginUser('reinforce', 'abc')
// })
// .then(async token => {
//     await user.dumpSession()
//     await user.logoutUser(token)
//     return user.verifyUser(token)
// })
// .catch(err => {
//     console.error(err)
// })


