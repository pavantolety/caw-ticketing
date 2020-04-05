var utils = require('../../assets/utils').utils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var VALIDATE = CONSTANTS.VALIDATE;
var validate = utils.validate;

var Auth = function() {
				return {
					userId: 0,
					token: null,
					email: null,
					password: null,
					createdDate: 0,
					user: {}
				}
		  };

function AuthAPI(authRecord) {
	var auth = new Auth();
	auth.getUserId = function() {
		return this.userId;
	};
	auth.setUserId = function(userId) {
		if (userId) {
			if (validate.isInteger(userId + '')) {
				this.userId = userId;
			} else {
				throw {
					status: VALIDATE.FAIL,
					error: utils.formatText(VALIDATE.NOT_A_INTEGER, userId, 'userId')
				};
			}
		}
	};
	auth.getEmail = function() {
		return this.email;
	};
	auth.setEmail = function(email) {
		if (email) {
			if (utils.validate.isEmail(email)) {
				this.email = email;
			} else {
				throw {
					status: VALIDATE.FAIL,
					error: utils.formatText(VALIDATE.NOT_AN_EMAIL, email, 'email')
				};
			}
		}
	};
	auth.getToken = function() {
		return this.token;
	};
	auth.setToken = function(token) {
		if (token) {
			this.token = token;
		}
	};
	auth.getPassword = function() {
		return this.password;
	};
	auth.setPassword = function(password) {
		if (password) {
			this.password = password;
		}
	};
	auth.getCreatedDate = function() {
		return this.createdDate;
	};
	auth.setCreatedDate = function(createdDate) {
		if (createdDate) {
			if (validate.isInteger(createdDate + '')) {
				this.createdDate = createdDate;
			} else {
				throw {
					status: VALIDATE.FAIL,
					error: utils.formatText(VALIDATE.NOT_A_INTEGER, createdDate, 'createdDate')
				};
			}
		}
	};
	auth.getUser = function() {
		return this.user;
	};
	auth.setUser = function(user) {
		if (user) {
			this.user = user;
		}
	};

	if (authRecord) {
		var errorList = [];
		try {
			auth.setUserId(authRecord.userId);
		} catch(e) {
			errorList.push(e);
		}
		try {
			auth.setEmail(authRecord.email);
		} catch(e) {
			errorList.push(e);
		}
		try {
			auth.setPassword(authRecord.password);
		} catch(e) {
			errorList.push(e);
		}
		try {
			auth.setToken(authRecord.token);
		} catch(e) {
			errorList.push(e);
		}
		try {
			auth.setCreatedDate(authRecord.createdDate);
		} catch(e) {
			errorList.push(e);
		}
		try {
			auth.setUser(authRecord.user);
		} catch(e) {
			errorList.push(e);
		}
		if (errorList.length) {
			throw {
				status: REQUEST_CODES.FAIL,
				errorList: errorList,
				error: VALIDATE.FAIL
			};
		}
	}

	return auth;
}

module.exports.AuthAPI = AuthAPI;