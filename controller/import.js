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
            let colName = ''
            if (bm.categories.length > 0) {
                for (let cname of bm.categories){
                    colName = colName + '/' + cname.name
                }
                // Remove leading /
                colName = colName.substring(1)
            }
    
            let bmId = await bookmark.addBookmark(userId, name, url, addDate)
    
            if (colName !== ''){
                if (!c.has(colName)){
                    let colId = await collection.createCollection(userId, colName)
                    c.set(colName, colId)
                }
                await bookmarkCollection.addToCollection(userId, bmId, c.get(colName))
            }
        }
        await db.query('COMMIT')
    }catch (e){
        console.error(e)
        await db.query('ROLLBACK')
    }
}

module.exports = {importBookmark}