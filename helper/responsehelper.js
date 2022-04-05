function response(statusCode = 200, message = "ok", data = []) {
    r = {code: statusCode, msg: message}
    if (data && data.length) r.data = data
    return r
}

function ok(res, data = []) {
    res.json(response(data = data)).status(200)
}

function fail(res, code = 400, message = "") {
    res.json(response(code, message)).status(code)
}

module.exports = {ok, fail}