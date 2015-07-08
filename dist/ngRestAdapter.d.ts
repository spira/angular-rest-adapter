/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../typings/lodash/lodash.d.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
declare module NgRestAdapter {
    interface INgRestAdapterService {
        options(url: string, headers?: IHeaderConfig, configOverrides?: ng.IRequestShortcutConfig): ng.IHttpPromise<any>;
        get(url: string, headers?: IHeaderConfig, configOverrides?: ng.IRequestShortcutConfig): ng.IHttpPromise<any>;
        head(url: string, headers?: IHeaderConfig, configOverrides?: ng.IRequestShortcutConfig): ng.IHttpPromise<any>;
        put(url: string, data: any, headers?: IHeaderConfig, configOverrides?: ng.IRequestShortcutConfig): ng.IHttpPromise<any>;
        post(url: string, data: any, headers?: IHeaderConfig, configOverrides?: ng.IRequestShortcutConfig): ng.IHttpPromise<any>;
        patch(url: string, data: any, headers?: IHeaderConfig, configOverrides?: ng.IRequestShortcutConfig): ng.IHttpPromise<any>;
        remove(url: string, data?: any, headers?: IHeaderConfig, configOverrides?: ng.IRequestShortcutConfig): ng.IHttpPromise<any>;
        api(url: string): NgRestAdapter.NgRestAdapterService;
        uuid(): string;
        isUuid(uuid: string): boolean;
        getConfig(): INgRestAdapterServiceConfig;
    }
    interface INgRestAdapterServiceProvider {
        configure(config: INgRestAdapterServiceConfig): NgRestAdapterServiceProvider;
    }
    interface IHeaderConfig {
        [index: string]: any;
    }
    interface INgRestAdapterServiceConfig {
        baseUrl: string;
        defaultHeaders: IHeaderConfig;
    }
}
declare module NgRestAdapter {
    class NgRestAdapterInterceptor {
        private $q;
        private $injector;
        private NgRestAdapterService;
        /**
         * Construct the service with dependencies injected
         * @param _$q
         * @param _$injector
         */
        static $inject: string[];
        constructor($q: ng.IQService, $injector: ng.auto.IInjectorService);
        private getNgRestAdapterService;
        request: (config: any) => any;
        response: (response: any) => any;
        responseError: (response: any) => any;
    }
}
declare module NgRestAdapter {
    class NgRestAdapterService implements INgRestAdapterService {
        private config;
        private $http;
        private uuid4;
        /**
         * Construct the service with dependencies injected
         * @param config
         * @param $http
         * @param uuid4
         */
        constructor(config: INgRestAdapterServiceConfig, $http: ng.IHttpService, uuid4: any);
        private sendRequest(method, url, requestHeaders?, data?, configOverrides?);
        options(url: string, headers?: IHeaderConfig, configOverrides?: ng.IRequestShortcutConfig): ng.IHttpPromise<any>;
        get(url: string, headers?: IHeaderConfig, configOverrides?: ng.IRequestShortcutConfig): ng.IHttpPromise<any>;
        head(url: string, headers?: IHeaderConfig, configOverrides?: ng.IRequestShortcutConfig): ng.IHttpPromise<any>;
        put(url: string, data: any, headers?: IHeaderConfig, configOverrides?: ng.IRequestShortcutConfig): ng.IHttpPromise<any>;
        post(url: string, data: any, headers?: IHeaderConfig, configOverrides?: ng.IRequestShortcutConfig): ng.IHttpPromise<any>;
        patch(url: string, data: any, headers?: IHeaderConfig, configOverrides?: ng.IRequestShortcutConfig): ng.IHttpPromise<any>;
        remove(url: string, data: any, headers?: IHeaderConfig, configOverrides?: ng.IRequestShortcutConfig): ng.IHttpPromise<any>;
        api(url: string): NgRestAdapterService;
        uuid(): string;
        isUuid(uuid: string): boolean;
        getConfig(): NgRestAdapter.INgRestAdapterServiceConfig;
    }
}
declare module NgRestAdapter {
    class Error {
        name: string;
        message: string;
        stack: string;
        constructor(message?: string);
    }
    class NgRestAdapterException extends Error {
        message: string;
        constructor(message: string);
        toString(): string;
    }
    class NgRestAdapterServiceProvider implements ng.IServiceProvider, INgRestAdapterServiceProvider {
        private config;
        /**
         * Initialise the service provider
         */
        constructor();
        /**
         * Set the configuration
         * @param config
         * @returns {NgRestAdapter.NgRestAdapterServiceProvider}
         */
        configure(config: INgRestAdapterServiceConfig): NgRestAdapterServiceProvider;
        $get: (string | (($http: any, uuid4: any) => NgRestAdapterService))[];
    }
}
