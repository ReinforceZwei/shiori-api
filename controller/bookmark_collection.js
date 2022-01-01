var db = require('../database/init').getDb()

function addToCollection(userId, bookmarkId, collectionId){
    let sql = "INSERT INTO bookmark_collection (user_id, bookmark_id, collection_id) VALUES (?, ?, ?)"
    return db.query(sql, [userId, bookmarkId, collectionId])
}

function removeFromCollection(userId, bookmarkId){
    let sql = "DELETE FROM bookmark_collection WHERE user_id = ? AND bookmark_id = ?"
    return db.query(sql, [userId, bookmarkId])
}

function getCollectionItem(userId, collectionId){
    let sql = 'SELECT bm.* FROM bookmark_collection as bc JOIN bookmark as bm ON bc.bookmark_id = bm.id WHERE bc.user_id = ? AND bc.collection_id = ?'
    return db.query(sql, [userId, collectionId])
}

module.exports = {addToCollection, removeFromCollection, getCollectionItem}