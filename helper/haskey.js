function hasKey(obj, key) {
    if (obj !== null && obj !== undefined){
        return obj.hasOwnProperty(key)
    }else{
        return false
    }
}

function notEmpty(obj, key) {
    if (hasKey(obj, key)) {
        if (obj[key] === "" || (typeof(obj[key]) == "object" && Object.keys(obj[key]).length === 0)){
            return false
        }
        return true
    }
    return false
}

module.exports = {hasKey, notEmpty}