/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../dist/NgRestAdapter.d.ts" />


let expect = chai.expect;

let fixtures = {

    get customConfig():NgRestAdapter.INgRestAdapterServiceConfig{
        return {
            baseUrl: 'http://api.example.com/path/to/api/root',
            defaultHeaders: {
                'Test-Header': 'This is a test header'
            }
        };
    },

};

let $http:ng.IHttpService;

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

        expect(testInvalidConfigurationFn).to.throw(NgRestAdapter.NgRestAdapterException);

    });

    beforeEach(()=>{
        inject((_ngRestAdapter_) => {
            customRestAdapter = _ngRestAdapter_;
        })
    });

    it('should have the custom configuration', function() {

        let configuration = customRestAdapter.getConfig();

        return expect(configuration).to.deep.equal(fixtures.customConfig);

    });


});

describe('Service tests', () => {

    let $httpBackend:ng.IHttpBackendService;
    let ngRestAdapterService:NgRestAdapter.NgRestAdapterService;


    beforeEach(()=>{

        module('ngRestAdapter');

        inject((_$httpBackend_, _ngRestAdapter_, _$http_) => {

            if (!ngRestAdapterService){
                $httpBackend = _$httpBackend_;
                ngRestAdapterService = _ngRestAdapter_; //register injected service provider
                $http = _$http_;
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

    describe('REST requests', () => {

        it('should complete a GET request when called', () => {

            $httpBackend.expectGET('/api/any').respond('ok');

            let responsePromise = ngRestAdapterService.get('/any');

            $httpBackend.flush();

            expect(responsePromise).eventually.to.be.instanceOf(Object);

        });


    })


});
