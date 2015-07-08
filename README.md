# angular-rest-adapter
Wrapper for https://github.com/victorbjelkholm/ngprogress - automatically handles http progress with interceptor

[![Build Status](https://travis-ci.org/spira/angular-rest-adapter.svg?branch=master)](https://travis-ci.org/spira/angular-rest-adapter) 
[![Coverage Status](https://coveralls.io/repos/spira/angular-rest-adapter/badge.svg?branch=master)](https://coveralls.io/r/spira/angular-rest-adapter?branch=master)
[![Dependency Status](https://gemnasium.com/spira/angular-rest-adapter.svg)](https://gemnasium.com/spira/angular-rest-adapter)
[![Bower version](https://badge.fury.io/bo/angular-rest-adapter.svg)](http://badge.fury.io/bo/angular-rest-adapter)
[![npm version](https://badge.fury.io/js/angular-rest-adapter.svg)](http://badge.fury.io/js/angular-rest-adapter)

## Intro
This module wraps angular's native `$http`, adding convenience methods for REST API requests
   
## Installation

Install through bower:

```sh
bower install angular-rest-adapter --save
```

## Usage

* Require the `ngRestAdapter` module in your angular application

```js
angular.module('app', ['ngRestAdapter'])
```

* (Optionally) configure the service provider

```js
angular.module('app', ['ngRestAdapter'])
.config(['ngRestAdapterProvider', function(ngRestAdapterProvider){
    ngRestAdapterProvider
        .configure({
            baseUrl: 'http://api.example.com/path/to/api/root'
        })
    ;
}])
```

* ???
* Profit! All outgoing http requests will start or bump the progress meter, when all pending requests are resolved, 
the progress bar will complete.
