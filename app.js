var express = require('express');
var helmet = require('helmet')

var app = express()
app.use(helmet())

var config = require('./config/config')({'port': 3001})

console.log(config)

var db = require('./database/init').init(config.sqlite_file)

//db.run("INSERT INTO user (name, password) VALUES ('admin', 'abc123')");
db.all("SELECT * FROM user", (err, rows) => {console.log(rows)})

var index = require('./router/index')
app.use('/', index)

app.listen(config.port, () => {
    console.log(`Running on port ${config.port}`)
})