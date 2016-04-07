import * as _ from "lodash";
import {INgRestAdapterServiceConfig} from "../ngRestAdapterInterfaces";
import {NgRestAdapterService} from "../service/ngRestAdapterService";

export class NgRestAdapterException extends Error {

    public stack:string;

    constructor(public message:string) {
        super(message);
        this.name = 'NgRestAdapterException';
        this.message = message;
        this.stack = (<any>new Error()).stack;
    }

    public toString() {
        return this.name + ': ' + this.message;
    }
}

export class NgRestAdapterErrorHandlerNotFoundException extends NgRestAdapterException {
}

export class NgRestAdapterServiceProvider implements ng.IServiceProvider {

    private config:INgRestAdapterServiceConfig;

    /**
     * Initialise the service provider
     */
    constructor() {

        //initialise service config
        this.config = {
            baseUrl: '/api',
            defaultHeaders: {
                'Requested-With': 'angular-rest-adapter'
            },
            skipInterceptor: () => false
        }

    }

    /**
     * Set the configuration
     * @param config
     * @returns {NgRestAdapterServiceProvider}
     */
    public configure(config:INgRestAdapterServiceConfig):NgRestAdapterServiceProvider {

        let mismatchedConfig = _.difference(_.keys(config), _.keys(this.config));
        if (mismatchedConfig.length > 0) {
            throw new NgRestAdapterException("Invalid properties [" + mismatchedConfig.join(',') + "] passed to config)");
        }

        this.config = <INgRestAdapterServiceConfig>_.defaults(config, this.config);
        return this;
    }

    public $get = ['$http', 'uuid4', ($http, uuid4) => new NgRestAdapterService(this.config, $http, uuid4)];

}
