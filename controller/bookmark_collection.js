var db = require('../database/init').getDb()
var collection = require('../controller/collection')
var bookmark = require('../controller/bookmark')

// Deleted function after DB optimize
// Function migrated to bookmark update function
//
// function addToCollection(userId, bookmarkId, collectionId){
//     return collection.getCollection(userId, collectionId)
//     .then(rows => {
//         let sql = "INSERT INTO bookmark_collection (user_id, bookmark_id, collection_id) VALUES (?, ?, ?)"
//         return db.query(sql, [userId, bookmarkId, collectionId])
//     })
// }

// function removeFromCollection(userId, bookmarkId){
//     return bookmark.getBookmark(userId, bookmarkId)
//     .then(rows => {
//         let sql = "DELETE FROM bookmark_collection WHERE user_id = ? AND bookmark_id = ?"
//         return db.query(sql, [userId, bookmarkId])
//     })
// }

function getCollectionItem(userId, collectionId){
    return collection.getCollection(userId, collectionId)
    .then(rows => {
        let sql = 'SELECT * FROM bookmark WHERE user_id = ? AND collection_id = ? ORDER BY order_id'
        return db.query(sql, [userId, collectionId])
    })
}

function getItemNotInCollection(userId){
    let sql = 'SELECT * FROM bookmark WHERE user_id = ? AND collection_id IS NULL ORDER BY order_id'
    return db.query(sql, [userId])
}

function insertAfter(userId, bookmarkId, afterId, collectionId){
    return insert('after', userId, bookmarkId, afterId, collectionId)
}

function insertBefore(userId, bookmarkId, afterId, collectionId){
    return insert('before', userId, bookmarkId, afterId, collectionId)
}

function insert(position, userId, bookmarkId, afterId, collectionId) {
    if (position !== 'before' && position !== 'after'){
        return Promise.reject('Expected insert position "before" or "after", got ' + position)
    }
    let orderIdLow = undefined
    let orderIdHigh = undefined

    return bookmark.getBookmark(userId, bookmarkId)
    .then(rows => {
        return bookmark.getBookmark(userId, bookmarkId)
    })
    .then(rows => {
        if (collectionId !== undefined){
            return collection.getCollection(userId, collectionId)
        }else{
            return []
        }
    })
    .then(rows => {
        // Query order id low bound
        return db.query(
            'SELECT order_id FROM bookmark WHERE user_id = ? AND id = ?',
            [userId, afterId]
        )
    })
    .then(rows => {
        if (rows.length === 1){
            orderIdLow = rows[0].order_id
            console.log("Low bound order:", orderIdLow)
            if (collectionId === undefined || collectionId === 0){
                return getItemNotInCollection(userId)
            }else{
                return getCollectionItem(userId, collectionId)
            }
        }else{
            return Promise.reject(404)
        }
    })
    .then(rows => {
        // Find order_id before/after target insertion ID
        for (let i = 0; i < rows.length; i++){
            if (rows[i].id === afterId){
                if (position === 'after'){
                    if (i+1 < rows.length){
                        orderIdHigh = rows[i+1].order_id
                        break
                    }
                }else{
                    if (i-1 >= 0){
                        orderIdHigh = rows[i-1].order_id
                        break
                    }
                }
            }
        }
        if (orderIdHigh === undefined){
            if (position === 'after'){
                orderIdHigh = orderIdLow + 20
            }else{
                orderIdHigh = 0
            }
        }
        console.log("High bound order:", orderIdHigh)
        let finalOrderId = (orderIdLow + orderIdHigh) / 2
        return db.query(
            'UPDATE bookmark SET order_id = ? WHERE user_id = ? AND id = ?',
            [finalOrderId, userId, bookmarkId]
        )
    })
}

function insertCollection(userId, position, collectionId, afterId){
    if (position !== 'before' && position !== 'after'){
        return Promise.reject('Expected insert position "before" or "after", got ' + position)
    }
    let orderIdLow = undefined
    let orderIdHigh = undefined

    return collection.getCollection(userId, collectionId)
    .then(rows => {
        return collection.getCollection(userId, afterId)
    })
    .then(rows => {
        // Query order id low bound
        return db.query(
            'SELECT order_id FROM collection WHERE user_id = ? AND id = ?',
            [userId, afterId]
        )
    })
    .then(rows => {
        if (rows.length === 1){
            orderIdLow = rows[0].order_id
            return collection.listCollection(userId)
        }else{
            return Promise.reject(404)
        }
    })
    .then(rows => {
        // Find order_id before/after target insertion ID
        for (let i = 0; i < rows.length; i++){
            if (rows[i].id === afterId){
                if (position === 'after'){
                    if (i+1 < rows.length){
                        orderIdHigh = rows[i+1].order_id
                        break
                    }
                }else{
                    if (i-1 >= 0){
                        orderIdHigh = rows[i-1].order_id
                        break
                    }
                }
            }
        }
        if (orderIdHigh === undefined){
            if (position === 'after'){
                orderIdHigh = orderIdLow + 20
            }else{
                orderIdHigh = 0
            }
        }
        let finalOrderId = (orderIdLow + orderIdHigh) / 2
        return db.query(
            'UPDATE collection SET order_id = ? WHERE user_id = ? AND id = ?',
            [finalOrderId, userId, collectionId]
        )
    })
}

module.exports = {getCollectionItem, insertAfter, insertBefore, getItemNotInCollection, insertCollection}