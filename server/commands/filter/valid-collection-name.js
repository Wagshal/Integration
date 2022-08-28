function validCollectionName(name) {
    return name.replace(/^[^\w]+|[^\w]+$/g, "_").replace(/ /g, '_');
}

module.exports = { validCollectionName };
