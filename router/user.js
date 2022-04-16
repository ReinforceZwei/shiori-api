var express = require('express');
var r = express.Router();
var user = require('../controller/user')
var resp = require("../helper/resp")
var notEmpty = require('../helper/haskey').notEmpty

r.post('/login', (req, res) => {
    if (notEmpty(req.body, 'name') && notEmpty(req.body, 'password')){
        let name = req.body.name
        let password = req.body.password
        user.loginUser(name, password)
            .then(tokenInfo => {
                resp.ok(res, tokenInfo)
            })
            .catch((err) => {
                resp.fail(res, 401, err)
            })
    }else{
        resp.fail(res, 400, 'Missing parameters')
    }
})

r.post('/logout', (req, res) => {
    if (notEmpty(req.headers.authorization)){
        user.logoutUser(req.headers.authorization)
            .then(() => {
                resp.ok(res)
            })
            .catch(err => {
                resp.fail(res, 500, err)
            })
    }else{
        resp.fail(res, 401, "Unauthorized")
    }
})

r.post('/create', (req, res) => {
    if (notEmpty(req.body, 'name') && notEmpty(req.body, 'password')){
        let name = req.body.name
        let password = req.body.password
        user.addUser(name, password)
        .then(() => {
            resp.ok(res)
        })
        .catch(err => {
            resp.fail(res, 400, err)
        })
    }else{
        resp.fail(res, 400, 'Missing parameters')
    }
})

module.exports = r