var express = require('express');
var _ = require('lodash');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* TEST szenarios. */

var sendJsonResult = function sendJsonResult(req, res, next, data) {

    var result = {
        boolean: true,
        integer: 1,
        string: 'yes'
    };

    if ( data ) {
        result = _.merge(result, data);
    }

    res.status(200).json({
        data: result
    });
};

var sendIncomingResult = function(req, res, next) {
    var data = null;
    if ( req.body ) {
        data = req.body;
    }
    sendJsonResult(req, res, next, data);
};

router.get('/test', function(req, res, next) {
    sendJsonResult(req, res, next);
});
router.post('/test', sendIncomingResult);
router.put('/test', sendIncomingResult);
router.delete('/test', sendJsonResult);
router.get('/timeouttest', function(req, res, next) {
});

module.exports = router;
