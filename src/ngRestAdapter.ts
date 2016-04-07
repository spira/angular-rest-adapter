import "angular";
import "angular-uuid4"

import {NgRestAdapterServiceProvider} from "./provider/ngRestAdapterServiceProvider";
import {NgRestAdapterInterceptor} from "./interceptor/ngRestAdapterInterceptor";

export * from "./provider/ngRestAdapterServiceProvider";
export * from "./service/ngRestAdapterService";
export * from "./interceptor/ngRestAdapterInterceptor";
export * from "./ngRestAdapterInterfaces";

angular.module('ngRestAdapter', ['uuid4'])
    .provider('ngRestAdapter', NgRestAdapterServiceProvider)
    .service('ngRestAdapterInterceptor', NgRestAdapterInterceptor)
    .config(['$httpProvider', '$injector', ($httpProvider:ng.IHttpProvider) => {

        $httpProvider.interceptors.push('ngRestAdapterInterceptor');
    }])
;