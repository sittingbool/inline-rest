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
        this.resetError();
    }


    //------------------------------------------------------------------------------------------------------
    resetError()
    //------------------------------------------------------------------------------------------------------
    {
        this.error = null;
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
        binding().on('complete', function( result) {
            if ( result instanceof Error ) {
                return callback( result, null);
            }
            callback(null, result);
        }/*).on('fail', function( error) {
            callback(error, null);
        }).on('error', function( error) {
            callback(error, null);
        }).on('abort', function( ) {
            callback(new Error('Restler request aborted'), null);
        }).on('timeout', function( ) {
            callback(new Error('Restler request timed out'), null);
        }*/);
    }
};
