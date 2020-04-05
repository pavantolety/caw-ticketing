module.exports = function(app) {
	require('./auth/auth')(app);
	require('./file/file')(app);
	require('./movies/movies')(app);
	require('./shows/shows')(app);
	require('./user/user')(app);
	require('./masterLists/masterLists')(app);
};
