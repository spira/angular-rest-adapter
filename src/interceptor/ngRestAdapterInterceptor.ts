import {NgRestAdapterService} from "../service/ngRestAdapterService";
import {ISkipInterceptorFunction} from "../ngRestAdapterInterfaces";
import * as _ from "lodash";
import {NgRestAdapterErrorHandlerNotFoundException} from "../provider/ngRestAdapterServiceProvider";

/**
 * @todo refactor to proper method declaration not property assignment of closures
 */
export class NgRestAdapterInterceptor {

    private ngRestAdapter:NgRestAdapterService;

    /**
     * Construct the service with dependencies injected
     * @param _$q
     * @param _$injector
     */
    static $inject = ['$q', '$injector'];

    constructor(private $q:ng.IQService,
                private $injector:ng.auto.IInjectorService) {
    }

    private getNgRestAdapterService = ():NgRestAdapterService=> {
        if (this.ngRestAdapter == null) {
            this.ngRestAdapter = this.$injector.get<NgRestAdapterService>('ngRestAdapter');
        }
        return this.ngRestAdapter;
    };

    public responseError = (rejection:ng.IHttpPromiseCallbackArg<any>):any => {

        let ngRestAdapter = this.getNgRestAdapterService();

        let skipInterceptor = <ISkipInterceptorFunction>_.get(rejection.config, 'ngRestAdapterServiceConfig.skipInterceptor');

        if (_.isFunction(skipInterceptor) && skipInterceptor(rejection)) {
            return this.$q.reject(rejection); //exit early
        }

        let skipInterceptorRoutes = ngRestAdapter.getSkipInterceptorRoutes();
        let routeUrl = rejection.config.url;
        if (!_.isEmpty(skipInterceptorRoutes)) {

            let routeMatches = _.some(skipInterceptorRoutes, (routeMatch:RegExp|string) => {

                if (_.isRegExp(routeMatch)) {
                    return (<RegExp>routeMatch).test(routeUrl);
                } else {
                    return routeMatch === routeUrl;
                }

            });

            if (routeMatches) {
                return this.$q.reject(rejection); //exit early
            }

        }

        try {

            let errorHandler = ngRestAdapter.getErrorHandler();

            errorHandler(rejection.config, rejection);

        } catch (e) {
            if (!(e instanceof NgRestAdapterErrorHandlerNotFoundException)) {
                throw e;
            }
            //otherwise do nothing, the developer has not set their own error handler
        }

        return this.$q.reject(rejection);
    };
}

