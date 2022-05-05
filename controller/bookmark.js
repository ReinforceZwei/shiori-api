var db = require('../database/init').getDb()

function addBookmark(userId, name, url, addDate = undefined, favicon = undefined){
    // Get max order id
    let maxOrderSql = "SELECT MAX(order_id) as order_id FROM bookmark WHERE user_id = ?"
    return db.query(maxOrderSql, [userId])
        .then(rows => {
            let maxOrder = 10;
            if (rows.length === 1 && rows[0].order_id !== null){
                maxOrder += rows[0].order_id
            }
            let sql = "INSERT INTO bookmark (user_id, name, url, order_id, add_time, favicon) VALUES (?, ?, ?, ?, ?, ?)"
            let queryParams = [userId, name, url, maxOrder]

            if (addDate === undefined){
                queryParams.push(new Date().toISOString())
            }else{
                queryParams.push(addDate)
            }

            // TODO: Add size check and format validate
            if (favicon === undefined){
                queryParams.push(null)
            }else{
                queryParams.push(favicon)
            }
            return db.query(sql, queryParams)
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

function updateBookmark(userId, id, name = undefined, url = undefined, favicon = undefined){
    let params = []
    let sqlParams = []
    if (name !== undefined){
        sqlParams.push('name = ?')
        params.push(name)
    }
    if (url !== undefined){
        sqlParams.push('url = ?')
        params.push(url)
    }
    if (favicon !== undefined){
        sqlParams.push('favicon = ?')
        params.push(favicon)
    }
    if (params.length > 0){
        return getBookmark(userId, id)
        .then(rows => {
            let sql = `UPDATE bookmark SET ${sqlParams.join(',')} WHERE user_id = ? AND id = ?`
            params.push(userId, id)
            return db.query(sql, params)
        })
    }else{
        return Promise.resolve()
    }
}

module.exports = {addBookmark, getBookmark, listBookmark, deleteBookmark, updateBookmark}