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

var user = require('./user')
var cl = require('./collection');

(async () => {
    await user.addUser('reinforce', 'abc')
    let me = (await user.getUserInfo('reinforce'))[0]
    console.assert(me.id === 1, 'Add user, User ID mismatch')

    let id = await cl.createCollection(me.id, 'My collection 1')
    console.assert(id === 1, 'Create collection, ID mismatch', id)

    let mycol = await cl.getCollection(me.id, id)
    console.assert(mycol.length === 1 && mycol[0].name === 'My collection 1', 'Get collection, info mismatch')

    await cl.createCollection(me.id, 'New collection')
    let all = await cl.listCollection(me.id)
    console.assert(all.length === 2, 'List collection, count mismatch')

    await cl.updateCollection(me.id, id, 'My super collection 1')
    mycol = await cl.getCollection(me.id, id)
    console.assert(mycol.length === 1 && mycol[0].name === 'My super collection 1', 'Update collection, info mismatch')

    await cl.deleteCollection(me.id, id)
    all = await cl.listCollection(me.id)
    console.assert(all.length === 1, 'Delete collection, count mismatch')

    console.log('Test done!')
})()