var express = require('express');
var r = express.Router();
var bookmark = require('../controller/bookmark')
var auth = require('../middleware/authentication')

r.use(auth)

r.get('/', (req, res) => {
    console.log(req.userId)
})

module.exports = r