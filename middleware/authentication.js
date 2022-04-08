var user = require(__dirname + "/../controller/user")
var fail = require(__dirname + "/../helper/resp").fail

module.exports = (req, res, next) => {
    if (req.headers.authorization){
        let value = req.headers.authorization
        let parts = value.split(' ')
        if (parts.length === 2 && parts[0].toLowerCase() === 'bearer'){
            value = parts[1]
            user.verifyUser(value)
            .then(user => {
                req.userId = user.id
                next()
            })
            .catch(err => {
                fail(res, 401, 'Not authorized')
            })
        }else{
            fail(res, 401, 'Not authorized')
        }
    } else {
        fail(res, 401, 'Not authorized')
    }
}