"use strict"
const assert = require("chai").assert;
const sinon = require("sinon");
const isKeyword = require("../src/services/");
const db = require("../src/database/cloudant/cloudant");
const data = require('../scripts/cloudant-AR.json');

const countries = ['AR', 'BR', 'CH', 'UR', 'CO', 'VE'];
const words = ['cabeza', 'HD', 'noble', 'SOS', 'potrillo', 'OSO', 'piantao'];

describe("Keyword test", () => {
    let client;
    before(() => {
        client = sinon.stub(db, 'getKeywordList');
    });

    after(() => {
        client.reset();
    })
    it('should check a valid word', async () => {
        client.resolves(data.docs);
        const result = await isKeyword(
            countries[0],
            words[Math.floor(Math.random() * 3) * 2 + 1],
            0
        );

        assert.typeOf(result, 'boolean');
        assert.equal(result, true);
    });
    it('should check a invalid word', async function () {
        client.resolves(data.docs);
        const result = await isKeyword(
            countries[0],
            words[Math.floor(Math.random() * 3) * 2],
            0
        );

        assert.typeOf(result, 'boolean');
        assert.equal(result, false);
    });

    it('should check an invalid country', async function () {
        client.resolves(data.docs);
        const result = await isKeyword(
            countries[1],
            words[Math.floor(Math.random() * 3) * 2 + 1],
            0
        );

        assert.typeOf(result, 'boolean');
        assert.equal(result, false);
    });
    it('should check a chatbot word', async function () {
        client.resolves(data.docs);
        const result = await isKeyword(
            countries[1],
            words[Math.floor(Math.random() * 3) * 2 + 1],
            1
        );

        assert.typeOf(result, 'boolean');
        assert.equal(result, false);
    });
    it('should check for errors', async function () {
        client.resolves([]);
        const result = await isKeyword(
            countries[1],
            words[Math.floor(Math.random() * 3) * 2 + 1],
            1
        );

        assert.typeOf(result, 'boolean');
        assert.equal(result, false);
    })
});
