var express = require('express');
var r = express.Router();
var collection = require('../controller/collection')
var bookmarkCollection = require('../controller/bookmark_collection')
var auth = require('../middleware/authentication')
var resp = require("../helper/resp")
var notEmpty = require('../helper/haskey').notEmpty

r.use(auth)

r.post('/create', (req, res) => {
    if (notEmpty(req.body, 'name')){
        let name = req.body.name
        collection.createCollection(req.userId, name)
            .then(id => {
                res.json({'collection_id': id})
            })
            .catch(err => {
                res.json({'error': err})
            })
    }else{
        resp.fail(res, 400, 'Missing parameters')
    }
})

r.get('/list', (req, res) => {
    collection.listCollection(req.userId)
        .then(rows => {
            res.json({'data': rows})
        })
        .catch(err => {
            res.json({'error': err})
        })
})

r.get('/:id', (req, res) => {
    if (notEmpty(req.params, 'id')){
        collection.getCollection(req.userId, req.params.id)
            .then(rows => {
                if (rows.length === 1){
                    res.json({'data': rows[0]})
                }else{
                    res.status(404).end()
                }
            })
            .catch(err => {
                res.json({'error': err})
            })
    }else{
        resp.fail(res, 400, 'Missing parameters')
    }
})

r.delete('/:id', (req, res) => {
    if (notEmpty(req.params, 'id')){
        let id = req.params.id
        collection.deleteCollection(req.userId, id)
            .then(rows => {
                res.status(200).end()
            })
            .catch(err => {
                res.json({'error': err})
            })
    }else{
        resp.fail(res, 400, 'Missing parameters')
    }
})

r.patch('/:id', (req, res) => {
    if (notEmpty(req.body, 'name') && notEmpty(req.params, 'id')){
        let name = req.body.name
        let id = req.params.id
        collection.updateCollection(req.userId, id, name)
            .then(rows => {
                res.status(200).end()
            })
            .catch(err => {
                res.json({'error': err})
            })
    }else{
        resp.fail(res, 400, 'Missing parameters')
    }
})

r.get('/none/items', (req, res) => {
    bookmarkCollection.getItemNotInCollection(req.userId)
        .then(rows => {
            res.json({'data': rows})
        })
        .catch(err => {
            res.json({'error': err})
        })
})

r.get('/:id/items', (req, res) => {
    if (notEmpty(req.params, 'id')){
        bookmarkCollection.getCollectionItem(req.userId, req.params.id)
            .then(rows => {
                res.json({'data': rows})
            })
            .catch(err => {
                res.json({'error': err})
            })
    }else{
        resp.fail(res, 400, 'Missing parameters')
    }
})

r.post('/:id/add', (req, res) => {
    if (notEmpty(req.params, 'id') && notEmpty(req.body, 'bookmark_id')) {
        // Add bookmark to collection
        let bookmarkId = req.body.bookmark_id
        let collectionId = req.params.id
        bookmarkCollection.addToCollection(req.userId, bookmarkId, collectionId)
            .then(rows => {
                res.json({'data':rows})
            })
            .catch(err => {
                res.json({'error': err})
            })
    }else{
        resp.fail(res, 400, 'Missing parameters')
    }
})

r.post('/:id/remove', (req, res) => {
    if (notEmpty(req.params, 'id') && notEmpty(req.body, 'bookmark_id')) {
        // Remove bookmark from collection
        let bookmarkId = req.body.bookmark_id
        let collectionId = req.params.id
        bookmarkCollection.removeFromCollection(req.userId, bookmarkId)
            .then(rows => {
                res.json({'data':rows})
            })
            .catch(err => {
                res.json({'error': err})
            })
    }else{
        resp.fail(res, 400, 'Missing parameters')
    }
})

r.post('/none/insert/after', (req, res) => {
    if (notEmpty(req.body, 'bookmark_id') && notEmpty(req.body, 'after_bookmark')) {
        // Reorder bookmark
        let bookmarkId = req.body.bookmark_id
        let afterbookmark = req.body.after_bookmark
        bookmarkCollection.insertAfter(req.userId, bookmarkId, afterbookmark, undefined)
            .then(rows => {
                res.json({'data':rows})
            })
            .catch(err => {
                res.json({'error': err})
            })
    }else{
        resp.fail(res, 400, 'Missing parameters')
    }
})

r.post('/:id/insert/after', (req, res) => {
    if (notEmpty(req.body, 'bookmark_id') && notEmpty(req.body, 'after_bookmark')) {
        // Reorder bookmark
        let collectionId = req.params.id
        let bookmarkId = req.body.bookmark_id
        let afterbookmark = req.body.after_bookmark
        bookmarkCollection.insertAfter(req.userId, bookmarkId, afterbookmark, collectionId)
            .then(rows => {
                res.json({'data':rows})
            })
            .catch(err => {
                res.json({'error': err})
            })
    }else{
        resp.fail(res, 400, 'Missing parameters')
    }
})

module.exports = r