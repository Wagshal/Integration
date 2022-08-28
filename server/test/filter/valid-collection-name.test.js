const { validCollectionName } = require('../../commands/filter/valid-collection-name');

describe('valid string', () => {

    it('should return a clean string', async () => {
        const testString = "abc e";
        const res = await validCollectionName(testString);
        expect(res).toEqual("abc_e");
    });

});
