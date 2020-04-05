var fs = require('fs');
var utils = require('../../assets/utils').utils;
var CONSTANTS = utils.CONSTANTS;

module.exports = function(app){
    app.post('/ui/file',function(req, res){
		try {
			create(req.body, function(response){
			res.json(response);
		});
		
		} catch(e){
			res.json(e);
		}
    });
    app.get('/ui/query/file', function(req, res) {
		try {
			getList(req.query, function(response) {
				res.json(response);
			});
		} catch(e) {
			res.json(e);
		}
	});
	app.get('/ui/filedisplay/:fileId', function(req, res) {
		try {
			var fileId = req.params.fileId;
			getDetails(fileId, function(response) {
				if (! (response.result && response.result.length)) {
					res.json(response);
				} else {
					var fileRecord = response.result[0];
					var file = fileRecord.filePath;
					if (fs.existsSync(fileRecord.filePath)) {
						res.end(new Buffer(fs.readFileSync(file)).toString("base64"));
					} else {
						console.log('file not exists ::');
						res.json({});
					}					
				}
			});
		} catch(e) {
			res.json(e);
		}
	});
	app.get('/ui/filedownload/:fileId', function(req, res) {
		if (CONSTANTS.ALLOWED_FILE_DOWNLOAD_DOMAINS.some(function(refererDomain) {
				return req.headers.referer == refererDomain;
			}) || true) {
			try {
				var fileId = req.params.fileId;
				getDetails(fileId, function(response) {
					if (response.error) {
						res.json(response);
					} else {
						var fileRecord = response.result[0];
						var file = fileRecord.filePath;
						var fileName = fileRecord.fileName;
						res.setHeader('Content-disposition', 'attachment; filename=' + file + 'originalFileName=' + fileName);
						res.cookie('fileName', fileName);
						res.setHeader('Content-type', 'application/' + fileName.substr(fileName.lastIndexOf('.') + 1));						
						console.log(file);
						if (fs.existsSync(file)) {
							var bitmap = fs.readFileSync(file);
							// convert binary data to base64 encoded string
							var response = {
								status: REQUEST_CODES.SUCCESS,
								result: [new Buffer(bitmap).toString('base64')]
							};
							res.json(response);
						} else {
							console.log('file not exists ::');
							res.json('');
						}
						
					}
				});
			} catch(e) {
				console.log('exception :: ' + JSON.stringify(e));
				res.json(e);
			}
		} else {
			var error = {
				status: REQUEST_CODES.FAIL,
				error: 'Invalid Filedownload Request'
			};
			res.json(error);
		}
	});
}

var mongoose = require('mongoose'),
Schema = mongoose.Schema;
var FileSchema = new Schema(require('./fileSchema').fileSchema, {collection: 'file'});
var FileModel = mongoose.model('file', FileSchema);
var FileController = require('./fileController');
var CONSTANTS = utils.CONSTANTS;
var DB_CODES = CONSTANTS.DATABASE_CODES;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var FILES_CODES = CONSTANTS.FILE;
var VALIDATE = CONSTANTS.VALIDATE;
var validate = utils.validate;
var mongoUtils = utils.mongoUtils;
// var _ = require('underscore');

function create(file, callback) {
	if(file.userId) {
		file.createdBy = file.userId;
	}
	var fileAPI = FileController.FileAPI(file);
	var errorList = [];
    if (!fileAPI.getFileName()) {
        var e = {
			status: VALIDATE.FAIL,
			error: utils.formatText(VALIDATE.REQUIRED, 'filename')
		};
		errorList.push(e);
    }
    if (!fileAPI.getFilePath()) {
        var e = {
			status: VALIDATE.FAIL,
			error: utils.formatText(VALIDATE.REQUIRED, 'filePath')
		};
		errorList.push(e);
    }
    if (errorList.length) {
		throw {
		    status: REQUEST_CODES.FAIL,
		    error: errorList
		};
	}  else { 
		var fileModel = new FileModel(fileAPI);
		// fileModel.refPath = JSON.parse(fileAPI.getRefPath());
	    mongoUtils.getNextSequence('fileId', function(oSeq) {
			fileModel.fileId = oSeq;
			fileModel.createdDate = new Date().getTime();
			fileModel.save(function(error) {
				if (error) {
					callback({
						status: DB_CODES.FAIL,
						error: error
					});
					return;
				} else {
					callback({
						status: REQUEST_CODES.SUCCESS,
						result: [utils.formatText(FILES_CODES.CREATE_SUCCESS, fileModel.fileId)],
						file: fileModel
					});
					return;
				}
	   		});
	   	});
	}
}

function getDetails(fileId, callback) {
	FileModel.find({"fileId": fileId}, function(error, fileRecord) {
		if (error) {
			callback({
				status: DB_CODES.FAIL,
				error: error
			});
			return;
		} else {
			
			callback({
				status: REQUEST_CODES.SUCCESS,
				result: [new FileController.FileAPI(fileRecord[0])]
			});
			return;
		}
	});	
}

function getList(query, callback) {
	FileModel.find(query, function(error, fileRecords) {		
		if (error) {
			callback({
				status: DB_CODES.FAIL,
				error: error
			});
			return;
		} else {			
			fileRecords = fileRecords.map(function(fileRecord) {
				return new FileController.FileAPI(fileRecord);

			});
            callback({
				status: REQUEST_CODES.SUCCESS,
				result: fileRecords
			//   result: _.sortBy(fileRecords, 'fileId').reverse()
			});
			return;		
		}
	});
}

module.exports.create = create;
module.exports.getList = getList;
module.exports.getDetails = getDetails;