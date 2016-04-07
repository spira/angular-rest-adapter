# angular-rest-adapter
$http adapter for easier connection to REST APIs 

[![Build Status](https://travis-ci.org/spira/angular-rest-adapter.svg?branch=master)](https://travis-ci.org/spira/angular-rest-adapter) 
[![Coverage Status](https://coveralls.io/repos/spira/angular-rest-adapter/badge.svg?branch=master)](https://coveralls.io/r/spira/angular-rest-adapter?branch=master)
[![Dependency Status](https://gemnasium.com/spira/angular-rest-adapter.svg)](https://gemnasium.com/spira/angular-rest-adapter)
[![npm version](https://badge.fury.io/js/angular-rest-adapter.svg)](http://badge.fury.io/js/angular-rest-adapter)

## Intro
This module wraps angular's native `$http`, adding convenience methods for REST API requests
   
## Installation

Install through bower:

```sh
    npm install angular-rest-adapter --save
```

## Usage

* Require the `ngRestAdapter` module in your angular application

```ts
    
    import "angular-rest-adapter";
    
    angular.module('app', ['ngRestAdapter']);
    
```

* (Optionally) configure the service provider

```ts
    
    import {NgRestAdapterServiceProvider} from "angular-rest-adapter";
    
    angular.module('app', ['ngRestAdapter'])
    .config(['ngRestAdapterProvider', function(ngRestAdapterProvider:NgRestAdapterServiceProvider){
        ngRestAdapterProvider
            .configure({
                baseUrl: 'http://api.example.com/path/to/api/root'
            })
        ;
    }]);
    
```

* ???
* Profit!
