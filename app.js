var express = require('express');
var helmet = require('helmet')
var fail = require(__dirname + "/helper/resp").fail

var app = express()
app.use(helmet())
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.set('etag', false);

var config = require('./config/config')({'port': 3001})

console.log(config)

var db = require('./database/init').init('sqlite', config.sqlite_file)

// var auth = require('./middleware/authentication')
// app.use(auth)

//db.run("INSERT INTO user (name, password) VALUES ('admin', 'abc123')");
//db.all("SELECT * FROM user", (err, rows) => {console.log(rows)})

var index = require('./router/index')
app.use('/', index)

var user = require('./router/user')
app.use('/user', user)

var bookmark = require('./router/bookmark')
app.use('/bookmark', bookmark)

var collection = require('./router/collection')
app.use('/collection', collection)

// Not found handler
app.use(function(req, res, next) {
    fail(res, 404, "Not Found")
});

// Error handler
app.use(function(err, req, res, next) {
    console.error(err)
    fail(res, 500, "Cannot handle request")
});

app.listen(config.port, () => {
    console.log(`Running on port ${config.port}`)
})