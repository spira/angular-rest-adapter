import {INgRestAdapterServiceConfig} from "./ngRestAdapterInterfaces";
import {Chance} from "chance"

export const seededChance:Chance.Chance = new Chance(1);

export const fixtures = {

    get customConfig():INgRestAdapterServiceConfig {
        return {
            baseUrl: 'http://api.example.com/path/to/api/root',
            defaultHeaders: {
                'Test-Header': 'This is a test header'
            },
            skipInterceptor: () => false
        };
    },

};