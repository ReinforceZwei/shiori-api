// let fs = require('fs')
// if (fs.existsSync('testdb.db')) {fs.unlinkSync('testdb.db')}
// require('../database/init').init('sqlite', 'testdb.db')

let mysqlConfig = {
    host     : 'localhost',
    user     : 'testacc',
    password : '-',
    database : 'shiori'
};
require('../database/init').init('mysql', mysqlConfig);

var user = require('./user')
var cl = require('./collection');
var bl = require('./bookmark_collection');
var bm = require('./bookmark');

(async () => {
    await user.addUser('reinforce', 'abc')
    let me = (await user.getUserInfo('reinforce'))[0]
    let cl_id1 = await cl.createCollection(me.id, 'My collection 1')
    let cl_id2 = await cl.createCollection(me.id, 'New collection 2')
    let bm_id1 = await bm.addBookmark(me.id, 'test site 1', 'localhost')
    let bm_id2 = await bm.addBookmark(me.id, 'super site', 'localhost')

    await bl.addToCollection(me.id, bm_id1, cl_id1)
    await bl.addToCollection(me.id, bm_id2, cl_id1)

    let cl1_item = await bl.getCollectionItem(me.id, cl_id1)
    console.log(cl1_item)

    let cl2_item = await bl.getCollectionItem(me.id, cl_id2)
    console.log(cl2_item)

    await bl.removeFromCollection(me.id, bm_id1)
    cl1_item = await bl.getCollectionItem(me.id, cl_id1)
    console.log(cl1_item)

    await bm.addBookmark(me.id, 'order 1', 'localhost')
    let insert_id = await bm.addBookmark(me.id, 'order 2', 'localhost')
    await bm.addBookmark(me.id, 'order 3', 'localhost')
    await bm.addBookmark(me.id, 'order 4', 'localhost')
    await bm.addBookmark(me.id, 'order 5', 'localhost')
    let after_id = await bm.addBookmark(me.id, 'order 6', 'localhost')

    await bl.insertAfter(me.id, insert_id, after_id)
})()