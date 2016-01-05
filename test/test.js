/**
 * Created by richardhabermann on 05.01.16.
 */
var mocha = require('mocha');
var should = require('should');

var SyncRestler = require('../index.js');

var instance;
var serverPath = 'http://127.0.0.1:3825/test/';

describe('SyncRestler', function() {

    var checkResult = function( result, checkOutgoings) {
        var data;
        result.data.should.be.ok;
        if ( result.data ) {
            data = result.data;
            data.boolean.should.be.equal(true);
            data.integer.should.be.equal(1);
            data.string.should.be.equal('yes');

            if ( checkOutgoings ) {
                Object.keys( checkOutgoings).forEach( function( key) {

                    checkOutgoings[key].should.be.equal(data[key]);
                });
            }
        }
    };

    before( function() {
        instance = new SyncRestler();
    });

    it('should make a get request', function( done) {
        var result = instance.get(serverPath);
        checkResult(result);
        done();
    });


    it('should make a post request', function( done) {
        var data = { hello: 'world'};
        var result = instance.post(serverPath, {data: data});
        checkResult(result, data);
        done();
    });


    it('should make a put request', function( done) {
        var data = { foo: 'bar'};
        var result = instance.put(serverPath, {data: data});
        checkResult(result);
        done();
    });


    it('should make a delete request', function( done) {
        var result = instance.get(serverPath);
        checkResult(result);
        done();
    });

});
