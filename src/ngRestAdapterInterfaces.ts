// export interface IHeaderConfig {
//     [index: string] : any //should be `string | (config:ng.IRequestConfig) => string;` but union types are not yet allowed see https://github.com/Microsoft/TypeScript/issues/805
// }

export interface INgRestAdapterServiceConfig {
    baseUrl:string;
    defaultHeaders?:ng.HttpHeaderType;
    skipInterceptor?:ISkipInterceptorFunction;
}

export interface IApiErrorHandler {
    (requestConfig:ng.IRequestConfig, responseObject:ng.IHttpPromiseCallbackArg<any>):void;
}

export interface ISkipInterceptorFunction {
    (rejection:ng.IHttpPromiseCallbackArg<any>):boolean;
}

export interface INgRestAdapterRequestConfig extends ng.IRequestConfig {
    ngRestAdapterServiceConfig:INgRestAdapterServiceConfig;
    isBaseUrl:boolean;
}