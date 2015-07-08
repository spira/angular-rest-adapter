/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./ngRestAdapterInterfaces.ts" />
var NgRestAdapter;
(function (NgRestAdapter) {
    var NgRestAdapterInterceptor = (function () {
        function NgRestAdapterInterceptor($q, $injector) {
            var _this = this;
            this.$q = $q;
            this.$injector = $injector;
            this.getNgRestAdapterService = function () {
                if (_this.NgRestAdapterService == null) {
                    _this.NgRestAdapterService = _this.$injector.get('ngRestAdapter');
                }
                return _this.NgRestAdapterService;
            };
            this.request = function (config) {
                return config;
            };
            this.response = function (response) {
                return response;
            };
            this.responseError = function (response) {
                return response;
            };
        }
        /**
         * Construct the service with dependencies injected
         * @param _$q
         * @param _$injector
         */
        NgRestAdapterInterceptor.$inject = ['$q', '$injector'];
        return NgRestAdapterInterceptor;
    })();
    NgRestAdapter.NgRestAdapterInterceptor = NgRestAdapterInterceptor;
})(NgRestAdapter || (NgRestAdapter = {}));
/// <reference path="../typings/lodash/lodash.d.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="./ngRestAdapterInterfaces.ts" />
var NgRestAdapter;
(function (NgRestAdapter) {
    var NgRestAdapterService = (function () {
        /**
         * Construct the service with dependencies injected
         * @param config
         * @param $http
         * @param $window
         */
        function NgRestAdapterService(config, $http, $window) {
            this.config = config;
            this.$http = $http;
            this.$window = $window;
        }
        NgRestAdapterService.prototype.sendRequest = function (method, url, requestHeaders, data, configOverrides) {
            if (requestHeaders === void 0) { requestHeaders = {}; }
            var defaultHeaders = {
                'Content-Type': function (config) {
                    if (config.data) {
                        return 'application/json';
                    }
                    return null;
                }
            };
            //set the default config
            var requestConfig = {
                method: method,
                url: this.config.baseUrl + url,
                headers: _.defaults(requestHeaders, defaultHeaders),
                responseType: 'json' //it could always be json as even a head request might throw an exception as json
            };
            //if data is present, attach it to config
            if (!_.isEmpty(data)) {
                requestConfig.data = data;
            }
            //handle overrides
            if (!_.isEmpty(configOverrides)) {
                requestConfig = _.defaults(configOverrides, requestConfig);
            }
            var resultPromise = this.$http(requestConfig);
            return resultPromise;
        };
        NgRestAdapterService.prototype.options = function (url, headers, configOverrides) {
            return this.sendRequest('OPTIONS', url, headers, null, configOverrides);
        };
        NgRestAdapterService.prototype.get = function (url, headers, configOverrides) {
            return this.sendRequest('GET', url, headers, null, configOverrides);
        };
        NgRestAdapterService.prototype.head = function (url, headers, configOverrides) {
            return this.sendRequest('HEAD', url, headers, null, configOverrides);
        };
        NgRestAdapterService.prototype.put = function (url, data, headers, configOverrides) {
            return this.sendRequest('PUT', url, headers, data, configOverrides);
        };
        NgRestAdapterService.prototype.post = function (url, data, headers, configOverrides) {
            return this.sendRequest('POST', url, headers, data, configOverrides);
        };
        NgRestAdapterService.prototype.patch = function (url, data, headers, configOverrides) {
            return this.sendRequest('PATCH', url, headers, data, configOverrides);
        };
        NgRestAdapterService.prototype.remove = function (url, data, headers, configOverrides) {
            return this.sendRequest('DELETE', url, headers, data, configOverrides);
        };
        NgRestAdapterService.prototype.api = function (url) {
            var config = _.defaults({ baseUrl: url }, this.config);
            return new NgRestAdapterService(config, this.$http, this.$window);
        };
        NgRestAdapterService.prototype.uuid = function () {
            return this.$window.lil.uuid();
        };
        NgRestAdapterService.prototype.isUuid = function (uuid) {
            return this.$window.lil.isUuid(uuid, 4);
        };
        NgRestAdapterService.prototype.getConfig = function () {
            return this.config;
        };
        return NgRestAdapterService;
    })();
    NgRestAdapter.NgRestAdapterService = NgRestAdapterService;
})(NgRestAdapter || (NgRestAdapter = {}));
/// <reference path="../typings/lodash/lodash.d.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="./ngRestAdapterInterfaces.ts" />
/// <reference path="./ngRestAdapterService.ts" />
/// <reference path="./ngRestAdapterInterceptor.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var NgRestAdapter;
(function (NgRestAdapter) {
    var NgRestAdapterException = (function (_super) {
        __extends(NgRestAdapterException, _super);
        function NgRestAdapterException(message) {
            _super.call(this, message);
            this.message = message;
            this.name = 'NgRestAdapterException';
            this.message = message;
            this.stack = (new Error()).stack;
        }
        NgRestAdapterException.prototype.toString = function () {
            return this.name + ': ' + this.message;
        };
        return NgRestAdapterException;
    })(Error);
    NgRestAdapter.NgRestAdapterException = NgRestAdapterException;
    var NgRestAdapterServiceProvider = (function () {
        /**
         * Initialise the service provider
         */
        function NgRestAdapterServiceProvider() {
            this.$get = ['$http', '$window', function NgRestAdapterServiceFactory($http, $window) {
                    return new NgRestAdapter.NgRestAdapterService(this.config, $http, $window);
                }];
            //initialise service config
            this.config = {
                baseUrl: '/api',
                defaultHeaders: {
                    'Requested-With': 'NgRestAdapterException'
                },
            };
        }
        /**
         * Set the configuration
         * @param config
         * @returns {NgRestAdapter.NgRestAdapterServiceProvider}
         */
        NgRestAdapterServiceProvider.prototype.configure = function (config) {
            var mismatchedConfig = _.xor(_.keys(config), _.keys(this.config));
            if (mismatchedConfig.length > 0) {
                throw new NgRestAdapterException("Invalid properties [" + mismatchedConfig.join(',') + "] passed to config)");
            }
            this.config = _.defaults(config, this.config);
            return this;
        };
        return NgRestAdapterServiceProvider;
    })();
    NgRestAdapter.NgRestAdapterServiceProvider = NgRestAdapterServiceProvider;
    angular.module('ngRestAdapter', [])
        .provider('ngRestAdapter', NgRestAdapterServiceProvider)
        .service('ngRestAdapterInterceptor', NgRestAdapter.NgRestAdapterInterceptor)
        .config(['$httpProvider', '$injector', function ($httpProvider) {
            $httpProvider.interceptors.push('ngRestAdapterInterceptor');
        }]);
})(NgRestAdapter || (NgRestAdapter = {}));
//# sourceMappingURL=ngRestAdapter.js.map