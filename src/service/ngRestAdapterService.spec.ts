import {expect, seededChance, NgRestAdapterService} from "../testBootstrap.spec";

let $http:ng.IHttpService;
let $q:ng.IQService;

describe('Service tests', () => {

    let $httpBackend:ng.IHttpBackendService;
    let ngRestAdapterService:NgRestAdapterService;
    let $exceptionHandler;
    let $rootScope:ng.IRootScopeService;

    beforeEach(() => {

        angular.mock.module('ngRestAdapter');

        angular.mock.module(function ($exceptionHandlerProvider) {
            $exceptionHandlerProvider.mode('log');
        });

        inject((_$httpBackend_, _ngRestAdapter_, _$http_, _$q_, _$exceptionHandler_, _$rootScope_) => {

            $httpBackend = _$httpBackend_;
            ngRestAdapterService = _ngRestAdapter_; //register injected service provider
            $http = _$http_;
            $q = _$q_;
            $exceptionHandler = _$exceptionHandler_;
            $rootScope = _$rootScope_;

        });

    });

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('Initialisation', () => {

        it('should be an injectable service', () => {

            return expect(ngRestAdapterService).to.be.an('object');
        });

    });

    describe('Aliased REST requests', () => {

        let testData = {
            name: seededChance.name,
            email: seededChance.email,
        };

        it('should complete a  GET request when called', (done) => {

            $httpBackend.expectGET('/api/any').respond('ok');
            let responsePromise = ngRestAdapterService.get('/any');
            $httpBackend.flush();
            expect(responsePromise).eventually.to.be.instanceOf(Object).and.notify(done);
            $rootScope.$apply();

        });

        it('should complete a  HEAD request when called', (done) => {

            $httpBackend.expectHEAD('/api/any').respond(200);
            let responsePromise = ngRestAdapterService.head('/any');
            $httpBackend.flush();
            expect(responsePromise).eventually.to.be.fulfilled.and.notify(done);
            $rootScope.$apply();
        });

        it('should complete an OPTIONS request when called', (done) => {

            $httpBackend.expect('OPTIONS', '/api/any').respond(200);
            let responsePromise = ngRestAdapterService.options('/any');
            $httpBackend.flush();
            expect(responsePromise).eventually.to.be.fulfilled.and.notify(done);
            $rootScope.$apply();
        });

        it('should complete a  PUT request when called', (done) => {

            $httpBackend.expectPUT('/api/any', testData).respond(200);
            let responsePromise = ngRestAdapterService.put('/any', testData);
            $httpBackend.flush();
            expect(responsePromise).eventually.to.be.fulfilled.and.notify(done);
            $rootScope.$apply();
        });

        it('should complete a  POST request when called', (done) => {

            $httpBackend.expectPOST('/api/any', testData).respond(200);
            let responsePromise = ngRestAdapterService.post('/any', testData);
            $httpBackend.flush();
            expect(responsePromise).eventually.to.be.fulfilled.and.notify(done);
            $rootScope.$apply();
        });

        it('should complete a  PATCH request when called', (done) => {

            $httpBackend.expectPATCH('/api/any', testData).respond(200);
            let responsePromise = ngRestAdapterService.patch('/any', testData);
            $httpBackend.flush();
            expect(responsePromise).eventually.to.be.fulfilled.and.notify(done);
            $rootScope.$apply();
        });

        it('should complete a  DELETE request when called', (done) => {

            $httpBackend.expectDELETE('/api/any').respond(200);
            let responsePromise = ngRestAdapterService.remove('/any', testData);
            $httpBackend.flush();
            expect(responsePromise).eventually.to.be.fulfilled.and.notify(done);
            $rootScope.$apply();
        });

    });

    describe('Api responses', () => {

        it('should return an api response with config.isBaseUrl set to true when using the base url', (done) => {

            $httpBackend.expectGET('/api/any').respond('ok');

            let baseResponsePromise = ngRestAdapterService.get('/any');

            $httpBackend.flush();

            expect(baseResponsePromise).to.eventually.have.deep.property('config.isBaseUrl', true).and.notify(done);
            $rootScope.$apply();
        });

        it('should return an api response with config.isBaseUrl set to false when using a custom url', (done) => {

            $httpBackend.expectGET('/other/any').respond('ok');

            let otherResponsePromise = ngRestAdapterService.api('/other').get('/any');

            $httpBackend.flush();

            expect(otherResponsePromise).to.eventually.have.deep.property('config.isBaseUrl', false).and.notify(done);
            $rootScope.$apply();
        });

    });

    describe('Headers', () => {

        it('should add custom headers to a request', (done) => {

            let testHeaders = {
                key1: 'Test-Header1',
                value1: 'test value 1',
                key2: 'Test-Header2',
                value2: 'test value 2',
                key3: 'test value 3',
                value3: 'test value 3',
            };

            $httpBackend.expectGET('/api/any', (headers) => {

                return headers[testHeaders.key1] === testHeaders.value1 //basic string assignment check
                    && headers[testHeaders.key2] === testHeaders.value2 //function assignment check
                    && !headers[testHeaders.key3] //function returning null check
                    ;
            }).respond('ok');

            let responsePromise = ngRestAdapterService.get('/any', {
                [testHeaders.key1]: testHeaders.value1,
                [testHeaders.key2]: () => {
                    return testHeaders.value2;
                },
                [testHeaders.key3]: () => {
                    return null;
                }
            });

            $httpBackend.flush();

            expect(responsePromise).eventually.to.be.fulfilled.and.notify(done);
            $rootScope.$apply();

        });

        it('should have `Content-Type` header when data is provided', (done) => {

            let data = {
                name: seededChance.name,
                email: seededChance.email,
            };

            $httpBackend.expectPUT('/api/any', data, (headers) => {
                return headers['Content-Type'] === 'application/json';
            }).respond('ok');

            let responsePromise = ngRestAdapterService.put('/any', data);

            $httpBackend.flush();

            expect(responsePromise).eventually.to.be.fulfilled.and.notify(done);
            $rootScope.$apply();

        })

    });

    describe('Custom config', () => {

        it('should be able to override the $http config', (done) => {

            $httpBackend.expectGET('/api/any?foo=bar', (headers) => {
                return headers['Accept'] == 'text/csv';
            }).respond(200);
            let responsePromise = ngRestAdapterService.get('/any', null, {
                headers: {
                    'Accept': 'text/csv'
                },
                responseType: 'text',
                params: {
                    foo: 'bar'
                }
            });

            $httpBackend.flush();
            expect(responsePromise).eventually.to.be.fulfilled.and.notify(done);
            $rootScope.$apply();

        });

        it('should be able to temporarily override the baseurl', () => {

            let someOtherBase = seededChance.domain();
            $httpBackend.expectGET('/api/any').respond('ok'); //the original base
            $httpBackend.expectGET(someOtherBase + '/something-else').respond('ok'); //the new base
            $httpBackend.expectGET('/api/any').respond('ok'); //the original base

            let responseStandardApiPromiseBefore = ngRestAdapterService.get('/any');
            let responseCustomApiPromise = ngRestAdapterService.api(someOtherBase).get('/something-else');
            let responseStandardApiPromiseAfter = ngRestAdapterService.get('/any');

            expect(responseStandardApiPromiseBefore).eventually.to.be.fulfilled;
            expect(responseCustomApiPromise).eventually.to.be.fulfilled;
            expect(responseStandardApiPromiseAfter).eventually.to.be.fulfilled;

            $httpBackend.flush();

        });

    });

    describe('UUID helper functions', () => {

        it('should be able to retrieve a random uuid', () => {

            let firstUuid = ngRestAdapterService.uuid();
            let secondUuid = ngRestAdapterService.uuid();

            expect(firstUuid).not.to.equal(secondUuid);
            expect(firstUuid).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

        });

        it('should be able to validate a uuid', () => {

            let fixedUuidExample = '0d9c2c94-d24f-41bd-a89d-99d388def875';
            let fixedInvalidUuidExample = 'not-a-uuid';
            let valid = ngRestAdapterService.isUuid(fixedUuidExample);
            let invalid = ngRestAdapterService.isUuid(fixedInvalidUuidExample);

            expect(valid).to.be.true;
            expect(invalid).not.to.be.true;

        });

    });

});
