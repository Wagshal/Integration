const { validQuery } = require('../../commands/filter/valid-query');

describe('valid object', () => {

    it('should return valid object', async () => {
        const testString = JSON.stringify({ name: 1 });
        const res = await validQuery(testString);
        expect(res).toEqual(JSON.stringify({ "name": 1 }));
    });

});
