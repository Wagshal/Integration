const fs = require('fs');

function importWorkspaces(url) {
    console.log({url})
    try {
        return JSON.parse(fs.readFileSync(url, 'utf-8'));
    } catch (err) {
        throw err;
    }
}

module.exports = { importWorkspaces };
