/// <reference path="../typings/lodash/lodash.d.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="./ngRestAdapterInterfaces.ts" />
/// <reference path="./ngRestAdapterService.ts" />
/// <reference path="./ngRestAdapterInterceptor.ts" />

module NgRestAdapter {

    export declare class Error {
        public name: string;
        public message: string;
        public stack: string;
        constructor(message?: string);
    }

    export class NgRestAdapterException extends Error {

        constructor(public message: string) {
            super(message);
            this.name = 'NgRestAdapterException';
            this.message = message;
            this.stack = (<any>new Error()).stack;
        }
        toString() {
            return this.name + ': ' + this.message;
        }
    }

    export class NgRestAdapterServiceProvider implements ng.IServiceProvider, INgRestAdapterServiceProvider {

        private config: INgRestAdapterServiceConfig;

        /**
         * Initialise the service provider
         */
        constructor() {

            //initialise service config
            this.config = {
                baseUrl: '/api',
                defaultHeaders: {
                    'Requested-With': 'NgRestAdapterException'
                },
            }

        }

        /**
         * Set the configuration
         * @param config
         * @returns {NgRestAdapter.NgRestAdapterServiceProvider}
         */
        public configure(config:INgRestAdapterServiceConfig) : NgRestAdapterServiceProvider {

            let mismatchedConfig = _.xor(_.keys(config), _.keys(this.config));
            if (mismatchedConfig.length > 0){
                throw new NgRestAdapterException("Invalid properties ["+mismatchedConfig.join(',')+"] passed to config)");
            }

            this.config = <INgRestAdapterServiceConfig>_.defaults(config, this.config);
            return this;
        }

        public $get = ['$http', 'uuid4', function NgRestAdapterServiceFactory($http, uuid4) {
            return new NgRestAdapterService(this.config, $http, uuid4);
        }];

    }


    angular.module('ngRestAdapter', ['uuid4'])
        .provider('ngRestAdapter', NgRestAdapterServiceProvider)
        .service('ngRestAdapterInterceptor', NgRestAdapterInterceptor)
        .config(['$httpProvider', '$injector', ($httpProvider:ng.IHttpProvider) => {

            $httpProvider.interceptors.push('ngRestAdapterInterceptor');
        }])
    ;


}
