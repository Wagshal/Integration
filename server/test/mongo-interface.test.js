const request = require('supertest');

const app = require('../server');

const { MongoClient } = require('mongodb');

let mongoConnectSpy;

describe('check mongo-interface for dump', () => {
    describe('check import db list by workspace name', () => {
        let url = "mongodb://localhost:27017"
        beforeEach(async () => {
            mongoConnectSpy = jest
                .spyOn(MongoClient, 'connect')
                .mockResolvedValue({
                    db: () => {
                        return {
                            admin: () => {
                                return {
                                    listDatabases: () => {
                                        return {
                                            databases: [
                                                {
                                                    name: 'collection A'
                                                },
                                                {
                                                    name: 'collection B'
                                                },
                                                {
                                                    name: 'collection C'
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
        });

        afterEach(async () => {
            mongoConnectSpy && mongoConnectSpy.mockRestore();
        });

        it('Check db list by workspace name', async () => {
            const response = await request(app)
                .get('/mongo_interface/get_dbs/')
                .query({ workspace: url });

            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.text))
                .toEqual({ DBS: ['collection A', 'collection B', 'collection C'] });
        });
    });

    describe('Check collection list by DB name', () => {
        const dbName = 'TEST_DB';
        const collectionList = [
            'test_collection_A',
            'test_collection_B',
            'test_collection_C'
        ];

        const url = "mongodb://localhost:27017";
        let db, connection;

        beforeEach(async () => {
            connection = await MongoClient.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            db = connection.db(dbName)
            await Promise.all(
                collectionList.map(async (collName) => await db.createCollection(collName))
            )
        });

        afterEach(async () => {
            const collections = await db.listCollections();
            await collections.forEach(async collection => {
                await db.collection(collection.name).drop();
            });
        });

        it('Check collection list by db name', async () => {
            const response = await request(app)
                .get('/mongo_interface/get_collection_per_db')
                .query({ workspace: url, db: dbName });
            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.text))
                .toEqual(({
                    collections: expect.arrayContaining([
                        'test_collection_A',
                        'test_collection_B',
                        'test_collection_C'
                    ])
                }));
        });
    });
});
