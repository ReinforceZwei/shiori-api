class DatabaseWrapper {
    constructor(db){
        this._db = db
    }

    query(sql, params){
        throw new Error('Not implemented error')
    }
}

module.exports = DatabaseWrapper