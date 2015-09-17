/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../dist/ngRestAdapter.d.ts" />


let expect = chai.expect;
let seededChance = new Chance(1);
let fixtures = {

    get customConfig():NgRestAdapter.INgRestAdapterServiceConfig{
        return {
            baseUrl: 'http://api.example.com/path/to/api/root',
            defaultHeaders: {
                'Test-Header': 'This is a test header'
            },
            skipInterceptor: () => false
        };
    },

};

let $http:ng.IHttpService;
let $q:ng.IQService;

describe('Custom configuration', function () {

    let NgRestAdapterProvider:NgRestAdapter.NgRestAdapterServiceProvider;
    let customRestAdapter:NgRestAdapter.NgRestAdapterService;

    beforeEach(() => {

        module('ngRestAdapter', (_ngRestAdapterProvider_) => {
            NgRestAdapterProvider = _ngRestAdapterProvider_; //register injection of service provider

            NgRestAdapterProvider.configure(fixtures.customConfig);

        });

    });

    it('should throw an exception when invalid configuration is passed', () => {

        let testInvalidConfigurationFn = () => {
            NgRestAdapterProvider.configure(<any>{invalid:'config'});
        };

        expect(testInvalidConfigurationFn).to.throw(NgRestAdapter.NgRestAdapterException, /Invalid properties \[invalid\] passed to config/);

    });

    beforeEach(()=>{
        inject((_ngRestAdapter_) => {
            customRestAdapter = _ngRestAdapter_;
        })
    });

    it('should have the custom configuration', function() {

        let configuration = customRestAdapter.getConfig();

        expect(configuration.baseUrl).to.equal(fixtures.customConfig.baseUrl);
        expect(configuration.defaultHeaders).to.deep.equal(fixtures.customConfig.defaultHeaders);

    });


});

describe('Service tests', () => {

    let $httpBackend:ng.IHttpBackendService;
    let ngRestAdapterService:NgRestAdapter.NgRestAdapterService;
    let $exceptionHandler;


    beforeEach(()=>{

        module('ngRestAdapter');


        module(function($exceptionHandlerProvider) {
            $exceptionHandlerProvider.mode('log');
        });

        inject((_$httpBackend_, _ngRestAdapter_, _$http_, _$q_, _$exceptionHandler_) => {

            if (!ngRestAdapterService){
                $httpBackend = _$httpBackend_;
                ngRestAdapterService = _ngRestAdapter_; //register injected service provider
                $http = _$http_;
                $q = _$q_;
                $exceptionHandler = _$exceptionHandler_
            }

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
            name : seededChance.name,
            email: seededChance.email,
        };

        it('should complete a  GET request when called', () => {

            $httpBackend.expectGET('/api/any').respond('ok');

            let responsePromise = ngRestAdapterService.get('/any');

            $httpBackend.flush();

            expect(responsePromise).eventually.to.be.instanceOf(Object);

        });

        it('should complete a  HEAD request when called', () => {

            $httpBackend.expectHEAD('/api/any').respond(200);
            let responsePromise = ngRestAdapterService.head('/any');
            $httpBackend.flush();
            expect(responsePromise).eventually.to.be.fulfilled;
        });

        it('should complete an OPTIONS request when called', () => {

            $httpBackend.expect('OPTIONS', '/api/any').respond(200);
            let responsePromise = ngRestAdapterService.options('/any');
            $httpBackend.flush();
            expect(responsePromise).eventually.to.be.fulfilled;
        });

        it('should complete a  PUT request when called', () => {

            $httpBackend.expectPUT('/api/any', testData).respond(200);
            let responsePromise = ngRestAdapterService.put('/any', testData);
            $httpBackend.flush();
            expect(responsePromise).eventually.to.be.fulfilled;
        });

        it('should complete a  POST request when called', () => {

            $httpBackend.expectPOST('/api/any', testData).respond(200);
            let responsePromise = ngRestAdapterService.post('/any', testData);
            $httpBackend.flush();
            expect(responsePromise).eventually.to.be.fulfilled;
        });

        it('should complete a  PATCH request when called', () => {

            $httpBackend.expectPATCH('/api/any', testData).respond(200);
            let responsePromise = ngRestAdapterService.patch('/any', testData);
            $httpBackend.flush();
            expect(responsePromise).eventually.to.be.fulfilled;
        });

        it('should complete a  DELETE request when called', () => {

            $httpBackend.expectDELETE('/api/any').respond(200);
            let responsePromise = ngRestAdapterService.remove('/any', testData);
            $httpBackend.flush();
            expect(responsePromise).eventually.to.be.fulfilled;
        });

    });

    describe('Headers', () => {

        it('should add custom headers to a request', () => {

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
                [testHeaders.key1] : testHeaders.value1,
                [testHeaders.key2] : () => {
                    return testHeaders.value2;
                },
                [testHeaders.key3] : () => {
                    return null;
                }
            });

            $httpBackend.flush();

            expect(responsePromise).eventually.to.be.fulfilled;

        });

        it('should have `Content-Type` header when data is provided', () => {

            let data = {
                name : seededChance.name,
                email: seededChance.email,
            };

            $httpBackend.expectPUT('/api/any', data, (headers) => {
                return headers['Content-Type'] === 'application/json';
            }).respond('ok');

            let responsePromise = ngRestAdapterService.put('/any', data);

            $httpBackend.flush();

            expect(responsePromise).eventually.to.be.fulfilled;

        })



    });

    describe('Custom config', () => {

        it('should be able to override the $http config', () => {

            $httpBackend.expectGET('/api/any?foo=bar',  (headers) => {
                return headers['Accept'] == 'text/csv';
            }).respond(200);
            let responsePromise = ngRestAdapterService.get('/any', null, {
                headers: {
                    'Accept':'text/csv'
                },
                responseType: 'text',
                params: {
                    foo: 'bar'
                }
            });

            $httpBackend.flush();
            expect(responsePromise).eventually.to.be.fulfilled;

        });

        it('should be able to temporarily override the baseurl', () => {

            let someOtherBase = seededChance.domain();
            $httpBackend.expectGET('/api/any').respond('ok'); //the original base
            $httpBackend.expectGET(someOtherBase+'/something-else').respond('ok'); //the new base
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

    describe('Error interceptor', () => {


        let throwException = false;
        let errorHandlerSpy = sinon.spy();
        let errorHandlerMock = (requestConfig:ng.IRequestConfig, responseObject:ng.IHttpPromiseCallbackArg<any>):void => {

            errorHandlerSpy(requestConfig, responseObject); //spy on the options

            if (throwException){
                throw Error("An error occurred!");
            }

        };

        it('should respond with error when no error handler is set', () => {
            $httpBackend.expectGET('/api/any').respond(401);

            let response  = ngRestAdapterService.get('/any'); //try to get a resource

            $httpBackend.flush();

            expect(errorHandlerSpy.called).to.be.false;
            expect(response).eventually.to.be.rejected;
        });

        it('should be able to register an api error handler factory', () => {


            //set credential promise factory
            ngRestAdapterService.registerApiErrorHandler(errorHandlerMock);


            expect(errorHandlerSpy.called).to.be.false;

        });

        it('should not be able to re-set the api error handler', () => {


            let setFactoryFn = () => {
                ngRestAdapterService.registerApiErrorHandler(errorHandlerMock);
            };


            expect(setFactoryFn).to.throw(NgRestAdapter.NgRestAdapterException, /cannot redeclare the api error handler/);

        });

        it('should not call the api error handler when the api responds with a success', () => {
            $httpBackend.expectGET('/api/any').respond(200);

            ngRestAdapterService.get('/any'); //try to get a resource

            $httpBackend.flush();

            expect(errorHandlerSpy).not.to.be.called;
        });

        it('should call the api error handler when the api responds with an error', () => {
            $httpBackend.expectGET('/api/any').respond(401);

            ngRestAdapterService.get('/any'); //try to get a resource

            $httpBackend.flush();

            expect(errorHandlerSpy).to.be.calledOnce;
        });

        it('should not call the api error handler the api service specifies the interceptor should be skipped', () => {

            $httpBackend.expectGET('/api/any').respond(401);

            ngRestAdapterService.skipInterceptor().get('/any'); //try to get a resource

            $httpBackend.flush();

            expect(errorHandlerSpy.calledOnce).to.be.true;
        });

        it('should be able to define a custom interceptor function to only fail in some conditions', () => {


            let customInterceptor = (rejection:ng.IHttpPromiseCallbackArg<any>):boolean => {

                return rejection.status <= 500;
            };

            $httpBackend.expectGET('/api/fatal').respond(500);
            ngRestAdapterService.skipInterceptor(customInterceptor).get('/fatal'); //get a failing url
            $httpBackend.flush();

            expect(errorHandlerSpy).to.have.been.calledOnce;

            $httpBackend.expectGET('/api/recoverable').respond(416);
            ngRestAdapterService.skipInterceptor(customInterceptor).get('/recoverable'); //get a recoverable url
            $httpBackend.flush();

            expect(errorHandlerSpy).to.have.been.calledOnce; //should not have been called again


        });

        it('should not catch an exception thrown from an error interceptor if it is user supplied', () => {


            $httpBackend.expectGET('/api/any').respond(500);
            throwException = true; //make the error interceptor throw an error

            ngRestAdapterService.get('/any'); //try to get a resource=

            expect($exceptionHandler.errors).to.be.empty; //no errors initially

            $httpBackend.flush();


            expect($exceptionHandler.errors[0]).to.be.instanceOf(Error);

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

    describe('Base $http usage', () => {

        let spiedHandler;
        beforeEach(() => {

            $exceptionHandler.errors = []; //clear errors

        });

        it('should allow the $http service to be used as normal (success)', () => {

            (<any>ngRestAdapterService).apiErrorHandler = null; //unset the error handler (normally not allowed)

            spiedHandler = sinon.spy(); //spy on (private) error handler
            ngRestAdapterService.registerApiErrorHandler(spiedHandler);

            $httpBackend.expectGET('/any').respond('ok'); //the original base

            let httpPromise = $http.get('/any');

            expect(httpPromise).eventually.to.be.fulfilled.and.have.deep.property('data', 'ok');

            $httpBackend.flush();

            expect($exceptionHandler.errors).to.be.empty; //no errors initially

        });

        it ('should be able to set interceptor routes', () => {

            let routeRegex = /\/excluded\/regex.*/;
            let stringMatch = '/excluded/string/example';

            ngRestAdapterService.setSkipInterceptorRoutes([routeRegex, stringMatch]);

            expect(ngRestAdapterService.getSkipInterceptorRoutes()[0]).to.equal(routeRegex);
            expect(ngRestAdapterService.getSkipInterceptorRoutes()[1]).to.equal(stringMatch);

        });

        it('should not intercept excluded (by regex) domains', () => {

            $httpBackend.expectGET('/excluded/regex/example').respond(500, 'error');

            let httpPromise = $http.get('/excluded/regex/example');

            expect(httpPromise).eventually.to.be.rejected.and.have.deep.property('data', 'error');

            $httpBackend.flush();

            expect(spiedHandler).not.to.have.been.called;
        });

        it('should not intercept excluded (by string match) domains', () => {

            $httpBackend.expectGET('/excluded/string/example').respond(500, 'error');

            let httpPromise = $http.get('/excluded/string/example');

            expect(httpPromise).eventually.to.be.rejected.and.have.deep.property('data', 'error');

            $httpBackend.flush();

            expect(spiedHandler).not.to.have.been.called;
        });

        it('should allow the $http service to be used as normal (error intercepted)', () => {


            $httpBackend.expectGET('/any').respond(500, 'error'); //the original base

            let httpPromise = $http.get('/any');

            expect(httpPromise).eventually.to.be.rejected.and.have.deep.property('data', 'error');

            $httpBackend.flush();

            expect(spiedHandler).to.have.been.calledOnce; //interceptor should have been called

            expect($exceptionHandler.errors).to.be.empty; //no errors after the fact

        });

    });



});
