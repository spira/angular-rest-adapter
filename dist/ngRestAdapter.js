"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
require("angular");
require("angular-uuid4");
var ngRestAdapterServiceProvider_1 = require("./provider/ngRestAdapterServiceProvider");
var ngRestAdapterInterceptor_1 = require("./interceptor/ngRestAdapterInterceptor");
__export(require("./provider/ngRestAdapterServiceProvider"));
__export(require("./service/ngRestAdapterService"));
__export(require("./interceptor/ngRestAdapterInterceptor"));
angular.module('ngRestAdapter', ['uuid4'])
    .provider('ngRestAdapter', ngRestAdapterServiceProvider_1.NgRestAdapterServiceProvider)
    .service('ngRestAdapterInterceptor', ngRestAdapterInterceptor_1.NgRestAdapterInterceptor)
    .config(['$httpProvider', '$injector', function ($httpProvider) {
        $httpProvider.interceptors.push('ngRestAdapterInterceptor');
    }]);

//# sourceMappingURL=ngRestAdapter.js.map
