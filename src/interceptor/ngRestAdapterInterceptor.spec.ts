import {
    expect,
    NgRestAdapterService,
    NgRestAdapterException
} from "../testBootstrap.spec";

let $http:ng.IHttpService;
let $q:ng.IQService;

describe('Interceptor tests', () => {

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

    describe('Error interceptor', () => {

        let throwException = false;
        let errorHandlerSpy = sinon.spy();
        let errorHandlerMock = (requestConfig:ng.IRequestConfig, responseObject:ng.IHttpPromiseCallbackArg<any>):void => {

            errorHandlerSpy(requestConfig, responseObject); //spy on the options

            if (throwException) {
                throw Error("An error occurred!");
            }

        };

        describe('registration', () => {

            it('should respond with error when no error handler is set', (done) => {
                $httpBackend.expectGET('/api/any').respond(401);

                let response = ngRestAdapterService.get('/any'); //try to get a resource

                $httpBackend.flush();

                expect(errorHandlerSpy.called).to.be.false;
                expect(response).eventually.to.be.rejected.and.notify(done);
                $rootScope.$apply();
            });

            it('should be able to register an api error handler factory', () => {

                //set credential promise factory
                ngRestAdapterService.registerApiErrorHandler(errorHandlerMock);

                expect(errorHandlerSpy.called).to.be.false;

            });

            it('should not be able to re-set the api error handler', () => {

                ngRestAdapterService.registerApiErrorHandler(errorHandlerMock);

                let setFactoryFn = () => {
                    ngRestAdapterService.registerApiErrorHandler(errorHandlerMock);
                };

                expect(setFactoryFn).to.throw(NgRestAdapterException, /cannot redeclare the api error handler/);

            });

        });

        describe('intercepting', () => {

            beforeEach(() => {
                ngRestAdapterService.registerApiErrorHandler(errorHandlerMock);
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

    });

    describe('Base $http usage', () => {

        let spiedHandler;
        beforeEach(() => {

            $exceptionHandler.errors = []; //clear errors

        });

        it('should allow the $http service to be used as normal (success)', (done) => {

            (<any>ngRestAdapterService).apiErrorHandler = null; //unset the error handler (normally not allowed)

            spiedHandler = sinon.spy(); //spy on (private) error handler
            ngRestAdapterService.registerApiErrorHandler(spiedHandler);

            $httpBackend.expectGET('/any').respond('ok'); //the original base

            let httpPromise = $http.get('/any');

            $httpBackend.flush();

            expect($exceptionHandler.errors).to.be.empty; //no errors initially

            expect(httpPromise).eventually.to.be.fulfilled.and.have.deep.property('data', 'ok').and.notify(done);
            $rootScope.$apply();
        });

        it('should be able to set interceptor routes', () => {

            let routeRegex = /\/excluded\/regex.*/;
            let stringMatch = '/excluded/string/example';

            ngRestAdapterService.setSkipInterceptorRoutes([routeRegex, stringMatch]);

            expect(ngRestAdapterService.getSkipInterceptorRoutes()[0]).to.equal(routeRegex);
            expect(ngRestAdapterService.getSkipInterceptorRoutes()[1]).to.equal(stringMatch);

        });

        it('should not intercept excluded (by regex) domains', (done) => {

            $httpBackend.expectGET('/excluded/regex/example').respond(500, 'error');

            let httpPromise = $http.get('/excluded/regex/example');

            $httpBackend.flush();

            expect(spiedHandler).not.to.have.been.called;
            expect(httpPromise).eventually.to.be.rejected.and.have.deep.property('data', 'error').and.notify(done);
            $rootScope.$apply();
        });

        it('should not intercept excluded (by string match) domains', (done) => {

            $httpBackend.expectGET('/excluded/string/example').respond(500, 'error');

            let httpPromise = $http.get('/excluded/string/example');

            $httpBackend.flush();

            expect(spiedHandler).not.to.have.been.called;
            expect(httpPromise).eventually.to.be.rejected.and.have.deep.property('data', 'error').and.notify(done);
            $rootScope.$apply();
        });

        it('should allow the $http service to be used as normal (error intercepted)', (done) => {

            $httpBackend.expectGET('/any').respond(500, 'error'); //the original base

            let httpPromise = $http.get('/any');

            $httpBackend.flush();

            expect(spiedHandler).not.to.have.been.called;

            expect($exceptionHandler.errors).to.be.empty; //no errors after the fact
            expect(httpPromise).eventually.to.be.rejected.and.have.deep.property('data', 'error').and.notify(done);
            $rootScope.$apply();

        });

    });

});
