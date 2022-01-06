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

function getItemNotInCollection(userId){
    let sql = 'SELECT * FROM bookmark WHERE NOT EXISTS (SELECT NULL FROM bookmark_collection WHERE bookmark_collection.bookmark_id = bookmark.id) AND user_id = ?'
    return db.query(sql, [userId])
}

// function insertAfter(userId, collection_id, bookmark_id, after_bookmark_id){
//     // Select order_id of after_bookmark_id
//     let sqlOrderIdLow = 'SELECT order_id FROM bookmark WHERE user_id = ? AND id = ?'
//     let orderIdLow = undefined
//     let orderIdHigh = undefined

//     return db.query(sqlOrderIdLow, [userId, after_bookmark_id])
//         .then(rows => {
//             //
//             orderIdLow = rows[0].order_id
//             let sqlOrderIdHigh = 'WITH cte as (SELECT bm.* FROM bookmark_collection as bc JOIN bookmark as bm ON bc.bookmark_id = bm.id WHERE bc.user_id = ? AND bc.collection_id = ?) SELECT order_id FROM cte WHERE user_id = ? AND order_id > (SELECT order_id FROM bookmark WHERE user_id = ? AND id = ?) LIMIT 1'
//             return db.query(sqlOrderIdHigh, [userId, userId, after_bookmark_id])
//         })
//         .then(rows => {
//             orderIdHigh = rows[0].order_id
//             let orderId = (orderIdLow + orderIdHigh) / 2
//             let sqlUpdate = 'UPDATE bookmark SET order_id = ? WHERE user_id = ? AND id = ?'
//             return db.query(sqlUpdate, [orderId, userId, bookmark_id])
//         })
// }

module.exports = {addToCollection, removeFromCollection, getCollectionItem}