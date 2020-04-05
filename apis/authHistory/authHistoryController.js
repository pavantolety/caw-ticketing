var utils = require('../../assets/utils').utils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var VALIDATE = CONSTANTS.VALIDATE;
var validate = utils.validate;

var AuthHistory = function() {
				return {
					auth: {},
					createdDate: 0
				}
		  };

function AuthHistoryAPI(authHistoryRecord) {
	var authHistory = new AuthHistory();
	authHistory.getAuth = function() {
		return this.auth;
	};
	authHistory.setAuth = function(auth) {
		if (auth) {
			this.auth = auth;			
		}
	};
	authHistory.getCreatedDate = function() {
		return this.createdDate;
	};
	authHistory.setCreatedDate = function(createdDate) {
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

	if (authHistoryRecord) {
		var errorList = [];
		try {
			authHistory.setAuth(authHistoryRecord.auth);
		} catch(e) {
			errorList.push(e);
		}
		try {
			authHistory.setCreatedDate(authHistoryRecord.createdDate);
		} catch(e) {
			errorList.push(e);
		}
		if (errorList.length) {
			throw {
				status: REQUEST_CODES.FAIL,
				error: errorList
			};
		}
		return authHistory;
	}
}

module.exports.AuthHistoryAPI = AuthHistoryAPI;