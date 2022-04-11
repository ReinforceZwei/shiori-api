var express = require('express');
var r = express.Router();
var fetchTitle = require('../helper/fetchtitle')
var haskey = require('../helper/haskey').hasKey
var resp = require("../helper/resp")
var auth = require('../middleware/authentication')

r.use(auth)

r.get('/', (req, res) => {
    if (haskey(req.query, "url")) {
        fetchTitle(req.query.url)
        .then(title => {
            resp.ok(res, {title: title})
        })
    }else{
        resp.fail(res, 400, "Missing parameter")
    }
})

module.exports = r