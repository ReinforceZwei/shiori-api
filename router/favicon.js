var express = require('express');
var r = express.Router();
var fetchIcon = require('../helper/fetchIcon').fetchIcon
var haskey = require('../helper/haskey').hasKey
var resp = require("../helper/resp")
var auth = require('../middleware/authentication')
var log = require('../helper/log')
var config = require('../config/config')

r.use(auth)

r.get('/', (req, res) => {
    if (haskey(req.query, "url")) {
        fetchIcon(req.query.url, config.favicon_size)
        .then(buf => {
            resp.ok(res, {favicon: 'data:image/png;base64,' + buf.toString('base64')})
        })
        .catch(err => {
            log.error('Error while fetching favicon: ' + err)
            resp.ok(res, {favicon: null})
        })
    }else{
        resp.fail(res, 400, "Missing parameter")
    }
})

module.exports = r