/// <reference path="../typings/tsd.d.ts" />

module NgRestAdapter {

    export interface INgRestAdapterService {
        options(url:string, headers?:IHeaderConfig, configOverrides?:ng.IRequestShortcutConfig):ng.IHttpPromise<any>;
        get(url:string, headers?:IHeaderConfig, configOverrides?:ng.IRequestShortcutConfig):ng.IHttpPromise<any>;
        head(url:string, headers?:IHeaderConfig, configOverrides?:ng.IRequestShortcutConfig):ng.IHttpPromise<any>;
        put(url:string, data:any, headers?:IHeaderConfig, configOverrides?:ng.IRequestShortcutConfig):ng.IHttpPromise<any>;
        post(url:string, data:any, headers?:IHeaderConfig, configOverrides?:ng.IRequestShortcutConfig):ng.IHttpPromise<any>;
        patch(url:string, data:any, headers?:IHeaderConfig, configOverrides?:ng.IRequestShortcutConfig):ng.IHttpPromise<any>;
        remove(url:string, data?:any, headers?:IHeaderConfig, configOverrides?:ng.IRequestShortcutConfig):ng.IHttpPromise<any>;

        api(url:string):NgRestAdapter.NgRestAdapterService;
        skipInterceptor():NgRestAdapter.NgRestAdapterService;
        setSkipInterceptorRoutes(excludedRoutes:RegExp[]):NgRestAdapter.NgRestAdapterService;
        getSkipInterceptorRoutes():Array<RegExp|string>;

        uuid():string;
        isUuid(uuid:string):boolean;

        getConfig():INgRestAdapterServiceConfig;
        getErrorHandler():IApiErrorHandler;

    }

    export interface INgRestAdapterServiceProvider {
        configure(config:INgRestAdapterServiceConfig): NgRestAdapterServiceProvider;
    }

    export interface IHeaderConfig {
        [index: string] : any //should be `string | (config:ng.IRequestConfig) => string;` but union types are not yet allowed see https://github.com/Microsoft/TypeScript/issues/805
    }

    export interface INgRestAdapterServiceConfig {
        baseUrl: string;
        defaultHeaders?: IHeaderConfig
        skipInterceptor?: boolean;
    }

    export interface IApiErrorHandler {
        (requestConfig:ng.IRequestConfig, responseObject:ng.IHttpPromiseCallbackArg<any>):void;
    }

}
