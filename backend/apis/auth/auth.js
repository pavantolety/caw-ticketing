module.exports = function(app) {
	app.post('/ui/auth', function(req, res) {
		try {
			create(req.body, function(response) {
				res.json(response);
			});
		} catch(e) {
			res.json(e);
		}
	});
	app.get('/ui/logout/:token', function(req, res) {
		try {
			logout(req.params.token, function(response) {
				res.json(response);
			});
		} catch(e) {
			res.json(e);
		}
	});
}

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var AuthSchema = new Schema(require('./authSchema').authSchema, {collection: 'auth'});
var AuthModel = mongoose.model('tokens', AuthSchema);
var AuthController = require('./authController');
var UserController = require('../user/userController');
var User = require('../user/user');
var AuthHistory = require('../authHistory/authHistory');
var utils = require('../../assets/utils').utils;
var CONSTANTS = utils.CONSTANTS;
var DB_CODES = CONSTANTS.DATABASE_CODES;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var LOGIN_CODES = CONSTANTS.LOGIN_CODES;
var LOGOUT_CODES = CONSTANTS.LOGOUT_CODES;
var AUTH_CODES = CONSTANTS.AUTH_CODES;
var VALIDATE = CONSTANTS.VALIDATE;
var validate = utils.validate;
var mongoUtils = utils.mongoUtils;

function create(auth, callback) {
	var emailAddress = '';
	var loginTime = '';
	var result = '';
    var authAPI = new AuthController.AuthAPI(auth);    
	var errorList = [];
	if (!validate.isExist(authAPI.getEmail())) {
		errorList.push({
			status: VALIDATE.FAIL,
			error: utils.formatText(CONSTANTS.VALIDATE.REQUIRED, 'email')
		});
	}
	if (!validate.isExist(authAPI.getPassword())) {
		errorList.push({
			status: VALIDATE.FAIL,
			error: utils.formatText(CONSTANTS.VALIDATE.REQUIRED, 'password')
		});
	}
    if (errorList.length) {
		throw {
			status: REQUEST_CODES.FAIL,
			error: VALIDATE.MANDATORY,
			errorList: errorList
		};
    } else {
    	loginTime = utils.getSystemTime();
    	User.getList({email: authAPI.getEmail()}, function(response) {
			if (response.error) {
				callback(response);
			} else {
				var userRecords = response.result[0];
				if (!response.result.length) {
					result = REQUEST_CODES.FAIL+' '+ LOGIN_CODES.LOGIN_EMAIL_FAIL;
					callback({
						status: REQUEST_CODES.FAIL,
						error: LOGIN_CODES.LOGIN_EMAIL_FAIL,
						message: LOGIN_CODES.LOGIN_EMAIL_FAIL
					});
				} else {
					var userAPI = new UserController.UserAPI(response.result[0]);
					if (utils.encryptText(authAPI.getPassword()) != userAPI.getPassword()) {
						result = REQUEST_CODES.FAIL + ' ' + LOGIN_CODES.LOGIN_FAIL;
						callback({
							status: REQUEST_CODES.FAIL,
							error: LOGIN_CODES.LOGIN_FAIL,
							message: LOGIN_CODES.LOGIN_FAIL
						});
					} else {
						if(userAPI.getStatus() != 'Active' ) {
							result = REQUEST_CODES.FAIL + ' ' + LOGIN_CODES.LOGIN_USER_INACTIVE;
							callback({
								status: REQUEST_CODES.FAIL,
								error: LOGIN_CODES.LOGIN_USER_INACTIVE,
								message: LOGIN_CODES.LOGIN_USER_INACTIVE
							});
						} else {
							var token = utils.encryptText(Math.random() + userAPI.getPassword() + utils.getSystemTime());
							delete userAPI.password;
							delete authAPI.password;
							authAPI.setToken(token);
							authAPI.setUserId(userAPI.getUserId());
							authAPI.setUser({
								"userId": userAPI.getUserId(),
								"userName": userAPI.getFirstName()+' '+ userAPI.getLastName(),
								"email": userAPI.getEmail(),
								"isAdmin": userAPI.getIsAdmin(),
								"logo": userAPI.getLogo()
							});
							authAPI.setCreatedDate(utils.getSystemTime());
							var authModel = new AuthModel(authAPI);
							loginTime = utils.getSystemTime()
							authModel.save(function(error) {
								if (error) {
									result = DB_CODES.FAIL + ' ' + error;
									callback({
										status: DB_CODES.FAIL,
										error: error
									});
									return;
								} else {
									result = REQUEST_CODES.SUCCESS;
									callback({
										status: REQUEST_CODES.SUCCESS,
										result: authModel
									});
								}
							});
						}
					}
				}
			}
		});
	}
}

function getDetails(token, callback) {
	AuthModel.find({token: token}, function(error, tokenRecord) {
		if (error) {
			callback({
				status: DB_CODES.FAIL,
				error: error
			});
			return;
		} else {
			if (tokenRecord[0]) {
				var authAPI = new AuthController.AuthAPI(tokenRecord[0]);
				callback({
					status: REQUEST_CODES.SUCCESS,
					result: [authAPI]
				});
				return;
			} else {
				callback({
					status: REQUEST_CODES.FAIL,
					error: AUTH_CODES.INVALID_TOKEN
				});
				return;
			}
			
		}
	});
}

function getTokens(query, callback) {
	AuthModel.find(query, {_id: 0, token: 1, createdDate: 1}, function(error, tokenRecords) {
		if (error) {
			callback({
				status: DB_CODES.FAIL,
				error: error
			});
			return;
		} else {
		 	callback({
			    status: REQUEST_CODES.SUCCESS,
			    result: tokenRecords
			});	
		 return ;
		}
	});
}

function logout(token, callback) {
	getDetails(token, function(tokenRecord) {	
		if(tokenRecord.error) {
			callback(tokenRecord);
		} else {
			var authHistory = {
				'auth': tokenRecord.result[0]
			};
			AuthHistory.create(authHistory, function(response) {
				AuthModel.remove({token: token}, function(error) {
					if (error) {
						callback({
							status: DB_CODES.FAIL,
							error: error
						});
						return;
					} else {
						callback({
							status: REQUEST_CODES.SUCCESS,
							result: utils.formatText(LOGOUT_CODES.LOGOUT_SUCCESS, token)
						});
						return;
					}
				});
			});
		}
	});	
}

module.exports.create = create;
module.exports.getDetails = getDetails;
module.exports.getTokens = getTokens;
module.exports.logout = logout;