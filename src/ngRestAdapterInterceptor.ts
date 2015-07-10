/// <reference path="../typings/tsd.d.ts" />

module NgRestAdapter {

    export class NgRestAdapterInterceptor {

        private ngRestAdapter: NgRestAdapterService;


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
            if (this.ngRestAdapter == null) {
                this.ngRestAdapter = this.$injector.get('ngRestAdapter');
            }
            return this.ngRestAdapter;
        };

        public responseError = (rejection:ng.IHttpPromiseCallbackArg<any>):any => {

            let ngRestAdapter = this.getNgRestAdapterService();

            //@todo extend the ng.IHttpPromiseCallbackArg interface to stop having to override the ngRestAdapterServiceConfig.skipInterceptor typescript warning
            if ((<any>rejection.config).ngRestAdapterServiceConfig.skipInterceptor === true){
                return this.$q.reject(rejection); //exit early
            }

            try {

                let errorHandler = ngRestAdapter.getErrorHandler();

                errorHandler(rejection.config, rejection);

            }catch(e){
                if (! (e instanceof NgRestAdapterErrorHandlerNotFoundException)){
                    throw e;
                }
                //otherwise do nothing, the developer has not set their own error handler
            }

            return this.$q.reject(rejection);
        };

    }

}
