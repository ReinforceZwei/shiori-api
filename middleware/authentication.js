var user = require(__dirname + "/../controller/user")
var fail = require(__dirname + "/../helper/responsehelper").fail

module.exports = (req, res, next) => {
    if (req.headers.authorization){
        let value = req.headers.authorization
        if (value.startsWith('bearer ')){
            value = value.replace('bearer ', '')
            user.verifyUser(value)
            .then(user => {
                req.userId = user.id
                next()
            })
            .catch(err => {
                fail(res, 401, 'Not authorized')
            })
        }
    } else {
        fail(res, 401, 'Not authorized')
    }
}