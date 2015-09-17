/// <reference path="../typings/tsd.d.ts" />
var NgRestAdapter;
(function (NgRestAdapter) {
    var NgRestAdapterInterceptor = (function () {
        function NgRestAdapterInterceptor($q, $injector) {
            var _this = this;
            this.$q = $q;
            this.$injector = $injector;
            this.getNgRestAdapterService = function () {
                if (_this.ngRestAdapter == null) {
                    _this.ngRestAdapter = _this.$injector.get('ngRestAdapter');
                }
                return _this.ngRestAdapter;
            };
            this.responseError = function (rejection) {
                var ngRestAdapter = _this.getNgRestAdapterService();
                var skipInterceptor = _.get(rejection.config, 'ngRestAdapterServiceConfig.skipInterceptor');
                if (_.isFunction(skipInterceptor) && skipInterceptor(rejection)) {
                    return _this.$q.reject(rejection); //exit early
                }
                var skipInterceptorRoutes = ngRestAdapter.getSkipInterceptorRoutes();
                var routeUrl = rejection.config.url;
                if (!_.isEmpty(skipInterceptorRoutes)) {
                    var routeMatches = _.any(skipInterceptorRoutes, function (routeMatch) {
                        if (_.isRegExp(routeMatch)) {
                            return routeMatch.test(routeUrl);
                        }
                        else {
                            return routeMatch === routeUrl;
                        }
                    });
                    if (routeMatches) {
                        return _this.$q.reject(rejection); //exit early
                    }
                }
                try {
                    var errorHandler = ngRestAdapter.getErrorHandler();
                    errorHandler(rejection.config, rejection);
                }
                catch (e) {
                    if (!(e instanceof NgRestAdapter.NgRestAdapterErrorHandlerNotFoundException)) {
                        throw e;
                    }
                }
                return _this.$q.reject(rejection);
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
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
var NgRestAdapter;
(function (NgRestAdapter) {
    var NgRestAdapterService = (function () {
        /**
         * Construct the service with dependencies injected
         * @param config
         * @param $http
         * @param uuid4
         * @param originalConfig
         */
        function NgRestAdapterService(config, $http, uuid4, originalConfig) {
            this.config = config;
            this.$http = $http;
            this.uuid4 = uuid4;
            this.originalConfig = originalConfig;
        }
        NgRestAdapterService.prototype.sendRequest = function (method, url, requestHeaders, data, configOverrides) {
            if (requestHeaders === void 0) { requestHeaders = {}; }
            var defaultHeaders = {
                'Content-Type': function (config) {
                    if (data || (config && config.data)) {
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
                responseType: 'json',
                ngRestAdapterServiceConfig: this.config,
                isBaseUrl: !this.originalConfig || this.config.baseUrl === this.originalConfig.baseUrl,
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
            return new NgRestAdapterService(config, this.$http, this.uuid4, this.config);
        };
        NgRestAdapterService.prototype.skipInterceptor = function (shouldSkip) {
            if (shouldSkip === void 0) { shouldSkip = function () { return true; }; }
            var config = _.defaults({ skipInterceptor: shouldSkip }, this.config);
            return new NgRestAdapterService(config, this.$http, this.uuid4, this.config);
        };
        NgRestAdapterService.prototype.uuid = function () {
            return this.uuid4.generate();
        };
        NgRestAdapterService.prototype.isUuid = function (uuid) {
            return this.uuid4.validate(uuid);
        };
        NgRestAdapterService.prototype.getConfig = function () {
            return this.config;
        };
        NgRestAdapterService.prototype.registerApiErrorHandler = function (apiErrorHandler) {
            if (_.isFunction(this.apiErrorHandler)) {
                throw new NgRestAdapter.NgRestAdapterException("You cannot redeclare the credential promise factory");
            }
            this.apiErrorHandler = apiErrorHandler;
            return this;
        };
        NgRestAdapterService.prototype.getErrorHandler = function () {
            if (_.isFunction(this.apiErrorHandler)) {
                return this.apiErrorHandler;
            }
            throw new NgRestAdapter.NgRestAdapterErrorHandlerNotFoundException("API Error handler is not set");
        };
        NgRestAdapterService.prototype.getSkipInterceptorRoutes = function () {
            return this.skipInterceptorRoutes;
        };
        NgRestAdapterService.prototype.setSkipInterceptorRoutes = function (excludedRoutes) {
            this.skipInterceptorRoutes = excludedRoutes;
            return this;
        };
        return NgRestAdapterService;
    })();
    NgRestAdapter.NgRestAdapterService = NgRestAdapterService;
})(NgRestAdapter || (NgRestAdapter = {}));
/// <reference path="../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
    var NgRestAdapterErrorHandlerNotFoundException = (function (_super) {
        __extends(NgRestAdapterErrorHandlerNotFoundException, _super);
        function NgRestAdapterErrorHandlerNotFoundException() {
            _super.apply(this, arguments);
        }
        return NgRestAdapterErrorHandlerNotFoundException;
    })(NgRestAdapterException);
    NgRestAdapter.NgRestAdapterErrorHandlerNotFoundException = NgRestAdapterErrorHandlerNotFoundException;
    var NgRestAdapterServiceProvider = (function () {
        /**
         * Initialise the service provider
         */
        function NgRestAdapterServiceProvider() {
            this.$get = ['$http', 'uuid4', function NgRestAdapterServiceFactory($http, uuid4) {
                    return new NgRestAdapter.NgRestAdapterService(this.config, $http, uuid4);
                }];
            //initialise service config
            this.config = {
                baseUrl: '/api',
                defaultHeaders: {
                    'Requested-With': 'angular-rest-adapter'
                },
                skipInterceptor: function () { return false; }
            };
        }
        /**
         * Set the configuration
         * @param config
         * @returns {NgRestAdapter.NgRestAdapterServiceProvider}
         */
        NgRestAdapterServiceProvider.prototype.configure = function (config) {
            var mismatchedConfig = _.difference(_.keys(config), _.keys(this.config));
            if (mismatchedConfig.length > 0) {
                throw new NgRestAdapterException("Invalid properties [" + mismatchedConfig.join(',') + "] passed to config)");
            }
            this.config = _.defaults(config, this.config);
            return this;
        };
        return NgRestAdapterServiceProvider;
    })();
    NgRestAdapter.NgRestAdapterServiceProvider = NgRestAdapterServiceProvider;
    angular.module('ngRestAdapter', ['uuid4'])
        .provider('ngRestAdapter', NgRestAdapterServiceProvider)
        .service('ngRestAdapterInterceptor', NgRestAdapter.NgRestAdapterInterceptor)
        .config(['$httpProvider', '$injector', function ($httpProvider) {
            $httpProvider.interceptors.push('ngRestAdapterInterceptor');
        }]);
})(NgRestAdapter || (NgRestAdapter = {}));

//# sourceMappingURL=ngRestAdapter.js.map