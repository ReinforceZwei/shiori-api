var express = require('express');
var r = express.Router();
var user = require('../controller/user')

r.post('/login', (req, res) => {
    if (typeof req.body.name === 'string' && typeof req.body.password === 'string'){
        let name = req.body.name
        let password = req.body.password
        user.loginUser(name, password)
            .then(token => {
                res.json({'token': token})
            })
            .catch((err) => {
                res.json({'error': err}).status(401)
            })
    }else{
        res.status(400).json({'error': 'Missing parameters'})
    }
})

r.post('/logout', (req, res) => {
    if (req.headers.authorization){
        user.logoutUser(req.headers.authorization)
            .then(() => {
                res.json({'msg': 'ok'})
            })
    }else{
        res.json({'error': 'Unauthorized'}).status(401)
    }
})

r.post('/create', (req, res) => {
    if (typeof req.body.name === 'string' && typeof req.body.password === 'string'){
        let name = req.body.name
        let password = req.body.password
        user.addUser(name, password)
        .then(() => {
            res.json({'msg': 'ok'})
        })
        .catch(err => {
            res.json({'error': err}).status(400)
        })
    }else{
        res.status(400).json({'error': 'Missing parameters'})
    }
})

module.exports = r