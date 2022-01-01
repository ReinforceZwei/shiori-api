var user = require(__dirname + "/../controller/user")

module.exports = (req, res, next) => {
    if (req.headers.authorization){
        let value = req.headers.authorization
        console.log(value)
        if (value.startsWith('bearer ')){
            value = value.replace('bearer ', '')
            user.verifyUser(value)
            .then(user => {
                req.userId = user.id
                next()
            })
            .catch(err => {
                res.json({'msg': 'Not authorized'}).status(401)
            })
        }
    } else {
        res.json({'msg': 'Not authorized'}).status(401)
    }
}