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
var bm = require('./bookmark');

(async () => {
    await user.addUser('reinforce', 'abc')
    let me = (await user.getUserInfo('reinforce'))[0]
    console.assert(me.id === 1, 'Add user, User ID mismatch')

    await bm.addBookmark(me.id, 'test site 1', 'localhost')
    let last_id = await bm.addBookmark(me.id, 'test site 2', 'localhost')
    console.assert(last_id === 2, 'Add bookmark, last ID mismatch')

    let bookmark1 = await bm.getBookmark(me.id, last_id)
    console.assert(bookmark1[0].name === 'test site 2' && bookmark1[0].url === 'localhost', 'Get bookmark, bookmark info mismatch')
    console.log(bookmark1)

    let all = await bm.listBookmark(me.id)
    console.assert(all.length === 2, 'List bookmark, count mismatch')

    await bm.deleteBookmark(me.id, last_id)
    all = await bm.listBookmark(me.id)
    console.assert(all.length === 1, 'Delete bookmark, count mismatch')

    await bm.updateBookmark(me.id, 1, 'my new site', 'abc.com')
    all = await bm.listBookmark(me.id)
    console.assert(all.length === 1 && all[0].name === 'my new site' && all[0].url === 'abc.com', 'Update bookmark, info mismatch')

    console.log('Test done!')
})()
