# inline-rest

(C) Richard Habermann (sittingbool@gmx.de) 2016, Licensed under the MIT-LICENSE

A REST-client wrapping restler, that gives you the result as a return statement (synced) using the deasync package while actually performing the request asynchronously.

Installing
----------

```
npm install inline-rest
```

Running the tests
-----------------

```
cd test/testserver && node bin/www && cd ../.. && npm test
```

Features
--------

* Uses ES6-Classes and therefore easy to subclass and override
* No callback, you will get the result as return value
* Asynchronous requests, no threads will be blocked (see https://www.npmjs.com/package/deasync)
* Similar syntax to restler (https://www.npmjs.com/package/restler)


METHODS (so far)
----------------

For full documentation of the options-parameter see https://www.npmjs.com/package/restler

### get(url, options)

Create a GET request.

### post(url, options)

Create a POST request.

### put(url, options)

Create a POST request.

### delete(url, options)

Create a POST request.


PROPERTIES
----------

### hasError

Returns true if there was an error performing the request.

### error

Returns an error object if request error or null if no error.

### firesTimeOut

If set to true the Request will fire a timeout when the server takes to much time without waiting for the timeout-response from that server. By default this ist set to false.

### timeOutInterval

If firesTimeOut set to true this will be the interval after which the timeout will be fired. The value is to be set in milliseconds. E.g 60000 would be 60 seconds.

### timedOut

If firesTimeOut set to true this indicate that the timeout event has been fired.
