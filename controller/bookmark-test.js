let fs = require('fs')
if (fs.existsSync('testdb.db')) {fs.unlinkSync('testdb.db')}
require('../database/init').init('testdb.db')

var user = require('./user')
var bm = require('./bookmark');

(async () => {
    await user.addUser('reinforce', 'abc')
    let me = await user.getUserInfo('reinforce')

    await bm.addBookmark(me.id, 'test site 1', 'localhost')
    let last_id = await bm.addBookmark(me.id, 'test site 2', 'localhost')
    console.log(last_id)

    let bookmark1 = await bm.getBookmark(me.id, last_id)
    console.log(bookmark1)

    let all = await bm.listBookmark(me.id)
    console.log(all)

    await bm.deleteBookmark(me.id, last_id)
    all = await bm.listBookmark(me.id)
    console.log(all)

    await bm.updateBookmark(me.id, 1, 'my new site', 'abc.com')
    all = await bm.listBookmark(me.id)
    console.log(all)
})()
