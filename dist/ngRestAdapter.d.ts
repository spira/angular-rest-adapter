/// <reference path="../typings/tsd.d.ts" />
declare module NgRestAdapter {
    class NgRestAdapterInterceptor {
        private $q;
        private $injector;
        private ngRestAdapter;
        /**
         * Construct the service with dependencies injected
         * @param _$q
         * @param _$injector
         */
        static $inject: string[];
        constructor($q: ng.IQService, $injector: ng.auto.IInjectorService);
        private getNgRestAdapterService;
        responseError: (rejection: ng.IHttpPromiseCallbackArg<any>) => any;
    }
}
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
        skipInterceptor(): NgRestAdapter.NgRestAdapterService;
        uuid(): string;
        isUuid(uuid: string): boolean;
        getConfig(): INgRestAdapterServiceConfig;
        getErrorHandler(): IApiErrorHandler;
    }
    interface INgRestAdapterServiceProvider {
        configure(config: INgRestAdapterServiceConfig): NgRestAdapterServiceProvider;
    }
    interface IHeaderConfig {
        [index: string]: any;
    }
    interface INgRestAdapterServiceConfig {
        baseUrl: string;
        defaultHeaders?: IHeaderConfig;
        skipInterceptor?: boolean;
    }
    interface IApiErrorHandler {
        (requestConfig: ng.IRequestConfig, responseObject: ng.IHttpPromiseCallbackArg<any>): void;
    }
}
declare module NgRestAdapter {
    class NgRestAdapterService implements INgRestAdapterService {
        private config;
        private $http;
        private uuid4;
        private apiErrorHandler;
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
        skipInterceptor(): NgRestAdapterService;
        uuid(): string;
        isUuid(uuid: string): boolean;
        getConfig(): NgRestAdapter.INgRestAdapterServiceConfig;
        registerApiErrorHandler(apiErrorHandler: IApiErrorHandler): NgRestAdapterService;
        getErrorHandler(): IApiErrorHandler;
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
    class NgRestAdapterErrorHandlerNotFoundException extends NgRestAdapterException {
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
