const {getFilters} = require('../../commands/filter/get-filters');

describe('find all', () => {

    it('should return all objects', async () => {
        const res = await getFilters();
        expect(res).toBeDefined();
    });

});
