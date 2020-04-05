var mongoose = require('mongoose'),
config = require('../libs/config');
uri = 'mongodb://'+config.get('mongoose:user')+':'+config.get('mongoose:password')+'@'+config.get('mongoose:host')+':'+config.get('mongoose:port')+'/'+config.get('mongoose:dbName')+'?authSource=admin';
db = mongoose.connect(uri, { useNewUrlParser: true }, (err,db)=>{
 	if(err) mongoose.connection.close();
});
var onerror = function(error,callback){
 mongoose.connection.close();
 callback(error);
};

module.exports.db = db;