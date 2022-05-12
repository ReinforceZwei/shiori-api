var express = require('express');
var r = express.Router();
var bookmark = require('../controller/bookmark')
var auth = require('../middleware/authentication')
var resp = require("../helper/resp")
var notEmpty = require('../helper/haskey').notEmpty
var hasKey = require('../helper/haskey').hasKey

r.use(auth)

// r.get('/', (req, res) => {
//     console.log(req.userId)
//     res.status(200)
// })

r.post('/create', (req, res) => {
    if (notEmpty(req.body, 'name') && notEmpty(req.body, 'url')){
        let name = req.body.name
        let url = req.body.url
        let favicon = notEmpty(req.body, 'favicon') ? req.body.favicon : undefined
        let collectionId = notEmpty(req.body, 'collection_id') ? req.body.collection_id : undefined
        bookmark.addBookmark(req.userId, name, url, undefined, favicon, collectionId)
            .then(bookmarkId => {
                resp.ok(res, {'bookmark_id': bookmarkId})
            })
            .catch(err => {
                resp.fail(res, 400, err)
            })
    }else{
        resp.fail(res, 400, 'Missing parameters')
    }
})

r.get('/list', (req, res) => {
    bookmark.listBookmark(req.userId)
        .then(rows => {
            resp.ok(res, rows)
        })
        .catch(err => {
            resp.fail(res, 500, err)
        })
})

r.get('/:id', (req, res) => {
    if (notEmpty(req.params, 'id')){
        let id = req.params.id
        bookmark.getBookmark(req.userId, id)
            .then(rows => {
                resp.ok(res, rows)
            })
            .catch(err => {
                if (err === 404){
                    resp.fail(res, 404, "Not found")
                }else{
                    resp.fail(res, 500, err)
                }
            })
    }else{
        resp.fail(res, 400, 'Missing parameters')
    }
})

r.delete('/:id', (req, res) => {
    if (notEmpty(req.params, 'id')){
        let id = req.params.id
        bookmark.deleteBookmark(req.userId, id)
            .then(rows => {
                resp.ok(res)
            })
            .catch(err => {
                if (err === 404){
                    resp.fail(res, 404, "Not found")
                }else{
                    resp.fail(res, 500, err)
                }
            })
    }else{
        resp.fail(res, 400, 'Missing parameters')
    }
})

r.patch('/:id', (req, res) => {
    if (notEmpty(req.params, 'id')){
        let name = notEmpty(req.body, 'name') ? req.body.name : undefined
        let url = notEmpty(req.body, 'url') ? req.body.url : undefined
        let favicon = hasKey(req.body, 'favicon') ? req.body.favicon : undefined
        let collectionId = hasKey(req.body, 'collection_id') ? req.body.collection_id : undefined
        let id = req.params.id
        bookmark.updateBookmark(req.userId, id, name, url, favicon, collectionId)
            .then(rows => {
                resp.ok(res)
            })
            .catch(err => {
                if (err === 404){
                    resp.fail(res, 404, "Not found")
                }else{
                    resp.fail(res, 500, err)
                }
            })
    }else{
        resp.fail(res, 400, 'Missing parameters')
    }
})

module.exports = r