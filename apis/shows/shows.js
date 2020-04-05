module.exports = function(app){
	app.post('/ui/shows',function(req, res){
        try{
        	req.body.userId = req.session.userId;
			req.body.userName = req.session.user.userName;
			req.body.userEmail = req.session.user.email;
			req.body.url = req.url;
			req.body.method = req.method;
            create(req.body, function(response){
               res.json(response);
        	});
         
        }catch(e){
            res.json(e);
        }
    });
	app.put('/ui/shows', function(req, res) {
		try {
			req.body.userId = req.session.userId;
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
    app.get('/ui/shows/:showId', function(req, res) {
		try {
			getDetails(req.params.movieId, function(response) {
				res.json(response);
			});
		} catch(e) {
			res.json(e);
		}
	});
	app.get('/ui/shows/:movieId', function(req, res) {
		try {
			getShowsList(req.params, function(response) {
				res.json(response);
			});
		} catch(e) {
			res.json(e);
		}
	});
	app.get('/ui/show/:movieId/:showId', function(req, res) {
		try {
			getSeatingForShow(req.params, function(response) {
				res.json(response);
			});
		} catch(e) {
			res.json(e);
		}
	});
}

var mongoose = require('mongoose')
	Schema = mongoose.Schema;
var ShowsSchema = new Schema(require('./showsSchema').showsSchema, {collection: 'shows'});
var ShowsModel = mongoose.model('shows', ShowsSchema);
var ShowsController = require('./showsController');
var User = require('../user/user');
var Movies = require('../movies/movies');
var UserLog = require('../userLog/userLog');
var utils = require('../../assets/utils').utils;
var MailHelper = require('../mailHelper/mailHelper');
var File = require('../file/file');
var mongoUtils = utils.mongoUtils;
var CONSTANTS = utils.CONSTANTS;
var VALIDATE = CONSTANTS.VALIDATE;
var DB_CODES = CONSTANTS.DATABASE_CODES;
var SHOWS = CONSTANTS.SHOWS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var _ = require('underscore');
var async = require('async');

function create(shows, callback) {
	if(shows.userId){
		User.getDetails(shows.userId, function(response){
			if(!response.error){
				var userDetails = response.result[0];
				if(userDetails.isAdmin){
					var showsAPI = ShowsController.ShowsAPI(shows);
				    var errorList = [];
				    if (!showsAPI.getTheaterName()) {
				       	var e = {
							status: VALIDATE.FAIL,
							error: utils.formatText(VALIDATE.REQUIRED, 'theaterName')
						};
						errorList.push(e);
					}	
				   	if (errorList.length) {
						throw {
						    status: REQUEST_CODES.FAIL,
						    error: errorList
						};
					}  else {
						var showsModel = new ShowsModel(showsAPI);
						showsModel.isActive = true;
						mongoUtils.getNextSequence('showId', function(oSeq) {
							showsModel.showId = oSeq;
							showsModel.createdBy = 1;
							showsModel.createdDate = new Date().getTime();
							showsModel.save(function(error) {
								if (error) {
									callback({
										status: DB_CODES.FAIL,
										error: error
									});
									return;
								} else {
									let logObj = {
										"userId": shows.userId,
										"userName": shows.userName,
										"email": shows.userEmail,
										"requestUrl": shows.url,
										"requestMethod": shows.method,
										"apiRequest": {
											"module": "Movie-Shows-Create",
											"name": showsModel.name,
											"id": showsModel.movieId
										},
										"apiResponse": "SUCCESS"
									}
									UserLog.create(logObj, function(response){
										if(!response.error){
											callback({
												status: REQUEST_CODES.SUCCESS,
												result: utils.formatText(SHOWS.CREATE_SUCCESS, showsModel.movieId)
											});
											return;
										}
									});				
								}
							});
						});
					}
				} else {
					callback({
						status: REQUEST_CODES.ERROR,
						error: "You must be logged in as Admin to create Shows"
					});
					return;
				}
			}
		})
	} else {
		callback({
			status: REQUEST_CODES.ERROR,
			error: "You must be logged in as Admin to create Shows"
		});
		return;
	}
}

function getDetails(showId, callback) {
	ShowsModel.find({"showId": showId}, function(error, showRecords) {
		if (error) {
			callback({
				status: DB_CODES.FAIL,
				error: error
			});
			return;
		} else {
			showRecords = showRecords.map(function(showRecord) {
				return new ShowsController.ShowsAPI(showRecord);
			});			
            callback({
				status: REQUEST_CODES.SUCCESS,
				result: showRecords
			});
			return;		
		}
	});	
}

function getList(query, callback) {
	ShowsModel.find(query, function(error, showRecords) {		
		if (error) {
			callback({
			    status: DB_CODES.FAIL,
			    error: error
			});
			return;
		} else {		
			showRecords = showRecords.map(function(showRecord) {
				return new ShowsController.ShowsAPI(showRecord);
			});
			callback({
				status: REQUEST_CODES.SUCCESS,
				result: showRecords
			});
			return;	
		}
	});
}

function update(show, callback) {
	getDetails(show.showId, function(response) {
		if (response.error) {
			callback(response);
			return;
		} else {
			if (response.result) {
				show.updatedDate = new Date().getTime();
				ShowsModel.updateOne({"showId": show.showId}, {$set: show}, function(error, effectedRows) {
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
								error: utils.formatText(SHOWS.UPDATE_FAIL, show.showId)
							});
							return;
						} else {
							callback({
								status: REQUEST_CODES.SUCCESS,
								result: utils.formatText(SHOWS.UPDATE_SUCCESS, show.showId)
							});
							return;
						}
					}
				});
			} else {
				callback({
					status: REQUEST_CODES.FAIL,
					result: "No Show Found"
				});
				return;
			}
		}
	});	 
}

function getShows(query, projection, callback) {
	ShowsModel.find(query, projection, function(error, showRecords) {		
		if (error) {
			callback({
			    status: DB_CODES.FAIL,
			    error: error
			});
			return;
		} else {
			callback({
				status: REQUEST_CODES.SUCCESS,
				result: showRecords
			});
			return;	
		}
	});
}

async function getShowsList(query, callback){
	if(query.movieId){
		Movies.getMovies({movieId: parseInt(query.movieId), isActive: true}, async function(response){
			if(response.result && response.result.length>0){
				var movie = response.result[0];
				getList({movieId: parseInt(query.movieId), isActive: true}, async function(response){
					if(response.result && response.result.length>0){
						var shows = response.result;
						var finalShowObj = [];
						await shows.map(show=>{
							var showObj = {
								"movieId": movie.movieId,
								"showId": show.showId,
								"movieName": movie.name,
								"quality": show.quality,
								"showDate": show.showDate,
								"showTime": show.showTime,
								"theaterName": show.theaterName,
								"movieLanguage": movie.language
							};
							finalShowObj.push(showObj);
						});
						callback({
							status: REQUEST_CODES.SUCCESS,
							result: finalShowObj
						});
						return;	
					} else {
						callback({
							status: REQUEST_CODES.SUCCESS,
							result: []
						});
						return;	
					}
				})
			} else {
				callback({
					status: REQUEST_CODES.SUCCESS,
					result: []
				});
				return;	
			}
		});
	}
}

async function getSeatingForShow(query, callback){
	if(query.movieId && query.showId){
		Movies.getMovies({movieId: parseInt(query.movieId), isActive: true}, async function(response){
			if(response.result && response.result.length>0){
				var movie = response.result[0];
				getList({movieId: parseInt(query.movieId), showId: parseInt(query.showId), isActive: true}, async function(response){
					if(response.result && response.result.length>0){
						var show = response.result[0];
						var showObj = {
							"movieId": movie.movieId,
							"showId": show.showId,
							"movieName": movie.name,
							"quality": show.quality,
							"showDate": show.showDate,
							"showTime": show.showTime,
							"theaterName": show.theaterName,
							"movieLanguage": movie.language,
							"seating": show.seating
						};
						callback({
							status: REQUEST_CODES.SUCCESS,
							result: [showObj]
						});
						return;	
					} else {
						callback({
							status: REQUEST_CODES.SUCCESS,
							result: []
						});
						return;	
					}
				})
			} else {
				callback({
					status: REQUEST_CODES.SUCCESS,
					result: []
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
module.exports.getSeatingForShow = getSeatingForShow;
module.exports.getShowsList = getShowsList;