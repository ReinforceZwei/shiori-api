var express = require('express');
var r = express.Router();
var bookmark = require('../controller/bookmark')
var auth = require('../middleware/authentication')

r.use(auth)

// r.get('/', (req, res) => {
//     console.log(req.userId)
//     res.status(200)
// })

r.post('/create', (req, res) => {
    if (req.body.name && req.body.url){
        let name = req.body.name
        let url = req.body.url
        bookmark.addBookmark(req.userId, name, url)
            .then(bookmarkId => {
                res.json({'bookmark_id': bookmarkId})
            })
            .catch(err => {
                res.json({'error': err})
            })
    }
})

r.get('/list', (req, res) => {
    bookmark.listBookmark(req.userId)
        .then(rows => {
            res.json({'data': rows})
        })
        .catch(err => {
            res.json({'error': err})
        })
})

r.get('/:id', (req, res) => {
    if (req.params.id){
        let id = req.params.id
        bookmark.getBookmark(req.userId, id)
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
        bookmark.deleteBookmark(req.userId, id)
            .then(rows => {
                res.status(200).end()
            })
            .catch(err => {
                res.json({'error': err})
            })
    }
})

r.patch('/:id', (req, res) => {
    if (req.body.name && req.body.url && req.params.id){
        let name = req.body.name
        let url = req.body.url
        let id = req.params.id
        bookmark.updateBookmark(req.userId, id, name, url)
            .then(rows => {
                res.status(200).end()
            })
            .catch(err => {
                res.json({'error': err})
            })
    }
})

module.exports = r