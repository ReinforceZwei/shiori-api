// https://gist.github.com/devster31/4e8c6548fd16ffb75c02e6f24e27f9b9

var cheerio = require('cheerio')

function parse(bookmark){
    var $ = cheerio.load(bookmark)

    function getCategories($a) {
        var $node = $a.closest('DL').prev();
        var title = $node.text();
        var add_date = $node.attr("add_date");
        var last_modified = $node.attr("last_modified");
        if ($node.length > 0 && title.length > 0) {
            return [{
            'name': title,
            'last_modified': typeof last_modified === "undefined" ? null : last_modified ,
            'add_date': typeof add_date === "undefined" ? null : add_date,
            }].concat(getCategories($node));
        } else {
            return [];
        }
    }

    var jsonbmArray = []
    $('a').each(function(index, a) {
        let $a = $(a)
        let add_date = $a.attr('add_date')
        let last_modified = $a.attr('last_modified')
        let description = $a.next('dd').text().split("\n")[0] // ugly but works
        let categories = getCategories($a)
        // add level information
        let new_categories = categories.reverse().map(function(currentValue, index) {
            return currentValue['level'] = index + 1, currentValue
        })
        try {
            var tags = $a.attr('tags').split(',') || []
        } catch(e) {
            var tags = []
        }
        let jsonbm = {
            'description': description,
            'title': $a.text(),
            'url': $a.attr('href'),
            'categories': categories,
            'tags': tags,
            'last_modified': typeof last_modified === "undefined" ? null : last_modified ,
            'add_date': typeof add_date === "undefined" ? null : add_date,
        }
        jsonbmArray.push(jsonbm)
    })
    return jsonbmArray
}

module.exports = parse