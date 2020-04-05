var utils = require('../../assets/utils').utils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var VALIDATE = CONSTANTS.VALIDATE;
var validate = utils.validate;


var UserLog = function() {
	return {
		userLogId : 0,
		userId : 0,
		email : null,
		userName: null,
		requestUrl : null,
		requestMethod : null,
		apiRequest : {},
		apiResponse : null,
		createdDate : 0
	}
};

function UserLogAPI(userLogRecord) {
	var userLog = new UserLog();

	userLog.getUserLogId = function() {
		return this.userLogId;
	};
	userLog.setUserLogId = function(userLogId) {
		if (userLogId) {
			if (validate.isInteger(userLogId + '')) {
				this.userLogId = userLogId;
			} else {
				throw {
					status: VALIDATE.FAIL,
					error: utils.formatText(VALIDATE.NOT_A_INTEGER, userLogId, 'userLogId')
				};
			}
		}
	};
	userLog.getUserId = function() {
		return this.userId;
	};
	userLog.setUserId = function(userId) {
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
	userLog.getEmail = function() {
		return this.email;
	};
	userLog.setEmail = function(email) {
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
	userLog.getUserName= function() {
		return this.userName;
	};
	userLog.setUserName = function(userName) {
		if (userName) {
			this.userName = userName;
		}
	};
	userLog.getRequestUrl = function() {
		return this.requestUrl;
	};
	userLog.setRequestUrl = function(requestUrl) {
		if (requestUrl) {
			this.requestUrl = requestUrl;
		}
	};
	userLog.getRequestMethod = function() {
		return this.requestMethod;
	};
	userLog.setRequestMethod = function(requestMethod) {
		if (requestMethod) {
			this.requestMethod = requestMethod;
		}
	};
	userLog.getApiResponse = function() {
		return this.apiResponse;
	};
	userLog.setApiResponse = function(apiResponse) {
		if (apiResponse) {
			this.apiResponse = apiResponse;
		}
	};
	userLog.getApiRequest = function() {
		return this.apiRequest;
	};
	userLog.setApiRequest = function(apiRequest) {
		this.apiRequest = apiRequest;
	};
	userLog.getCreatedDate = function() {
        return this.createdDate;
    };
    userLog.setCreatedDate = function(createdDate) {
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

	if (userLogRecord) {
		var errorList = [];
		try {
			userLog.setUserLogId(userLogRecord.userLogId);
		} catch(e) {
			errorList.push(e);
		}
		try {
			userLog.setUserId(userLogRecord.userId);
		} catch(e) {
			errorList.push(e);
		}
		try {
			userLog.setEmail(userLogRecord.email);
		} catch(e) {
			errorList.push(e);
		}
		try {
			userLog.setUserName(userLogRecord.userName);
		} catch(e) {
			errorList.push(e);
		}
		try {
			userLog.setRequestUrl(userLogRecord.requestUrl);
		} catch(e) {
			errorList.push(e);
		}
		try {
			userLog.setRequestMethod(userLogRecord.requestMethod);
		} catch(e) {
			errorList.push(e);
		}
		try {
			userLog.setApiRequest(userLogRecord.apiRequest);
		} catch(e) {
			errorList.push(e);
		}
		try {
			userLog.setApiResponse(userLogRecord.apiResponse);
		} catch(e) {
			errorList.push(e);
		}
		try {
			userLog.setCreatedDate(userLogRecord.createdDate);
		} catch(e) {
			errorList.push(e);
		}
		if (errorList.length) {
			throw {
				status: REQUEST_CODES.FAIL,
				error: errorList
			};
		}
	}
	return userLog;
}

module.exports.UserLogAPI = UserLogAPI;		  