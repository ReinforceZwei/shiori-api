const dotenv = require('dotenv')

dotenv.config()

var defaultConfig = {
    "port": process.env.PORT,
    "database": {
        "type": process.env.DB_TYPE,
        "host": process.env.MYSQL_HOST,
        "port": process.env.MYSQL_PORT,
        "user": process.env.MYSQL_USER,
        "password": process.env.MYSQL_PASSWORD,
        "dbname": process.env.MYSQL_DBNAME,
        "sqlite_file": process.env.SQLITE_FILE
    },
    "favicon_size": Number(process.env.FAVICON_FETCH_SIZE),
}

console.log(defaultConfig)

getConfig = (option) => {
    return Object.assign(defaultConfig, option)
}

module.exports = defaultConfig