/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./ngRestAdapterInterfaces.ts" />

module NgRestAdapter {

    export class NgRestAdapterInterceptor {

        private NgRestAdapterService: NgRestAdapterService;


        /**
         * Construct the service with dependencies injected
         * @param _$q
         * @param _$injector
         */
        static $inject = ['$q', '$injector'];
        constructor(
            private $q: ng.IQService,
            private $injector: ng.auto.IInjectorService) {
        }

        private getNgRestAdapterService = (): NgRestAdapterService=> {
            if (this.NgRestAdapterService == null) {
                this.NgRestAdapterService = this.$injector.get('ngRestAdapter');
            }
            return this.NgRestAdapterService;
        };

        public request = (config):any => {

            return config;
        };

        public response = (response):any => {

            return response;
        };

        public responseError = (response):any => {

            return response;
        };

    }

}
