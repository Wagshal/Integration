function validQuery(query) {
    try {
        JSON.parse(query);
    }
    catch {
        let i = 0;
        while (query.indexOf("{", i) !== -1) {
            i = query.indexOf("{", i);
            query = query.substring(0, i + 1) + '"' + query.substring(i + 1, query.length);
            i += 3;
        }
        i = 0;
        while (query.indexOf(":", i) != -1) {
            i = query.indexOf(":", i);
            query = query.substring(0, i) + '"' + query.substring(i, query.length);
            i += 3;
        }
    }
    return query;
}

module.exports = { validQuery };
