import "angular";
import "angular-mocks";
import "../ngRestAdapter";
import {NgRestAdapterServiceProvider, NgRestAdapterException} from "../provider/ngRestAdapterServiceProvider";
import {NgRestAdapterService} from "../service/ngRestAdapterService";
import {fixtures} from  "../fixtures.spec";
let expect:Chai.ExpectStatic = chai.expect;

describe('Custom configuration', function () {

    let NgRestAdapterProvider:NgRestAdapterServiceProvider;
    let customRestAdapter:NgRestAdapterService;

    beforeEach(() => {

        angular.mock.module('ngRestAdapter', (_ngRestAdapterProvider_) => {
            NgRestAdapterProvider = _ngRestAdapterProvider_; //register injection of service provider

            NgRestAdapterProvider.configure(fixtures.customConfig);

        });

    });

    it('should throw an exception when invalid configuration is passed', () => {

        let testInvalidConfigurationFn = () => {
            NgRestAdapterProvider.configure(<any>{invalid: 'config'});
        };

        expect(testInvalidConfigurationFn).to.throw(NgRestAdapterException, /Invalid properties \[invalid\] passed to config/);

    });

    beforeEach(()=> {
        inject((_ngRestAdapter_) => {
            customRestAdapter = _ngRestAdapter_;
        })
    });

    it('should have the custom configuration', function () {

        let configuration = customRestAdapter.getConfig();

        expect(configuration.baseUrl).to.equal(fixtures.customConfig.baseUrl);
        expect(configuration.defaultHeaders).to.deep.equal(fixtures.customConfig.defaultHeaders);

    });

});

