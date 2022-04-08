var db = require('../database/init').getDb()

function addBookmark(userId, name, url){
    // Get max order id
    let maxOrderSql = "SELECT MAX(order_id) as order_id FROM bookmark WHERE user_id = ?"
    return db.query(maxOrderSql, [userId])
        .then(rows => {
            let maxOrder = 10;
            if (rows.length === 1 && rows[0].order_id !== null){
                maxOrder += rows[0].order_id
            }
            let sql = "INSERT INTO bookmark (user_id, name, url, order_id, add_time) VALUES (?, ?, ?, ?, ?)"
            return db.query(sql, [userId, name, url, maxOrder, new Date().toISOString()])
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

function getBookmark(userId, id){
    let sql = "SELECT * FROM bookmark WHERE user_id = ? AND id = ?"
    return db.query(sql, [userId, id])
    .then(rows => {
        if (rows.length === 1){
            return rows[0]
        }else{
            return Promise.reject(404)
        }
    })
}

function listBookmark(userId){
    let sql = "SELECT * FROM bookmark WHERE user_id = ?"
    return db.query(sql, [userId])
}

function deleteBookmark(userId, id){
    return getBookmark(userId, id)
    .then(rows => {
        let sql = "DELETE FROM bookmark WHERE user_id = ? AND id = ?"
        return db.query(sql, [userId, id])
    })
}

function updateBookmark(userId, id, name, url){
    return getBookmark(userId, id)
    .then(rows => {
        let sql = "UPDATE bookmark SET name = ?, url = ? WHERE user_id = ? AND id = ?"
        return db.query(sql, [name, url, userId, id])
    })
}

module.exports = {addBookmark, getBookmark, listBookmark, deleteBookmark, updateBookmark}