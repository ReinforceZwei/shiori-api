var sqlite3 = require('sqlite3')
var Warpper = require('./database-wrapper')
var schema =  require('fs').readFileSync(__dirname + '/../database-schema/sqlite.sql').toString()
var log = require('../helper/log')

function init(options) {
    let db = new sqlite3.Database(options.sqlite_file, (err) => {
        if (err) {
            log.error("Open db error")
            log.error(err);
            process.exit()
        }
    });
    db.exec(schema, (err) => {
        if (err) {
            log.error("Init db error")
            log.error(err);
            process.exit()
        }
    });
    db.exec('PRAGMA foreign_keys = ON', err => {
        if (err){
            log.error('Sqlite cannot enable foreign keys')
            log.error(err);
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
                    log.error("Error while executing SQL: " + sql + params)
                    log.error(err)
                    reject(err)
                }else{
                    log.debug("SQL: " + sql + params)
                    log.debug("Result:", rows)
                    resolve(rows)
                }
            })
        })
    }
}

module.exports = {init}