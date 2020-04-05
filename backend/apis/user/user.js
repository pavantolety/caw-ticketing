module.exports = function(app){
	app.post('/ui/user',function(req, res){
        try{
            create(req.body, function(response){
               res.json(response);
        	});
         
        }catch(e){
            res.json(e);
        }
    });
	app.put('/ui/user', function(req, res) {
		try {
			req.body.uId = req.session.userId;
			req.body.userName = req.session.user.userName;
			req.body.userEmail = req.session.user.email;
			req.body.url = req.url;
			req.body.method = req.method;
			update(req.body, function(response) {
				res.json(response);
			});
		} catch(e) {
		 	res.json(e);
		}
	});
	app.post('/ui/resetPassword',function(req, res) {
		try{
			req.body.url = req.url;
			req.body.method = req.method;
			resetPassword(req.body, function(response){
			res.json(response);
		});
		}catch(e){
		 res.json(e);
		}
	});
    app.post('/ui/user/forgotPassword',function(req, res) {
        try{
        	req.body.url = req.url;
			req.body.method = req.method;
         	forgotPassword(req.body, function(response) {
            	res.json(response);
            });
        }catch(e) {
             res.json(e);
        }
    });
    app.get('/ui/user/:userId', function(req, res) {
		try {
			getDetails(req.params.userId, function(response) {
				res.json(response);
			});
		} catch(e) {
			res.json(e);
		}
	});
	app.get('/ui/editProfile/:userId', function(req, res) {
		try {
			editProfile(req.params.userId, function(response) {
				res.json(response);
			});
		} catch(e) {
			res.json(e);
		}
	});
	app.post('/ui/user/bookTicket',function(req, res) {
        try{
        	req.body.uId = req.session.userId;
			req.body.userName = req.session.user.userName;
			req.body.userEmail = req.session.user.email;
			req.body.url = req.url;
			req.body.method = req.method;
         	bookTicket(req.body, function(response) {
            	res.json(response);
            });
        }catch(e) {
             res.json(e);
        }
    });
	app.get('/ui/query/user', function(req, res) {
		try {
			getList(req.query, function(response) {
				res.json(response);
			});
		} catch(e) {
			res.json(e);
		}
	});
	app.put('/ui/changepassword',function(req, res) {
        try {
        	req.body.uId = req.session.userId;
			req.body.userName = req.session.user.userName;
			req.body.userEmail = req.session.user.email;
			req.body.url = req.url;
			req.body.method = req.method;
            changePassword(req.body, function(response) {
        	    res.json(response);
            });
        } catch(e){
            res.json(e);
        }
	});
	app.post('/ui/profileUpload',function(req, res) {
        try {
        	req.body.uId = req.session.userId;
			req.body.userName = req.session.user.userName;
			req.body.userEmail = req.session.user.email;
			req.body.url = req.url;
			req.body.method = req.method;
            profileUpload(req.body, function(response) {
        	    res.json(response);
            });
        } catch(e){
            res.json(e);
        }
    });
}

var mongoose = require('mongoose')
	Schema = mongoose.Schema;
var UserSchema = new Schema(require('./userSchema').userSchema, {collection: 'user'});
var UserModel = mongoose.model('user', UserSchema);
var UserController = require('./userController');
var utils = require('../../assets/utils').utils;
var Movies = require('../movies/movies');
var Shows = require('../shows/shows');
var File = require('../file/file');
var MailHelper = require('../mailHelper/mailHelper');
var UserLog = require('../userLog/userLog');
var mongoUtils = utils.mongoUtils;
var CONSTANTS = utils.CONSTANTS;
var VALIDATE = CONSTANTS.VALIDATE;
var DB_CODES = CONSTANTS.DATABASE_CODES;
var USER_CODES = CONSTANTS.USER_CODES;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var FORGOTPASSWORD = CONSTANTS.FORGOT_PASSWORD;
var _ = require('underscore');

function create(user, callback) {
	var userAPI = UserController.UserAPI(user);
	var password;
	if (user.password) {
		password = user.password;
	} else {
		password = 123456;
	}
	if (user.isAdmin === undefined || user.isAdmin != true) {
		userAPI.setIsAdmin(false);
	}
	if (!user.status || user.status === undefined) {
		userAPI.setStatus('Active');
	}
	userAPI.setPassword(utils.encryptText(password));
    var errorList = [];
    if (!userAPI.getFirstName()) {
       	var e = {
			status: VALIDATE.FAIL,
			error: utils.formatText(VALIDATE.REQUIRED, 'firstName')
		};
		errorList.push(e);
	}
	if (!userAPI.getLastName()) {
		var e = {
			status: VALIDATE.FAIL,
		 	error: utils.formatText(VALIDATE.REQUIRED, 'lastName')
	 	};
	 	errorList.push(e);
 	}	
	if (!userAPI.getEmail()) {
        var e = {
			status: VALIDATE.FAIL,
			error: utils.formatText(VALIDATE.REQUIRED, 'email')
		};
		console.log(e);
		errorList.push(e);
    }
    if (!userAPI.getPassword()) {
        var e = {
			status: VALIDATE.FAIL,
			error: utils.formatText(VALIDATE.REQUIRED, 'password')
     	};
		errorList.push(e);
    }
   	if (errorList.length) {
		throw {
		    status: REQUEST_CODES.FAIL,
		    error: errorList
		};
	}  else {
		var userModel = new UserModel(userAPI);
		getList({email: userModel.email}, function(response) {
			if(response.error) {
				callback(response);
			} else if (response.result.length > 0){
				callback({
					status: REQUEST_CODES.FAIL,
					error: USER_CODES.ALREADY_EXIST
				});
			} else {
				
				mongoUtils.getNextSequence('userId', function(oSeq) {
					userModel.userId = oSeq;
					userModel.status = "Active";
					userModel.isAdmin = false;
					userModel.createdDate = new Date().getTime();
					userModel.save(function(error) {
						if (error) {
							callback({
								status: DB_CODES.FAIL,
								error: error
							});
							return;
						} else {
							var subject = '';
							subject = 'Account Created';
							var template =  {
								body: '<p> Dear <b>' + utils.getFullName(user) + '</b>,</p><p>Thanks for signing up with our website. You are all set to start booking tickets. </p><p style="margin-top: 100px;">Thanks & Regards</p><p>Support Team</p><p>CAW Studios</p><p><b style="font-family: Roboto, Helvetica Neue, Arial, sans-serif;letter-spacing: -2px;font-weight: 700;color:#1b84e7;font-size: 30px;">CAW</b></p>',
								recipients: userModel.email,
								from: 'CAW',
								subject: subject
							};
							MailHelper.sendMail(template, function(response) {
								if (response.result) {
									callback({
										status: REQUEST_CODES.SUCCESS,
										result: USER_CODES.CREATE_MAIL_SENT
									});
									return;
								} else {
									callback({
										status: REQUEST_CODES.SUCCESS,
										result: [utils.formatText('User Created successfully, But failed to send email')]
									});
									return;
								}						
							});						
						}
					});
				});
			}
		});
	}
}

function getDetails(userId, callback) {
	UserModel.find({"userId": userId}, function(error, userRecords) {
		if (error) {
			callback({
				status: DB_CODES.FAIL,
				error: error
			});
			return;
		} else {
			userRecords = userRecords.map(function(userRecord) {
				return new UserController.UserAPI(userRecord);
			});			
            callback({
				status: REQUEST_CODES.SUCCESS,
				result: userRecords
			});
			return;		
		}
	});	
}

function editProfile(userId, callback) {
	getDetails(userId, function(response) {
		if(response.error) {
			callback(response);
		} else {
			if(response.result.length < 1) {
				callback({
					status: REQUEST_CODES.SUCCESS,
					result: {user: [], files: [], profile: []}
				});
			} else {
				var userRecord = response.result[0];
				var fileIds = _.flatten(_.pluck(userRecord.resources, 'fileId'));
				File.getList({fileId: {$in: fileIds}}, function(response) {
					if(response.error) {
						callback(response);
					} else {
						var fileRecords = response.result;
						File.getList({fileId: userRecord.profileId}, function(response) {
							if(response.error) {
								callback(response);
							} else {
								var profileRecord = response.result;
								callback({
									status: REQUEST_CODES.SUCCESS,
									result: {user: userRecord, files: fileRecords, profile: profileRecord}
								});
							}
						});
					}
				});
			}
		}
	});
}

function getList(query, callback) {
	UserModel.find(query, function(error, userRecords) {		
		if (error) {
			callback({
			    status: DB_CODES.FAIL,
			    error: error
			});
			return;
		} else {		
			userRecords = userRecords.map(function(userRecord) {
				return new UserController.UserAPI(userRecord);   
			});
			callback({
				status: REQUEST_CODES.SUCCESS,
				result: userRecords
			});
			return;	
		}
	}).sort({createdDate: -1});
}

function update(user, callback) {
	if(user.email) {
		callback({
			status: REQUEST_CODES.FAIL,
			result: "We can't change Email"
		});
		return;
	} else {
		getDetails(user.userId, function(response) {
			if (response.error) {
				callback(response);
				return;
			} else {
				if (response.result) {
					var userDetails = response.result[0];
					if (user.password) {
						user.password = utils.encryptText(user.password);
					}
					user.updatedDate = new Date().getTime();
					UserModel.updateOne({"userId": user.userId}, {$set: user}, function(error, effectedRows) {
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
									error: utils.formatText(USER_CODES.UPDATE_FAIL, user.userId)
								});
								return;
							} else {
								let logObj = {
									"userId": user.uId || user.userId,
									"userName": user.userName,
									"email": user.userEmail,
									"requestUrl": user.url,
									"requestMethod": user.method,
									"apiRequest": user.apiRequest || {"module": "User-Update","name": userDetails.firstName+' '+userDetails.lastName,"id": user.userId},
									"apiResponse": "SUCCESS"
								}
								UserLog.create(logObj, function(response){
									if(!response.error){
										callback({
											status: REQUEST_CODES.SUCCESS,
											result: utils.formatText(USER_CODES.UPDATE_SUCCESS, user.userId)
										});
										return;
									}
								});
							}
						}
					});
				} else {
					callback({
						status: REQUEST_CODES.FAIL,
						result: "No User Found"
					});
					return;
				}
			}
		});	 
	}
}

function forgotPassword(reqBody, callback) {
	getList({email: reqBody.email}, function(response) {
		if (response.error) {
			callback(error);
		} else {
			var user = response.result[0] || [];
			if(user.userId) {
				var template =  {
					body: '<p> Dear <b>' + utils.getFullName(user) + '</b>,</p><p>Please click the below link to reset password</p><p><a href='+CONSTANTS.BASE_URL_UI+'/changepassword::'+user.userId+'>Reset Password</a></p><p style="margin-top: 100px;">Thanks & Regards </p><p>Support Team</p><p>Smart Village Movement</p><p><b style="font-family: Roboto, Helvetica Neue, Arial, sans-serif;letter-spacing: -2px;font-weight: 700;color:#1b84e7;font-size: 30px;">SVM</p>',
					recipients: [user.email],
					from: 'SVM',
					subject: 'Reset Password'
				};
				MailHelper.sendMail(template, function(response) {
					if (response.result) {
						callback({
							status: REQUEST_CODES.SUCCESS,
							result: "Password reset link sent to your mail successfully"
						});
						return;
					} else {
						callback({
							status: REQUEST_CODES.SUCCESS,
							result: [utils.formatText('Password updated successfully, but unable to send the email to user whose id is ', user.userId)]
						});
						return;
					}						
				});
			} else{
				callback({
					status: REQUEST_CODES.FAIL,
					error: FORGOTPASSWORD.INVALID_EMAIL
				});
				return;
			}
		}
	});
}

function resetPassword(user, callback) {
	getList({userId: user.userId}, function(response) {
		if (response.error) {
			callback(error);
		} else if (response.result.length < 1) {
			callback({
			    status: REQUEST_CODES.FAIL,
				error: FORGOTPASSWORD.ACCOUNT_NOT_FOUND
			});
			return;
		} else {
			var userRecord = response.result[0];
			user.userId = userRecord.userId;
			user.uId = userRecord.userId;
			user.userName = userRecord.firstName+' '+userRecord.lastName;
			user.userEmail = userRecord.email;
			user.url = user.url;
			user.method = user.method;
			user.apiRequest = {
				"module": "User-ResetPassword",
				"name": userRecord.firstName+' '+userRecord.lastName,
				"id": userRecord.userId
			};
			user.apiResponse = "SUCCESS";
			update(user, function(response) {
				if (response.error) {
					callback(response);
				} else {
					callback({
						status: REQUEST_CODES.SUCCESS,
						result: "Password reset successfully"
					});
					return;
				}
			});	
		}
	});
}

function changePassword(user, callback) {
	var errorList = [];
	if (!user.userId) {
		errorList.push({
			status: VALIDATE.FAIL,
			error: utils.formatText(CONSTANTS.VALIDATE.REQUIRED, 'userId')
		});
	} 
	if (!user.password) {
		errorList.push({
			status: VALIDATE.FAIL,
			error: utils.formatText(CONSTANTS.VALIDATE.REQUIRED, 'password')
		});
	} 
	if (!user.newPassword) {
		errorList.push({
			status: VALIDATE.FAIL,
			error: utils.formatText(CONSTANTS.VALIDATE.REQUIRED, 'newPassword')
		});
	}
	if (errorList.length) {
		throw {
			status: REQUEST_CODES.FAIL,
			error: VALIDATE.MANDATORY,
			errorList: errorList
		};
	} else {
		getDetails(user.userId, function(response) {
			if (response.error) {
				callback(response);
			} else if (response.result.length < 1) {
				callback({
					status: REQUEST_CODES.FAIL,
					error: FORGOTPASSWORD.ACCOUNT_NOT_FOUND
				});
				return;
			} else {
				var userObj = response.result[0];
				if (utils.encryptText(user.password) == userObj.password) {
					var userRecord = {
						'userId': userObj.userId,
						'password': user.newPassword,
						"uId": user.uId,
						"userName": user.userName,
						"userEmail": user.userEmail,
						"url": user.url,
						"method": user.method,
						"apiRequest": {
							"module": "User-UpdatePassword",
							"name": userObj.firstName+' '+userObj.lastName,
							"id": user.userId
						},
						"apiResponse": "SUCCESS"
					};
					update(userRecord, function(response) {
						if (response.error) {
							callback(response);
						} else {
							callback(response);
						}
					});				
				} else {
					callback({
					    status: REQUEST_CODES.FAIL,
						error: FORGOTPASSWORD.WRONG_PASSWORD
					});
					return;
				}
			}
		});
	}
}

function profileUpload(file, callback) {
	File.create({fileName: file.advanceDetails.fileName, originalName: file.file.originalname, filePath: '/uploads/profiles/'+file.file.filename, userId: file.advanceDetails.userId, category: "profile", mimeType: file.file.mimetype}, function(response) {
		if(response.error) {
			callback(response);
		} else {
			var fileResponse = response.file;
			var user = {
				"userId": file.advanceDetails.userId,
				"uId": file.uId,
				"profileId": fileResponse.fileId,
				"userName": file.userName,
				"userEmail": file.userEmail,
				"url": file.url,
				"method": file.method,
				"apiRequest": {
					"module": "User-Update",
					"name": file.userName,
					"id": file.advanceDetails.userId
				},
				"apiResponse": "SUCCESS"
			}
			update(user, function(response){
				if(response.error){
					callback(response);
				} else {
					let logObj = {
						"userId": file.uId,
						"userName": file.userName,
						"email": file.userEmail,
						"requestUrl": file.url,
						"requestMethod": file.method,
						"apiRequest": {
							"module": "User-ProfileUpload",
							"name": file.userName,
							"id": file.advanceDetails.userId
						},
						"apiResponse": "SUCCESS"
					}
					UserLog.create(logObj, function(response){
						if(!response.error){
							callback({
								status: REQUEST_CODES.SUCCESS,
								result: "Profile uploaded"
							});
							return;
						}
					});
				}
			});
		}
	});
}

async function bookTicket(query, callback){
	if(query.showId && query.selectedSeats){
		getDetails(query.uId, async function(response){
			if(response.result.length>0){
				var user = response.result[0];
				Shows.getDetails(query.showId, async function(response){
					if(response.result.length>0){
						var show = response.result[0];
						Movies.getDetails(show.movieId, async function(response){
							if(!response.error){
								var movie = response.result[0];
								var selectedSeatingTypes = Object.keys(query.selectedSeats); 
								var availableSeatingTypes = Object.keys(show.seating);
								var bookedSeats = [];
								let updatedSeating = await Object.keys(show.seating).map(type=>{
									Object.keys(show.seating[type]).map(t=>{
										if(selectedSeatingTypes.indexOf(t) > -1){
											console.log("444444444444",query.selectedSeats);
											bookedSeats = bookedSeats.concat(query.selectedSeats[t]);
											console.log("55555555555", bookedSeats);
											console.log("666666666", show.seating[type][selectedSeatingTypes[0]].booked);
											show.seating[type][selectedSeatingTypes[0]].booked = show.seating[type][selectedSeatingTypes[0]].booked.concat(bookedSeats);
										}
									});
									 return show.seating[type];
								});
								Shows.update(show, function(response){
									if(!response.error){
										var template =  {
											body: '<p> Dear <b>' + utils.getFullName(user) + '</b>,</p><p>Your booking was successfull. Here are your ticket details<br>'+
											'MovieName: '+movie.name+'<br>'+
											'Movie Date: '+show.showDate+'<br>'+
											'Movie Time: '+show.showTime+'<br>'+
											'Screen :'+show.screenNumber+'<br>'+
											'Seats :'+bookedSeats.toString()+'<br>'+
											'</p><p style="margin-top: 100px;">Thanks & Regards </p><p>CAW Ticketing</p>',
											recipients: [user.email],
											from: 'CAW Ticketing',
											subject: 'Booking Confirmed'
										};
										MailHelper.sendMail(template, function(response) {
											if (response.result) {
												callback({
													status: REQUEST_CODES.SUCCESS,
													result: "Booking Details sent to your mail successfully"
												});
												return;
											} else {
												callback({
													status: REQUEST_CODES.SUCCESS,
													result: [utils.formatText('Booking successful, but unable to send the email to user whose id is ', user.userId)]
												});
												return;
											}						
										});
									} else {
										callback({
											status: REQUEST_CODES.SUCCESS,
											result: "Error! Booking could not be processed. Please try again!"
										});
										return;
									}
								});
							}
						});
					} else {
						callback({
							status: REQUEST_CODES.SUCCESS,
							result: "No Shows found!"
						});
						return;
					}
				})
			} else {
				callback({
					status: REQUEST_CODES.SUCCESS,
					result: "Error! Booking could not be processed. Please retry again later!"
				});
				return;
			}
		});
	}
}

module.exports.create = create;
module.exports.getDetails = getDetails;
module.exports.getList = getList;
module.exports.update = update;
