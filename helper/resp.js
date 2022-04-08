function response(statusCode = 200, message = "ok", data = undefined) {
    r = {code: statusCode, msg: message}
    if (data) r.data = data
    return r
}

function ok(res, data = undefined) {
    res.json(response(200, "ok", data)).status(200)
}

function fail(res, code = 400, message = "") {
    res.json(response(code, message)).status(code)
}

module.exports = {ok, fail}