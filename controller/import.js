var parse = require('../helper/bookmarkparser')
var bookmark = require('./bookmark')
var collection = require('./collection')
var bookmarkCollection = require('./bookmark_collection')
var db = require('../database/init').getDb()

async function importBookmark(userId, bm){
    let b = parse(bm)
    let c = new Map() // k => collection name, v => collection id
    await db.query('BEGIN')
    try{
        for (bm of b){
            let name = bm.title
            let url = bm.url
            let addDate = new Date(bm.add_date * 1000).toISOString()
            let favicon = bm.icon
            let colName = ''
            if (bm.categories.length > 0) {
                for (let cname of bm.categories){
                    colName = colName + '/' + cname.name
                }
                // Remove leading /
                colName = colName.substring(1)
            }
            
            let colId = undefined
            if (colName !== ''){
                if (!c.has(colName)){
                    colId = await collection.createCollection(userId, colName)
                    c.set(colName, colId)
                }else{
                    colId = c.get(colName)
                }
            }
            await bookmark.addBookmark(userId, name, url, addDate, favicon, colId)
        }
        await db.query('COMMIT')
    }catch (e){
        console.error(e)
        await db.query('ROLLBACK')
    }
}

module.exports = {importBookmark}