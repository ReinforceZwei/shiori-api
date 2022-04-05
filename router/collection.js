var express = require('express');
var r = express.Router();
var collection = require('../controller/collection')
var bookmarkCollection = require('../controller/bookmark_collection')
var auth = require('../middleware/authentication')

r.use(auth)

r.post('/create', (req, res) => {
    if (req.body.name){
        let name = req.body.name
        collection.createCollection(req.userId, name)
            .then(id => {
                res.json({'collection_id': id})
            })
            .catch(err => {
                res.json({'error': err})
            })
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
    if (req.params.id){
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
    }
})

r.delete('/:id', (req, res) => {
    if (req.params.id){
        let id = req.params.id
        collection.deleteCollection(req.userId, id)
            .then(rows => {
                res.status(200).end()
            })
            .catch(err => {
                res.json({'error': err})
            })
    }
})

r.patch('/:id', (req, res) => {
    if (req.body.name && req.params.id){
        let name = req.body.name
        let id = req.params.id
        collection.updateCollection(req.userId, id, name)
            .then(rows => {
                res.status(200).end()
            })
            .catch(err => {
                res.json({'error': err})
            })
    }
})

r.get('/:id/items', (req, res) => {
    if (req.params.id){
        bookmarkCollection.getCollectionItem(req.userId, req.params.id)
            .then(rows => {
                res.json({'data': rows})
            })
            .catch(err => {
                res.json({'error': err})
            })
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

r.post('/:id/add', (req, res) => {
    if (req.params.id && res.body.bookmark_id) {
        // Add bookmark to collection
    }
})

r.post('/:id/remove', (req, res) => {
    if (req.params.id && res.body.bookmark_id) {
        // Remove bookmark from collection
    }
})

r.post('/:id/insert/after', (req, res) => {
    if (req.body.bookmark_id && req.body.after_bookmark) {
        // Reorder bookmark
    }
})

r.post('/none/insert/after', (req, res) => {
    if (req.body.bookmark_id && req.body.after_bookmark) {
        // Reorder bookmark
    }
})