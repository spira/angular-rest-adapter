/// <reference path="../typings/tsd.d.ts" />

module NgRestAdapter {

    export interface INgRestAdapterService {

        options(url:string, headers:ng.IHttpHeadersGetter):ng.IHttpPromise<any>;
        get(url:string, headers:ng.IHttpHeadersGetter):ng.IHttpPromise<any>;
        head(url:string, headers:ng.IHttpHeadersGetter):ng.IHttpPromise<any>;
        put(url:string, data:any, headers:ng.IHttpHeadersGetter):ng.IHttpPromise<any>;
        post(url:string, data:any, headers:ng.IHttpHeadersGetter):ng.IHttpPromise<any>;
        patch(url:string, data:any, headers:ng.IHttpHeadersGetter):ng.IHttpPromise<any>;
        remove(url:string, data:any, headers:ng.IHttpHeadersGetter):ng.IHttpPromise<any>;

        api(url:string):NgRestAdapter.NgRestAdapterService;

        uuid():string;
        isUuid(uuid:string):boolean;

        getConfig():INgRestAdapterServiceConfig;

    }

    export interface INgRestAdapterServiceProvider {
        configure(config:INgRestAdapterServiceConfig): NgRestAdapterServiceProvider;
    }

    export interface INgRestAdapterServiceConfig {
        baseUrl: string;
        defaultHeaders: {
            [header: string] : string;
        }
    }

}
