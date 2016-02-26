'use strict';
// dependencies
//----------------------------------------------------------------------------------------------------------
var restler = require('restler');
var deasync = require('deasync');
//----------------------------------------------------------------------------------------------------------


/**
 * This class has no description yet.
 *
 * @class SyncRestler
 * @constructor
 */
//----------------------------------------------------------------------------------------------------------
module.exports = class SyncRestler
//----------------------------------------------------------------------------------------------------------
{
    //------------------------------------------------------------------------------------------------------
    constructor()
    //------------------------------------------------------------------------------------------------------
    {
        this._setup();
    }


    //------------------------------------------------------------------------------------------------------
    _setup()
    //------------------------------------------------------------------------------------------------------
    {
        this._timeOutTimer = null;
        this._firesTimeOut = false;
        this.timeOutInterval = 60 * 1000; // only used if this.firesTimeOut === true
        this.timedOut = false; // only used if this.firesTimeOut === true
        this._currentRequest = null;
        this.resetError();
    }


    //------------------------------------------------------------------------------------------------------
    resetError()
    //------------------------------------------------------------------------------------------------------
    {
        this.error = null;
    }


    //------------------------------------------------------------------------------------------------------
    timeOutHandler()
    //------------------------------------------------------------------------------------------------------
    {
        if ( ! this._currentRequest ) {
            return;
        }
        this.timedOut = true;
        this._currentRequest.abort();
    }


    //------------------------------------------------------------------------------------------------------
    clearTimeOutTimer()
    //------------------------------------------------------------------------------------------------------
    {
        if ( !this._timeOutTimer ) {
            return;
        }
        clearTimeout(this._timeOutTimer);
        this._firesTimeOut = null;
    }


    //------------------------------------------------------------------------------------------------------
    set firesTimeOut( value)
    //------------------------------------------------------------------------------------------------------
    {
        this._firesTimeOut = value;
        if ( !value ) {
            this.clearTimeOutTimer();
        }
    }


    //------------------------------------------------------------------------------------------------------
    get firesTimeOut()
    //------------------------------------------------------------------------------------------------------
    {
        return this._firesTimeOut;
    }


    //------------------------------------------------------------------------------------------------------
    get hasError()
    //------------------------------------------------------------------------------------------------------
    {
        return !!this.error;
    }


    //------------------------------------------------------------------------------------------------------
    get errored()
    //------------------------------------------------------------------------------------------------------
    {
        return this.hasError;
    }

    
    //------------------------------------------------------------------------------------------------------
    get( url, options)
    //------------------------------------------------------------------------------------------------------
    {
        return this.callRESTMethod('get', url, options);
    }


    //------------------------------------------------------------------------------------------------------
    post( url, options)
    //------------------------------------------------------------------------------------------------------
    {
        return this.callRESTMethod('post', url, options);
    }


    //------------------------------------------------------------------------------------------------------
    put( url, options)
    //------------------------------------------------------------------------------------------------------
    {
        return this.callRESTMethod('put', url, options);
    }


    //------------------------------------------------------------------------------------------------------
    delete( url, options)
    //------------------------------------------------------------------------------------------------------
    {
        return this.callRESTMethod('del', url, options);
    }


    //------------------------------------------------------------------------------------------------------
    callRESTMethod(method, url, options)
    //------------------------------------------------------------------------------------------------------
    {
        let binding, result;

        if ( typeof method !== 'string' ) {
            this.error = new Error('Method needs to be a string in callRESTMethod');
            return null;
        }

        method = restler[method.toLowerCase()];

        if ( !method )  {
            this.error = new Error('No method "' + method + '" on restler module');
            return null;
        }

        options = this._updateOptions(options, method);

        binding = method.bind(restler, url, options);

        result = this._callSyncRestlerBinding(binding, this._getDefaultValueFromOptions(options));

        if ( this.hasError ) {
            console.log(this.error);

            // TODO: log error on process model
        }

        return result;
    }


    //------------------------------------------------------------------------------------------------------
    _updateOptions( options, method)
    //------------------------------------------------------------------------------------------------------
    {
        if ( !options ) {
            options = {};
        }

        return options;
    }


    //------------------------------------------------------------------------------------------------------
    _getDefaultValueFromOptions( options)
    //------------------------------------------------------------------------------------------------------
    {
        if ( !options ) { return null; }

        return options.defaultValue || options.defaultVal || null;
    }


    //------------------------------------------------------------------------------------------------------
    _callSyncRestlerBinding(binding, defaultValue)
    //------------------------------------------------------------------------------------------------------
    {
        let self = this;

        if ( this._currentRequest ) {
            this.error = new Error('More than one request called on SyncRestler.');
            return null;
        }

        let execution = function asyncExecution( callback) {
            self._callAsyncRestlerBinding( binding, callback);
        };

        let fun = deasync(execution);

        this.resetError();

        try {
            return fun();
        } catch ( error ) {
            this.error = error;
            return defaultValue || null;
        }
    }


    //------------------------------------------------------------------------------------------------------
    _callAsyncRestlerBinding( binding, callback)
    //------------------------------------------------------------------------------------------------------
    {
        let self = this;
        this._currentRequest = binding().on('complete', function( result) {
            self._currentRequest = null;
            self.clearTimeOutTimer();
            if ( result instanceof Error ) {
                return callback( result, null);
            }
            callback(null, result);
        }).on('abort',function() {
            self._currentRequest = null;
            return callback( new Error('Request aborted due to timeout.'), null);
        });

        if ( this.firesTimeOut ) {
            this._timeOutTimer = setTimeout(function () {
                self.timeOutHandler();
                self.clearTimeOutTimer();
            }, this.timeOutInterval);
        }
    }
};
