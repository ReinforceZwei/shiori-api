var _db = undefined;

function init(dbType, options){
    switch (dbType){
        case 'sqlite':{
            var sqliteDB = require('./sqlite').init(options)
            _db = sqliteDB
            return _db
        }
        case 'mysql':{
            var mysqlDB = require('./mysql').init(options)
            _db = mysqlDB
            return _db
        }
        default: {
            throw new Error('Unknown database type')
        }
    }
}

function getDb() {
    if (_db !== undefined) {
        return _db;
    }else{
        throw new Error("Database not initialized")
    }
}

module.exports = {init, getDb}