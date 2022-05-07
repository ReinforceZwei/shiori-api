const _axios = require('axios').default;
const sharp = require('sharp');
const icojs = require('icojs')
const x = require('x-ray')()
const Url = require('url')
const makeDriver = require('request-x-ray')

const options = {
    method: "GET",
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
        "Accept": "text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8"
    }
}
const driver = makeDriver(options)
x.driver(driver)

// Create custom axios instance
const axios = _axios.create({
    headers: options.headers
})

const config = {
    selectors: [
        'link[rel=apple-touch-icon-precomposed][href]',
        'link[rel=apple-touch-icon][href]',
        'link[rel="shortcut icon"][href]',
        'link[rel=icon][href]',
        'meta[name=msapplication-TileImage][content]',
        'meta[name=twitter\\:image][content]',
        //'meta[property=og\\:image][content]'
    ],
  
    predicates: [
        (f, s) => f.name === 'apple-touch-icon-precomposed' && f.size >= s,
        (f, s) => f.name === 'apple-touch-icon' && f.size >= s,
        (f, s) => f.name === 'twitter:image' && f.size >= s,
        (f, s) => f.name === 'shortcut icon' && f.size >= s,
        (f, s) => f.name === 'icon' && f.size >= s,
        (f, s) => f.name === 'og:image' && f.size >= s,
        (f, s) => f.name === 'msapplication-TileImage' && f.size >= s,
    
        (f, s) => f.name === 'apple-touch-icon-precomposed',
        (f, s) => f.name === 'apple-touch-icon',
        (f, s) => f.name === 'twitter:image',
        (f, s) => f.name === 'shortcut icon',
        (f, s) => f.name === 'icon',
        (f, s) => f.name === 'og:image',
        (f, s) => f.name === 'msapplication-TileImage',
        (f, s) => f.name === 'favicon.ico'
    ]
  }

/**
 * Fetch the icon of a website
 * @param {string} urlString URL to fetch
 * @param {number} size Resize icon (.ico will not be resized)
 * @returns {Promise<Buffer>} Promise resolve to png image Buffer
 */
function fetchIcon(urlString, size = 16){
    if (!urlString.startsWith('http')) {
        // URL class require 'http'
        urlString = 'http://' + urlString;
    }
    let u = new URL(urlString);

    // FIXME: This promise chain looks hell
    return getFaviconUrl(urlString).then(data => {
        if (!data.startsWith('http') && data.startsWith('/')){
            // Deal with url with path only (host missing)
            // FIXME: URL host might be changed due to redirection
            //        but currently has no way to get redirected url
            data = 'http://' + u.host + data
        }
        return axios.get(data, {responseType: 'arraybuffer'}).then(r => {
            let buf = Buffer.from(r.data);
            // Skip resize for .ico library not supported
            return Promise.resolve(mimeToExt(r.headers['content-type']) === ".ico")
                .then(isIco => {
                    if (isIco){
                        return icojs.parse(buf)
                            .then(images => {
                                return Buffer.from(images[0].buffer)
                            })
                    }else{
                        return buf
                    }
                })
                .then(pngBuf => {
                    return sharp(pngBuf)
                        .resize(size)
                        .png()
                        .toBuffer()
                })
        })
    })
}

function mimeToExt(mime) {
    switch (mime.toLowerCase()) {
        case 'image/x-icon': 
        case 'image/ico':
        case 'image/icon':
        case 'text/ico':
        case 'application/ico':
        case 'image/vnd.microsoft.icon': return '.ico';
        case 'image/png':                return '.png';
        case 'image/*':                  return '.png';
        case 'image/svg+xml':            return '.svg';
        case 'image/webp':               return '.webp';
        case 'image/jpeg':               return '.jpg';
        case 'image/gif':                return '.gif';
        default:                         return '';
    }
}

// Below functions were copied from https://github.com/gkovacs/fetch-favicon
// due to original package is missing accept header that is required for some
// online service 
// e.g. Airsonic need accept type of text/html for it to return html page
/**
 * Fetch the website and find out all possible favicon URLs
 * @param {string} url URL to fetch
 * @returns 
 */
function fetchFaviconUrls (url) {
    return x(url, config.selectors.join(), [{
        href: '@href',
        content: '@content',
        property: '@property',
        rel: '@rel',
        name: '@name',
        sizes: '@sizes'
    }])
}

/**
 * Get the favicon URL of the website
 * @param {string} url website to get
 * @param {number} size Prefered size
 * @returns Favicon URL
 */
function getFaviconUrl (url, size) {
    return getFaviconUrls(url, size)
    .then((favicons) => {
        const active = favicons.find((favicon) => favicon.active)
        return active.href
    })
}

/**
 * Get all available favicons URL
 * @param {string} url website to get
 * @param {number} size Prefered size
 * @returns List of available favicon URL
 */
function getFaviconUrls (url, size) {
    return new Promise(function (resolve, reject) {
        fetchFaviconUrls(url)((err, favicons) => {
        if (err) {
            return reject(err)
        }
        favicons.push({
            href: Url.resolve(url, 'favicon.ico'),
            name: 'favicon.ico'
        })

        favicons = favicons.map((favicon) => {
            const f = {
                href: favicon.href || favicon.content,
                name: favicon.name || favicon.rel || favicon.property,
                size: Math.min.apply(null, (favicon.sizes || '').split(/[^0-9\.]+/g)) || undefined
            }

            if (!f.size) {
                delete f.size
            }

            return f
        })

        markActiveFavicon(favicons, size)
        return resolve(favicons)
        })
    })
}

function markActiveFavicon (favicons, minSize) {
    for (let i = 0; i < config.predicates.length; i++) {
        const result = favicons.find((favicon) => config.predicates[i](favicon, minSize))
        if (result) {
            result.active = true
            break
        }
    }
}

module.exports = { fetchIcon, getFaviconUrls }