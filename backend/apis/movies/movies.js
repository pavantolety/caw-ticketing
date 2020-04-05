module.exports = function(app){
	app.post('/ui/movies',function(req, res){
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
	app.put('/ui/movies', function(req, res) {
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
    app.get('/ui/movies/:movieId', function(req, res) {
		try {
			getDetails(req.params.movieId, function(response) {
				res.json(response);
			});
		} catch(e) {
			res.json(e);
		}
	});
	app.get('/ui/getMovies/:movieId', function(req, res) {
		try {
			getMovies(req.params.movieId, function(response) {
				res.json(response);
			});
		} catch(e) {
			res.json(e);
		}
	});
	app.get('/ui/movies', function(req, res) {
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
var MoviesSchema = new Schema(require('./moviesSchema').moviesSchema, {collection: 'movies'});
var MoviesModel = mongoose.model('movies', MoviesSchema);
var MoviesController = require('./moviesController');
var User = require('../user/user');
var UserLog = require('../userLog/userLog');
var utils = require('../../assets/utils').utils;
var MailHelper = require('../mailHelper/mailHelper');
var File = require('../file/file');
var mongoUtils = utils.mongoUtils;
var CONSTANTS = utils.CONSTANTS;
var VALIDATE = CONSTANTS.VALIDATE;
var DB_CODES = CONSTANTS.DATABASE_CODES;
var MOVIES = CONSTANTS.MOVIES;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var _ = require('lodash');

function create(movies, callback) {
	if(movies.userId){
		User.getDetails(movies.userId, function(response){
			if(!response.error){
				var userDetails = response.result[0];
				if(userDetails.isAdmin){
					var moviesAPI = MoviesController.MoviesAPI(movies);
				    var errorList = [];
				    if (!moviesAPI.getName()) {
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
						var movieModel = new MoviesModel(moviesAPI);
						movieModel.isActive = true;
						mongoUtils.getNextSequence('movieId', function(oSeq) {
							movieModel.movieId = oSeq;
							movieModel.createdBy = 1;
							movieModel.createdDate = new Date().getTime();
							movieModel.save(function(error) {
								if (error) {
									callback({
										status: DB_CODES.FAIL,
										error: error
									});
									return;
								} else {
									let logObj = {
										"userId": movies.userId,
										"userName": movies.userName,
										"email": movies.userEmail,
										"requestUrl": movies.url,
										"requestMethod": movies.method,
										"apiRequest": {
											"module": "Movie-Create",
											"name": movieModel.name,
											"id": movieModel.movieId
										},
										"apiResponse": "SUCCESS"
									}
									UserLog.create(logObj, function(response){
										if(!response.error){
											callback({
												status: REQUEST_CODES.SUCCESS,
												result: utils.formatText(MOVIES.CREATE_SUCCESS, movieModel.movieId)
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
						error: "You must be logged in as Admin to create Movies"
					});
					return;
				}
			}
		})
	} else {
		callback({
			status: REQUEST_CODES.ERROR,
			error: "You must be logged in as Admin to create Movies"
		});
		return;
	}
}

function getDetails(movieId, callback) {
	MoviesModel.find({"movieId": movieId}, function(error, projectRecords) {
		if (error) {
			callback({
				status: DB_CODES.FAIL,
				error: error
			});
			return;
		} else {
			projectRecords = projectRecords.map(function(projectRecord) {
				return new MoviesController.MoviesAPI(projectRecord);
			});			
            callback({
				status: REQUEST_CODES.SUCCESS,
				result: projectRecords
			});
			return;		
		}
	});	
}

function getList(query, callback) {
	MoviesModel.find(query, {details: 0, requests: 0}, function(error, projectRecords) {		
		if (error) {
			callback({
			    status: DB_CODES.FAIL,
			    error: error
			});
			return;
		} else {		
			projectRecords = projectRecords.map(function(projectRecord) {
				return new MoviesController.MoviesAPI(projectRecord);
			});
			callback({
				status: REQUEST_CODES.SUCCESS,
				result: projectRecords
			});
			return;	
		}
	}).sort({createdDate: -1});
}

function getMovies(query, callback) {
	MoviesModel.find(query, function(error, movieRecord) {		
		if (error) {
			callback({
			    status: DB_CODES.FAIL,
			    error: error
			});
			return;
		} else {
			callback({
				status: REQUEST_CODES.SUCCESS,
				result: movieRecord
			});
			return;	
		}
	});
}

function update(movies, callback) {
	getDetails(movies.movieId, function(response) {
		if (response.error) {
			callback(response);
			return;
		} else {
			if (response.result) {
				var projectDetails = response.result[0];
				movies.updatedDate = new Date().getTime();
				MoviesModel.updateOne({"movieId": movies.movieId}, {$set: movies}, function(error, effectedRows) {
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
								error: utils.formatText(MOVIES.UPDATE_FAIL, movies.movieId)
							});
							return;
						} else {
							let logObj = {
								"userId": movies.userId,
								"userName": movies.userName,
								"email": movies.userEmail,
								"requestUrl": movies.url,
								"requestMethod": movies.method,
								"apiRequest": {
									"module": "Research-Create",
									"name": projectDetails.name,
									"id": projectDetails.movieId
								},
								"apiResponse": "SUCCESS"
							}
							UserLog.create(logObj, function(response){
								if(!response.error){
									callback({
										status: REQUEST_CODES.SUCCESS,
										result: utils.formatText(MOVIES.UPDATE_SUCCESS, movies.movieId)
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
					result: "No movies Found"
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
module.exports.getMovies = getMovies;
