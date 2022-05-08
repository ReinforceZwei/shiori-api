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
                resp.ok(res, {'collection_id': id})
            })
            .catch(err => {
                resp.fail(res, 500, err)
            })
    }else{
        resp.fail(res, 400, 'Missing parameters')
    }
})

r.get('/list', (req, res) => {
    collection.listCollection(req.userId)
        .then(rows => {
            resp.ok(res, rows)
        })
        .catch(err => {
            resp.fail(res, 500, err)
        })
})

r.get('/:id', (req, res) => {
    if (notEmpty(req.params, 'id')){
        collection.getCollection(req.userId, req.params.id)
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
        collection.deleteCollection(req.userId, id)
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
    if (notEmpty(req.body, 'name') && notEmpty(req.params, 'id')){
        let name = req.body.name
        let id = req.params.id
        collection.updateCollection(req.userId, id, name)
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

r.get('/none/items', (req, res) => {
    bookmarkCollection.getItemNotInCollection(req.userId)
        .then(rows => {
            resp.ok(res, rows)
        })
        .catch(err => {
            resp.fail(res, 500, err)
        })
})

r.get('/:id/items', (req, res) => {
    if (notEmpty(req.params, 'id')){
        bookmarkCollection.getCollectionItem(req.userId, req.params.id)
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

r.post('/:id/add', (req, res) => {
    if (notEmpty(req.params, 'id') && notEmpty(req.body, 'bookmark_id')) {
        // Add bookmark to collection
        let bookmarkId = req.body.bookmark_id
        let collectionId = req.params.id
        bookmarkCollection.addToCollection(req.userId, bookmarkId, collectionId)
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

r.post('/:id/remove', (req, res) => {
    if (notEmpty(req.params, 'id') && notEmpty(req.body, 'bookmark_id')) {
        // Remove bookmark from collection
        let bookmarkId = req.body.bookmark_id
        let collectionId = req.params.id
        bookmarkCollection.removeFromCollection(req.userId, bookmarkId)
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

r.post('/none/order/:bookmark_id/:position/:after_bookmark', (req, res) => {
    if (notEmpty(req.params, 'bookmark_id') && notEmpty(req.params, 'after_bookmark') && notEmpty(req.params, 'position')) {
        // Reorder bookmark
        let bookmarkId = Number(req.params.bookmark_id)
        let afterbookmark = Number(req.params.after_bookmark)
        let position = req.params.position
        Promise.resolve(position)
        .then(pos => {
            if (pos === "after"){
                return bookmarkCollection.insertAfter(req.userId, bookmarkId, afterbookmark, undefined)
            }else if (pos === "before"){
                return bookmarkCollection.insertBefore(req.userId, bookmarkId, afterbookmark, undefined)
            }else{
                return Promise.reject(404)
            }
        })
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

r.post('/:id/order/:bookmark_id/:position/:after_bookmark', (req, res) => {
    if (notEmpty(req.params, 'bookmark_id') && notEmpty(req.params, 'after_bookmark') && notEmpty(req.params, 'position')) {
        // Reorder bookmark
        let collectionId = Number(req.params.id)
        let bookmarkId = Number(req.params.bookmark_id)
        let afterbookmark = Number(req.params.after_bookmark)
        let position = req.params.position
        Promise.resolve(position)
        .then(pos => {
            if (pos === "after"){
                return bookmarkCollection.insertAfter(req.userId, bookmarkId, afterbookmark, collectionId)
            }else if (pos === "before"){
                return bookmarkCollection.insertBefore(req.userId, bookmarkId, afterbookmark, collectionId)
            }else{
                return Promise.reject(404)
            }
        })
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

r.post('/order/:id/:position/:after_collection', (req, res) => {
    // Reorder collection
    if (notEmpty(req.params, 'id') && notEmpty(req.params, 'after_collection') && notEmpty(req.params, 'position')) {
        let collectionId = Number(req.params.id)
        let afterCollection = Number(req.params.after_collection)
        let position = req.params.position
        Promise.resolve(position)
        .then(pos => {
            if (pos === "after"){
                return bookmarkCollection.insertCollection(req.userId, 'after', collectionId, afterCollection)
            }else if (pos === "before"){
                return bookmarkCollection.insertCollection(req.userId, 'before', collectionId, afterCollection)
            }else{
                return Promise.reject(404)
            }
        })
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