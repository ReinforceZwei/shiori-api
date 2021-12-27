var defaultConfig = {
    "port": 5000,
    "database": "sqlite",
    "sqlite_file": "./shiori.db"
}

getConfig = (option) => {
    return Object.assign(defaultConfig, option)
}

module.exports = getConfig