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
    let sql = 'SELECT bm.* FROM bookmark_collection as bc JOIN bookmark as bm ON bc.bookmark_id = bm.id WHERE bc.user_id = ? AND bc.collection_id = ? ORDER BY order_id'
    return db.query(sql, [userId, collectionId])
}

function getItemNotInCollection(userId){
    let sql = 'SELECT * FROM bookmark WHERE NOT EXISTS (SELECT NULL FROM bookmark_collection WHERE bookmark_collection.bookmark_id = bookmark.id) AND user_id = ? ORDER BY order_id'
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

    // Query order id low bound
    return db.query(
        'SELECT order_id FROM bookmark WHERE user_id = ? AND id = ?',
        [userId, afterId]
    )
    .then(rows => {
        if (rows.length === 1){
            orderIdLow = rows[0].order_id
            if (collectionId === undefined){
                return getItemNotInCollection(userId)
            }else{
                return getCollectionItem(userId, collectionId)
            }
        }else{
            return Promise.reject()
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
            'UPDATE bookmark SET order_id = ? WHERE user_id = ? AND id = ?',
            [finalOrderId, userId, bookmarkId]
        )
    })
}

module.exports = {addToCollection, removeFromCollection, getCollectionItem, insertAfter, insertBefore}