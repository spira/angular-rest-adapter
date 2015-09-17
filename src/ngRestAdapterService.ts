/// <reference path="../typings/tsd.d.ts" />

module NgRestAdapter {

    export class NgRestAdapterService implements INgRestAdapterService {

        private apiErrorHandler:IApiErrorHandler;
        private skipInterceptorRoutes:Array<RegExp|string>;

        /**
         * Construct the service with dependencies injected
         * @param config
         * @param $http
         * @param uuid4
         */
        constructor(
            private config:INgRestAdapterServiceConfig,
            private $http: ng.IHttpService,
            private uuid4
        ) {

        }

        private sendRequest(method:string, url:string, requestHeaders:IHeaderConfig = {}, data?:any, configOverrides?:ng.IRequestShortcutConfig) {

            var defaultHeaders:IHeaderConfig = {
                'Content-Type' : (config:ng.IRequestConfig) => {
                    if (data || (config && config.data)){
                        return 'application/json';
                    }

                    return null;
                }
            };

            //set the default config
            var requestConfig:ng.IRequestConfig = {
                method: method,
                url:  this.config.baseUrl + url,
                headers: _.defaults(requestHeaders, defaultHeaders),
                responseType: 'json', //it could always be json as even a head request might throw an exception as json
                ngRestAdapterServiceConfig: this.config
            };

            //if data is present, attach it to config
            if (!_.isEmpty(data)){
                requestConfig.data = data;
            }

            //handle overrides
            if (!_.isEmpty(configOverrides)){
                requestConfig = <ng.IRequestConfig>_.defaults(configOverrides, requestConfig);
            }

            var resultPromise = this.$http(requestConfig);

            return resultPromise;
        }

        public options(url:string, headers?:IHeaderConfig, configOverrides?:ng.IRequestShortcutConfig):ng.IHttpPromise<any> {
            return this.sendRequest('OPTIONS', url, headers, null, configOverrides);
        }

        public get(url:string, headers?:IHeaderConfig, configOverrides?:ng.IRequestShortcutConfig):ng.IHttpPromise<any> {
            return this.sendRequest('GET', url, headers, null, configOverrides);
        }

        public head(url:string, headers?:IHeaderConfig, configOverrides?:ng.IRequestShortcutConfig):ng.IHttpPromise<any> {
            return this.sendRequest('HEAD', url, headers, null, configOverrides);
        }

        public put(url:string, data:any, headers?:IHeaderConfig, configOverrides?:ng.IRequestShortcutConfig):ng.IHttpPromise<any> {
            return this.sendRequest('PUT', url, headers, data, configOverrides);
        }

        public post(url:string, data:any, headers?:IHeaderConfig, configOverrides?:ng.IRequestShortcutConfig):ng.IHttpPromise<any> {
            return this.sendRequest('POST', url, headers, data, configOverrides);
        }

        public patch(url:string, data:any, headers?:IHeaderConfig, configOverrides?:ng.IRequestShortcutConfig):ng.IHttpPromise<any> {
            return this.sendRequest('PATCH', url, headers, data, configOverrides);
        }

        public remove(url:string, data?:any, headers?:IHeaderConfig, configOverrides?:ng.IRequestShortcutConfig):ng.IHttpPromise<any> {
            return this.sendRequest('DELETE', url, headers, data, configOverrides);
        }

        public api(url:string):NgRestAdapterService {

            let config = <INgRestAdapterServiceConfig>_.defaults({baseUrl:url}, this.config);

            return new NgRestAdapterService(config, this.$http, this.uuid4);
        }

        public skipInterceptor(shouldSkip:ISkipInterceptorFunction = () => true):NgRestAdapterService {

            let config = <INgRestAdapterServiceConfig>_.defaults({skipInterceptor:shouldSkip}, this.config);

            return new NgRestAdapterService(config, this.$http, this.uuid4);

        }

        public uuid():string {
            return <string>this.uuid4.generate();
        }

        public isUuid(uuid:string):boolean {
            return <boolean>this.uuid4.validate(uuid);
        }

        public getConfig():NgRestAdapter.INgRestAdapterServiceConfig {
            return this.config;
        }

        public registerApiErrorHandler(apiErrorHandler:IApiErrorHandler):NgRestAdapterService {
            if (_.isFunction(this.apiErrorHandler)){
                throw new NgRestAdapterException("You cannot redeclare the api error handler");
            }
            this.apiErrorHandler = apiErrorHandler;

            return this;
        }

        public getErrorHandler():IApiErrorHandler{

            if (_.isFunction(this.apiErrorHandler)){

                return this.apiErrorHandler;
            }

            throw new NgRestAdapterErrorHandlerNotFoundException("API Error handler is not set");
        }

        public getSkipInterceptorRoutes():Array<RegExp|string>{
            return this.skipInterceptorRoutes;
        }


        public setSkipInterceptorRoutes(excludedRoutes:Array<RegExp|string>):NgRestAdapter.NgRestAdapterService {

            this.skipInterceptorRoutes = excludedRoutes;

            return this;
        }

    }

}
