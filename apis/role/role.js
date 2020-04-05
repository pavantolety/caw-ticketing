module.exports = function(app){
	app.post('/ui/role',function(req, res){
        try{
            create(req.body, function(response){
               res.json(response);
        	});
         
        }catch(e){
            res.json(e);
        }
    });
	app.put('/ui/role', function(req, res) {
		try {
			update(req.body, function(response) {
				res.json(response);
			});
		} catch(e) {
		 	res.json(e);
		}
	});
    app.get('/ui/role/:roleId', function(req, res) {
		try {
			getDetails(req.params.roleId, function(response) {
				res.json(response);
			});
		} catch(e) {
			res.json(e);
		}
	});
	app.get('/ui/query/role', function(req, res) {
		try {
			getList(req.query, function(response) {
				res.json(response);
			});
		} catch(e) {
			res.json(e);
		}
	});
}

var mongoose = require('mongoose')
	Schema = mongoose.Schema;
var RoleSchema = new Schema(require('./roleSchema').roleSchema, {collection: 'role'});
var RoleModel = mongoose.model('role', RoleSchema);
var RoleController = require('./roleController');
var utils = require('../../assets/utils').utils;
var MailHelper = require('../mailHelper/mailHelper');
var mongoUtils = utils.mongoUtils;
var CONSTANTS = utils.CONSTANTS;
var VALIDATE = CONSTANTS.VALIDATE;
var DB_CODES = CONSTANTS.DATABASE_CODES;
var ROLE_CODES = CONSTANTS.ROLE;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;

function create(role, callback) {
	var roleAPI = RoleController.RoleAPI(role);
    var errorList = [];
    if (!roleAPI.getName()) {
       	var e = {
			status: VALIDATE.FAIL,
			error: utils.formatText(VALIDATE.REQUIRED, 'name')
		};
		errorList.push(e);
	}	
   	if (errorList.length) {
		throw {
		    status: REQUEST_CODES.FAIL,
		    error: errorList
		};
	}  else {
		var roleModel = new RoleModel(roleAPI);
		mongoUtils.getNextSequence('roleId', function(oSeq) {
			roleModel.roleId = oSeq;
			roleModel.createdDate = new Date().getTime();
			roleModel.save(function(error) {
				if (error) {
					callback({
						status: DB_CODES.FAIL,
						error: error
					});
					return;
				} else {
					callback({
						status: REQUEST_CODES.SUCCESS,
						result: utils.formatText(ROLE_CODES.CREATE_SUCCESS, roleModel.roleId)
					});
					return;							
				}
			});
		});
	}
}

function getDetails(roleId, callback) {
	RoleModel.find({"roleId": roleId}, function(error, roleRecords) {
		if (error) {
			callback({
				status: DB_CODES.FAIL,
				error: error
			});
			return;
		} else {
			roleRecords = roleRecords.map(function(roleRecord) {
				return new RoleController.RoleAPI(roleRecord);
			});			
            callback({
				status: REQUEST_CODES.SUCCESS,
				result: roleRecords
			});
			return;		
		}
	});	
}

function getList(query, callback) {
	RoleModel.find(query, function(error, roleRecords) {		
		if (error) {
			callback({
			    status: DB_CODES.FAIL,
			    error: error
			});
			return;
		} else {		
			roleRecords = roleRecords.map(function(roleRecord) {
				return new RoleController.RoleAPI(roleRecord);
			});
			callback({
				status: REQUEST_CODES.SUCCESS,
				result: roleRecords
			});
			return;	
		}
	});
}

function update(role, callback) {
	getDetails(role.roleId, function(response) {
		if (response.error) {
			callback(response);
			return;
		} else {
			if (response.result) {
				role.updatedDate = new Date().getTime();
				RoleModel.updateOne({"roleId": role.roleId}, {$set: role}, function(error, effectedRows) {
					if (error) {
						callback({
							status: DB_CODES.FAIL,
							error: error
						});
						return;
					} else {
						if (!effectedRows.nModified) {
							callback({
								status: REQUEST_CODES.FAIL,
								error: utils.formatText(ROLE_CODES.UPDATE_FAIL, role.roleId)
							});
							return;
						} else {
							callback({
								status: REQUEST_CODES.SUCCESS,
								result: utils.formatText(ROLE_CODES.UPDATE_SUCCESS, role.roleId)
							});
							return;
						}
					}
				});
			} else {
				callback({
					status: REQUEST_CODES.FAIL,
					result: "No Role Found"
				});
				return;
			}
		}
	});	 
}

module.exports.create = create;
module.exports.getDetails = getDetails;
module.exports.getList = getList;
module.exports.update = update;
