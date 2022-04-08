var db = require('../database/init').getDb()

function createCollection(userId, name){
    let orderSql = "SELECT MAX(order_id) as order_id FROM collection WHERE user_id = ?"
    return db.query(orderSql, userId)
        .then(rows => {
            let maxOrder = 10
            if (rows.length === 1 && rows[0].order_id){
                maxOrder += rows[0].order_id
            }
            let sql = "INSERT INTO collection (user_id, name, order_id) VALUES (?, ?, ?)"
            return db.query(sql, [userId, name, maxOrder])
        })
        .then(rows => {
            if (rows.insertId){
                return rows.insertId
            }else{
                return db.query('SELECT last_insert_rowid() as last_id', [])
                    .then(row => {
                        return row[0].last_id
                    })
            }
        })
}

function getCollection(userId, id){
    let sql = "SELECT * FROM collection WHERE user_id = ? AND id = ?"
    return db.query(sql, [userId, id])
    .then(rows => {
        if (rows.length === 1){
            return rows[0]
        }else{
            return Promise.reject(404)
        }
    })
}

function listCollection(userId){
    let sql = "SELECT * FROM collection WHERE user_id = ? ORDER BY order_id"
    return db.query(sql, [userId])
}

function updateCollection(userId, id, name){
    return getCollection(userId, id)
    .then(rows => {
        let sql = "UPDATE collection SET name = ? WHERE user_id = ? AND id = ?"
        return db.query(sql, [name, userId, id])
    })
}

function deleteCollection(userId, id){
    return getCollection(userId, id)
    .then(rows => {
        let sql = "DELETE FROM collection WHERE user_id = ? AND id = ?"
        return db.query(sql, [userId, id])
    })
}

module.exports = {createCollection, getCollection, listCollection, updateCollection, deleteCollection}