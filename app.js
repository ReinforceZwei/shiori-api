var express = require('express');
var helmet = require('helmet')
var cors = require('cors')
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

app.options('*', cors())

var api = express.Router()

var corsOptions = {
    "methods": "GET,HEAD,PATCH,POST,DELETE"
}
api.use(cors(corsOptions))

var index = require('./router/index')
api.use('/', index)

var user = require('./router/user')
api.use('/user', user)

var bookmark = require('./router/bookmark')
api.use('/bookmark', bookmark)

var collection = require('./router/collection')
api.use('/collection', collection)

var importBm = require('./router/import')
api.use('/import', importBm)

var title = require('./router/title')
api.use('/title', title)

app.use('/api', api)

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