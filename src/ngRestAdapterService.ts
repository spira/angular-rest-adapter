/// <reference path="../typings/lodash/lodash.d.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="./NgRestAdapterInterfaces.ts" />

module NgRestAdapter {

    export class NgRestAdapterService implements INgRestAdapterService {

        /**
         * Construct the service with dependencies injected
         * @param config
         * @param $q
         * @param $http
         */
        constructor(
            private config:INgRestAdapterServiceConfig,
            private $q: ng.IQService,
            private $http: ng.IHttpService
        ) {

        }

        options(url:string, headers:ng.IHttpHeadersGetter):ng.IHttpPromise<any> {
            return undefined;
        }

        get(url:string, headers:ng.IHttpHeadersGetter):ng.IHttpPromise<any> {
            return undefined;
        }

        head(url:string, headers:ng.IHttpHeadersGetter):ng.IHttpPromise<any> {
            return undefined;
        }

        put(url:string, data:any, headers:ng.IHttpHeadersGetter):ng.IHttpPromise<any> {
            return undefined;
        }

        post(url:string, data:any, headers:ng.IHttpHeadersGetter):ng.IHttpPromise<any> {
            return undefined;
        }

        patch(url:string, data:any, headers:ng.IHttpHeadersGetter):ng.IHttpPromise<any> {
            return undefined;
        }

        remove(url:string, data:any, headers:ng.IHttpHeadersGetter):ng.IHttpPromise<any> {
            return undefined;
        }

        api(url:string):NgRestAdapter.NgRestAdapterService {
            return undefined;
        }

        uuid():string {
            return undefined;
        }

        isUuid(uuid:string):boolean {
            return undefined;
        }

        getConfig():NgRestAdapter.INgRestAdapterServiceConfig {
            return this.config;
        }

    }

}
