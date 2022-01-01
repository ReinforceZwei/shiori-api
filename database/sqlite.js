var sqlite3 = require('sqlite3')
var Warpper = require('./database-wrapper')
var schema =  require('fs').readFileSync(__dirname + '/../database-schema/sqlite.sql').toString()

function init(dbFile) {
    let db = new sqlite3.Database(dbFile, (err) => {
        if (err) {
            console.error("Open db error")
            console.error(err);
            process.exit()
        }
    });
    db.exec(schema, (err) => {
        if (err) {
            console.error("Init db error")
            console.error(err);
            process.exit()
        }
    });
    db.exec('PRAGMA foreign_keys = ON', err => {
        if (err){
            console.error('Sqlite cannot enable foreign keys')
            console.error(err);
            process.exit()
        }
    })
    return new SqliteWrapper(db)
}

class SqliteWrapper extends Warpper {
    query(sql, params){
        return new Promise((resolve, reject) => {
            this._db.all(sql, params, (err, rows) => {
                if (err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }
}

module.exports = {init}