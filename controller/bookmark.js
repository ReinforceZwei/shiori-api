var db = require('../database/init').getDb()

function addBookmark(userId, name, url){
    //
    return new Promise((resolve, reject) => {
        // Get max order id
        let maxOrderSql = "SELECT MAX(order_id) as order_id FROM bookmark WHERE user_id = ?"
        db.get(maxOrderSql, [userId], (err, row) => {
            if (err){
                reject(err)
            }else{
                let maxOrder = 10;
                if (row.order_id !== null){
                    maxOrder += row.order_id
                }
                let sql = "INSERT INTO bookmark (user_id, name, url, order_id, add_time) VALUES (?, ?, ?, ?, ?)"
                db.run(sql, [userId, name, url, maxOrder, Date.now()], err => {
                    if (err){
                        reject(err)
                    }else{
                        db.get('SELECT last_insert_rowid() as last_id', [], (err, row) => {
                            if (err){
                                reject(err)
                            }else{
                                resolve(row.last_id)
                            }
                        })
                    }
                })
            }
        })
    })
}

function getBookmark(userId, id){
    //
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM bookmark WHERE user_id = ? AND id = ?"
        db.get(sql, [userId, id], (err, row) => {
            if (err){
                reject(err)
            }else{
                resolve(row)
            }
        })
    })
}

function listBookmark(userId){
    //
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM bookmark WHERE user_id = ?"
        db.all(sql, [userId], (err, rows) => {
            if (err){
                reject(err)
            }else{
                resolve(rows)
            }
        })
    })
}

function deleteBookmark(userId, id){
    //
    return new Promise((resolve, reject) => {
        let sql = "DELETE FROM bookmark WHERE user_id = ? AND id = ?"
        db.run(sql, [userId, id], (err) => {
            if (err){
                reject(err)
            }else{
                resolve()
            }
        })
    })
}

function updateBookmark(userId, id, name, url){
    //
    return new Promise((resolve, reject) => {
        let sql = "UPDATE bookmark SET name = ?, url = ? WHERE user_id = ? AND id = ?"
        db.run(sql, [name, url, userId, id], err => {
            if (err){
                reject(err)
            }else{
                resolve()
            }
        })
    })
}

module.exports = {addBookmark, getBookmark, listBookmark, deleteBookmark, updateBookmark}