var mongoose = require('mongoose'),
Schema = mongoose.Schema;
var UserLogSchema = new Schema(require('./userLogSchema').userLogSchema, {collection: 'userLog'});
var UserLogModel = mongoose.model('userLog', UserLogSchema);
var UserLogController = require('./userLogController');
var utils = require('../../assets/utils').utils;
var CONSTANTS = utils.CONSTANTS;
var DB_CODES = CONSTANTS.DATABASE_CODES;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var VALIDATE = CONSTANTS.VALIDATE;
var mongoUtils = utils.mongoUtils;

function create(data, callback) {
	var userLogAPI = UserLogController.UserLogAPI(data);
    var errorList = [];

    if (!userLogAPI.getEmail()) {
       	var e = {
			status: VALIDATE.FAIL,
			error: utils.formatText(VALIDATE.REQUIRED, 'email')
		};
		errorList.push(e);
    }
    if (!userLogAPI.getUserId()) {
       	var e = {
			status: VALIDATE.FAIL,
			error: utils.formatText(VALIDATE.REQUIRED, 'userId')
		};
		errorList.push(e);
    }
    if (!userLogAPI.getRequestUrl()) {
       	var e = {
			status: VALIDATE.FAIL,
			error: utils.formatText(VALIDATE.REQUIRED, 'requestUrl')
		};
		errorList.push(e);
    }
   	if (errorList.length) {
		  throw {
		    status: REQUEST_CODES.FAIL,
		    error: errorList
		  };
	}  else {
		var userLogModel = new UserLogModel(userLogAPI);
		userLogModel.createdDate = new Date().getTime();
	    mongoUtils.getNextSequence('userLogId', function(oSeq) {
			userLogModel.userLogId = oSeq;
			userLogModel.save(function(error) {
				if (error) {
					callback({
						status: DB_CODES.FAIL,
						error: error
					});
					return;
				} else {
					callback({
					  	status: REQUEST_CODES.SUCCESS,
					 	result: [utils.formatText('Log Details Stored successfully')]
					});
					return;								
				}
	   		});
	   	});
	}
}

module.exports.create = create;
