const fetch = require('node-fetch')
const log = require('../helper/log')
const he = require('he');

const parseTitle = (body) => {
    let match = body.match(/<title.*>([^<]*)<\/title>/) // regular expression to parse contents of the <title> tag
    if (!match || typeof match[1] !== 'string')
        throw new Error('Unable to parse the title tag')
    return he.decode(match[1])
}

function fetchTitle(url) {
    if (!url.startsWith('http')) {
        // URL class require 'http'
        url = 'http://' + url;
    }
    return fetch(url, {
        headers: {
            "Accept": "text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
        }
    })
        .then(res => res.text()) // parse response's body as text
        .then(body => parseTitle(body)) // extract <title> from body
        .catch(err => {
            log.warn(err)
            return Promise.resolve("")
        })
}

module.exports = fetchTitle