var express = require('express');
var r = express.Router();
var auth = require('../middleware/authentication')
var importBookmark = require('../controller/import').importBookmark
var multer  = require('multer')
var mem = multer.memoryStorage()
var upload = multer({ storage: mem })

r.use(auth)

r.post('/', upload.any(), (req, res) => {
    if (req.files && req.files.length > 0){
        let bm = req.files[0].buffer.toString()
        importBookmark(req.userId, bm)
        .then(() => {
            res.status(201).end()
        })
    }
    res.status(400).end()
})

module.exports = r