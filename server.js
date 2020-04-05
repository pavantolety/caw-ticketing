var express = require('express'),
    bodyParser = require('body-parser'),
    db = require('./db/mongoose-data').db,
	app = express();
var http = require('http').Server(app);
var routes = require('./apis/routes');
var utils = require('./assets/utils').utils;
var CONSTANTS = require('./assets/utils').utils.CONSTANTS;
var auth = require('./apis/auth/auth');

app.use(bodyParser.json({ limit: '500mb' }));

app.use(function(req, res, next) {
	if (req.url.indexOf('/ui/') > -1) {
        if (req.method == 'POST' && (req.url == '/ui/user' || req.url == '/ui/auth' || req.url == '/ui/resetPassword' || req.url == '/ui/user/forgotPassword')) {
            next();
        } else if (typeof req.headers.token === undefined || req.headers.token == null || req.headers.token == 'null' || req.headers.token == '') {
            res.json({
                status: CONSTANTS.REQUEST_CODES.FAIL,
                error: CONSTANTS.AUTH_CODES.INVALID_TOKEN
            });
        } else if(req.headers.token){
            var token = req.headers.token;   
            auth.getDetails(token, function(response) {
                if (!response.error && response.result.length) {
                    var authAPI = response.result[0];
                    req.session = authAPI;
                    req.session.user = authAPI.user;
                    next();
                } else {
                    res.json({
                        status: CONSTANTS.REQUEST_CODES.FAIL,
                        error: CONSTANTS.AUTH_CODES.INVALID_TOKEN
                    });
                }
            });
        }
    } else {
        next();
	}		
});

routes(app);

app.get('/', function (req, res) {
    res.send('App is Live');
});
//Start Server
http.listen(process.env.PORT||3002, function(){
    // console.log(app.settings.env + ';__dirname:' + __dirname + ';');
    console.log('SVM API Server started @Port : ' + this.address().port);
});
//http.listen(4004);
module.exports = app;