var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var AuthHistorySchema = new Schema(require('./authHistorySchema').authHistorySchema, {collection: 'authHistory'});
var AuthHistoryModel = mongoose.model('authHistory', AuthHistorySchema);
var AuthHistoryController = require('./authHistoryController');
var utils = require('../../assets/utils').utils;
var CONSTANTS = utils.CONSTANTS;
var DB_CODES = CONSTANTS.DATABASE_CODES;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var AUTH_HISTORY_CODES = CONSTANTS.AUTH_HISTORY;

function create(authHistory, callback) {
    var authHistoryAPI = new AuthHistoryController.AuthHistoryAPI(authHistory);
    authHistoryAPI.setCreatedDate(utils.getSystemTime());
	var authHistoryModel = new AuthHistoryModel(authHistoryAPI);
	authHistoryModel.save(function(error) {
		if (error) {
			callback({
				status: DB_CODES.FAIL,
				error: error
			});
			return;
		} else {
			callback({
				status: REQUEST_CODES.SUCCESS,
				result: [AUTH_HISTORY_CODES.CREATE_SUCCESS]
			});
			return;
		}
	});
}

module.exports.create = create;