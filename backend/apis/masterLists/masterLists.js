module.exports = function(app){
	
    app.get('/ui/query/masterLists', function(req, res) {
		try {
			getMasterLists(req.body, function(response) {
				res.json(response);
			});
		} catch(e) {
			res.json(e);
		}
	});
}


var mongoose = require('mongoose')
	Schema = mongoose.Schema;
var MasterListSchema = new Schema(require('./masterListsSchema').masterListsSchema, {collection: 'masterList'});
var MasterListModel = mongoose.model('masterList', MasterListSchema);
var MasterListController = require('./masterListsController');
var utils = require('../../assets/utils').utils;
var mongoUtils = utils.mongoUtils;
var CONSTANTS = utils.CONSTANTS;
var VALIDATE = CONSTANTS.VALIDATE;
var DB_CODES = CONSTANTS.DATABASE_CODES;
var USER_CODES = CONSTANTS.USER_CODES;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var _ = require('underscore');

function getMasterLists(query, callback) {
	console.log("getMasterList::::", query);
	MasterListModel.find({}, function(error, masterListRecords) {
		if (error) {
			callback({
				status: DB_CODES.FAIL,
				error: error
			});
			return;
		} else {
			masterListRecords = masterListRecords.map(function(masterListRecords) {
				return new MasterListController.MasterListAPI(masterListRecords);
			});			
            callback({
				status: REQUEST_CODES.SUCCESS,
				result: masterListRecords
			});
			return;		
		}
	});	
}
module.exports.getMasterLists = getMasterLists;
