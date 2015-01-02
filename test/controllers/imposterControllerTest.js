'use strict';

var assert = require('assert'),
    mock = require('../mock').mock,
    Controller = require('../../src/controllers/imposterController'),
    FakeResponse = require('../fakes/fakeResponse');

describe('ImposterController', function () {

    describe('#get', function () {
        it('should return JSON for imposter at given id', function () {
            var response = FakeResponse.create(),
                imposters = {
                    1: { toJSON: mock().returns('firstJSON') },
                    2: { toJSON: mock().returns('secondJSON') }
                },
                controller = Controller.create(imposters);

            controller.get({ url: '/imposters/2', params: { id: 2 }}, response);

            assert.strictEqual(response.body, 'secondJSON');
        });

        it('should return replayable JSON for imposter at given id if replayable querystring set', function () {
            var response = FakeResponse.create(),
                imposters = {
                    1: { toJSON: mock().returns('firstJSON') },
                    2: { toJSON: mock().returns('secondJSON') }
                },
                controller = Controller.create(imposters);

            controller.get({ url: '/imposters/2?replayable=true', params: { id: 2 }}, response);

            assert.strictEqual(response.body, 'secondJSON');
            assert.ok(imposters['2'].toJSON.wasCalledWith({ replayable: true }));
        });

        it('should return normal JSON for imposter at given id replayable querystring is false', function () {
            var response = FakeResponse.create(),
                imposters = {
                    1: { toJSON: mock().returns('firstJSON') },
                    2: { toJSON: mock().returns('secondJSON') }
                },
                controller = Controller.create(imposters);

            controller.get({ url: '/imposters/2?replayable=false', params: { id: 2 }}, response);

            assert.strictEqual(response.body, 'secondJSON');
            assert.ok(imposters['2'].toJSON.wasCalledWith({ replayable: false }));
        });
    });

    describe('#del', function () {
        it('should stop the imposter', function () {
            var response = FakeResponse.create(),
                imposter = { stop: mock(), toJSON: mock().returns('JSON') },
                controller = Controller.create({ 1: imposter });

            controller.del({ params: { id: 1 }}, response);

            assert(imposter.stop.wasCalled());
        });

        it('should remove the imposter from the list', function () {
            var response = FakeResponse.create(),
                imposters = { 1: { stop: mock(), toJSON: mock().returns('JSON') }},
                controller = Controller.create(imposters);

            controller.del({ params: { id: 1 }}, response);

            assert.deepEqual(imposters, {});
        });

        it('should send request even if no imposter exists', function () {
            var response = FakeResponse.create(),
                imposters = {},
                controller = Controller.create(imposters);

            controller.del({ params: { id: 1 }}, response);

            assert.deepEqual(response.body, {});
        });

        it('should send JSON for the deleted the imposter', function () {
            var response = FakeResponse.create(),
                imposter = { stop: mock(), toJSON: mock().returns('JSON') },
                controller = Controller.create({ 1: imposter });

            controller.del({ params: { id: 1 }}, response);

            assert.strictEqual(response.body, 'JSON');
        });
    });
});
