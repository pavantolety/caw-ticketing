module.exports = function(app){
	app.post('/ui/user/messages',function(req, res){
        try{
            create(req.body, function(response){
               res.json(response);
        	});
         
        }catch(e){
            res.json(e);
        }
    });

    app.get('/ui/query/userMessagingList/:senderId', function(req, res) {
		try {
			getUserMessagingList(req.params.senderId, function(response) {
				res.json(response);
			});
		} catch(e) {
			res.json(e);
		}
	});

    app.get('/ui/query/userMessages/:senderId/:recipientId', function(req, res) {
		try {
			getMessages(req.params, function(response) {
				res.json(response);
			});
		} catch(e) {
			res.json(e);
		}
	});
}


var mongoose = require('mongoose')
	Schema = mongoose.Schema;
var MessagesSchema = new Schema(require('./messagesSchema').messagesSchema, {collection: 'messages'});
var MessagesModel = mongoose.model('messages', MessagesSchema);
var MessagesController = require('./messagesController');
var User = require('../user/user');
var utils = require('../../assets/utils').utils;
var MailHelper = require('../mailHelper/mailHelper');
var mongoUtils = utils.mongoUtils;
var CONSTANTS = utils.CONSTANTS;
var VALIDATE = CONSTANTS.VALIDATE;
var DB_CODES = CONSTANTS.DATABASE_CODES;
var USER_CODES = CONSTANTS.USER_CODES;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var _ = require('underscore');

function create(messages, callback) {
	getDetails({ "users": { $all: [messages.senderId,messages.recipientId] } }, function(response){
		if(response.error){
			callback({
				status: REQUEST_CODES.ERROR,
				error: response.error
			});
			return;
		} else if(response.result.length > 0){
			var userMessages = response.result[0];
			let message = messages.messages[0];
			message.senderId = messages.senderId;
			userMessages.messages.push(message);
			var query = {
				"senderId": messages.senderId, 
				"recipientId": messages.recipientId,
				"messages": userMessages.messages,
				"createdDate": new Date().getTime()
			};
			update(query, function(response){
				if(response.error){
					callback({
						status: REQUEST_CODES.ERROR,
						error: response.error
					});
					return;
				} else {
					getMessages({"senderId": messages.senderId, "recipientId": messages.recipientId}, function(response){
						if(response.error){
							callback({
								status: REQUEST_CODES.ERROR,
								error: response.error
							});
							return;
						} else {
							callback({
								status: REQUEST_CODES.SUCCESS,
								result: response.result
							});
							return;
						}
					});
				}
			});
		} else if(response.result.length == 0){
			messages.users = [];
			messages.users.push(messages.senderId);
			messages.users.push(messages.recipientId);
			var messagesAPI = MessagesController.MessagesAPI(messages);
		    var errorList = [];
			if (messagesAPI.getUsers().length < 1) {
		        var e = {
					status: VALIDATE.FAIL,
					error: utils.formatText(VALIDATE.REQUIRED, 'users')
				};
				console.log(e);
				errorList.push(e);
		    }

		   	if (errorList.length) {
		   		console.log("erre", errorList);
				throw {
				    status: REQUEST_CODES.FAIL,
				    error: errorList
				};
			}  else {
				var messagesModel = new MessagesModel(messagesAPI);
				mongoUtils.getNextSequence('messagesId', function(oSeq) {
					messagesModel.messagesId = oSeq;
					messagesModel.messages[0].senderId = messages.senderId;
					messagesModel.createdDate = new Date().getTime();
					console.log("createMessages:::::", messagesModel);
					messagesModel.save(function(error) {
						if (error) {
							console.log("error", error);
							callback({
								status: DB_CODES.FAIL,
								error: error
							});
							return;
						} else {
							getMessages({"senderId": messages.senderId, "recipientId": messages.recipientId}, function(response){
								if(response.error){
									callback({
										status: REQUEST_CODES.ERROR,
										error: response.error
									});
									return;
								} else {
									callback({
										status: REQUEST_CODES.SUCCESS,
										result: response.result
									});
									return;
								}
							});
						}						
					});
				});
			}
		}
	});
}

async function getUserMessagingList(sender, callback){
	var senderId = parseInt(sender);
	var userMessagesListSorted = await new Promise(resolve=> {
		getDetails({"users": {$in: [senderId]}}, function(response){
			if (response.error) {
				resolve([]);
			} else {
				resolve(response.result);
			}
		});
	});

	if (userMessagesListSorted.length > 0) {
		let responseObject = [];
		let response = userMessagesListSorted.map(userMessage => {
			return new Promise(resolve => {
				let recipientId = userMessage.users.filter(user=> user != senderId);
				User.getDetails(recipientId, function(response) {
					if(!response.error){
						var responseObj = {
							"userId": recipientId,
							"userName": response.result[0].firstName+' '+response.result[0].lastName,
							"logo": response.result[0].logo,
							"isOnline": true,
							"messages": [],
							"createdDate": userMessage.createdDate
						};
						let messages =  userMessage.messages.sort(GetSortOrderDesc("date"));
						responseObj.messages.push(messages[0]);
						responseObject.push(responseObj);
					}
					resolve();
				});
			});
		});

		await Promise.all(response).then(result => result);
		let newResponseObject = responseObject.sort(GetSortOrderDesc("createdDate"));
		callback({
			status: REQUEST_CODES.SUCCESS,
			result: newResponseObject
		});
		return;
	} else {
		callback({
			status: REQUEST_CODES.SUCCESS,
			result: []
		});
		return;
	}
}

function getDetails(query, callback) {
	MessagesModel.find(query, function(error, messagesRecords) {
		if (error) {
			callback({
				status: DB_CODES.FAIL,
				error: error
			});
			return;
		} else {
			messagesRecords = messagesRecords.map(function(messagesRecords) {
				return new MessagesController.MessagesAPI(messagesRecords);
			});
            callback({
				status: REQUEST_CODES.SUCCESS,
				result: messagesRecords
			});
			return;		
		}
	});	
}

async function getMessages(query, callback) {
	let senderId = parseInt(query.senderId);
	let recipientId = parseInt(query.recipientId);
	var users = await new Promise(resolve=> {
		User.getList({$or:[{"userId": senderId}, {"userId": recipientId}]}, function(response) {
			if(!response.error){
				resolve(response.result);
			}
		});
	});

	if(users.length>0){
		var userA = users.filter(user=> user.userId == senderId);
		var userB = users.filter(user=> user.userId == recipientId);
	} 

	userMessages = await new Promise(resolve=> {		
		getDetails({ "users": { $all: [senderId,recipientId] } }, function(response) {
			if (response.error) {
				console.log("Error", response.error);
				resolve([]);
			} else if(response.result.length>0){
				userMessagesA = response.result[0].messages.map(function(messagesRecords) {
					var responseObj = {
						"senderId": messagesRecords.senderId,
			            "date": messagesRecords.date,
			            "message": messagesRecords.message,
			            "logo": null
					};
					if(messagesRecords.senderId == userA[0].userId){
						responseObj.logo = userA[0].logo;
					} else if(messagesRecords.senderId == userB[0].userId) {
						responseObj.logo = userB[0].logo;
					}
					return responseObj;
				});	
				resolve(userMessagesA);			
			} else {
				resolve([]);
			}
		});	
	});
	callback({
		status: REQUEST_CODES.SUCCESS,
		result: userMessages
	});
	return;
}

function update(query, callback) {
	let senderId = parseInt(query.senderId);
	let recipientId = parseInt(query.recipientId);
	MessagesModel.updateOne({ "users": { $all: [senderId,recipientId] } }, {$set: {messages: query.messages}}, function(error, effectedRows) {
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
					error: utils.formatText(USER_CODES.UPDATE_FAIL, query.senderId)
				});
				return;
			} else {
				callback({
					status: REQUEST_CODES.SUCCESS,
					result: utils.formatText(USER_CODES.UPDATE_SUCCESS, query.senderId)
				});
				return;
			}
		}
	});
}

function GetSortOrderAsc(prop) {  
    return function(a, b) {  
        if (a[prop] > b[prop]) {  
            return 1;  
        } else if (a[prop] < b[prop]) {  
            return -1;  
        }  
        return 0;  
    }  
} 

function GetSortOrderDesc(prop) {  
    return function(a, b) {  
        if (a[prop] < b[prop]) {  
            return 1;  
        } else if (a[prop] > b[prop]) {  
            return -1;  
        }  
        return 0;  
    }  
} 

module.exports.create = create;
module.exports.getMessages = getMessages;
module.exports.getUserMessagingList = getUserMessagingList;
module.exports.getDetails = getDetails;
module.exports.update = update;
