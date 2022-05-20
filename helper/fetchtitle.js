const fetch = require('node-fetch')
const log = require('../helper/log')

const parseTitle = (body) => {
    let match = body.match(/<title.*>([^<]*)<\/title>/) // regular expression to parse contents of the <title> tag
    if (!match || typeof match[1] !== 'string')
        throw new Error('Unable to parse the title tag')
    return match[1]
}

function fetchTitle(url) {
    if (!url.startsWith('http')) {
        // URL class require 'http'
        url = 'http://' + url;
    }
    return fetch(url, {
        headers: {
            "Accept": "text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8"
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