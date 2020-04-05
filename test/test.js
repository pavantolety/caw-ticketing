var request = require('supertest');
var app = require('../server.js');
describe('GET /', function() {
	it('respond with App is Live', function(done) { //navigate to root and check the the response is "hello world"
		request(app).get('/').expect('App is Live', done);
	});
});