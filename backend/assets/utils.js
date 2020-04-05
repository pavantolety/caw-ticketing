var crypto = require('crypto');

module.exports.utils = {
							CONSTANTS: require('./constants').CONSTANTS,
							mongoUtils: require('./mongoUtils').mongoUtils,
							validate: require('./validate').validate,
							encryptText: function(text) {
								return crypto.createHash('md5').update(text+'').digest("hex");
							},
							formatText: function(text) {
								var result = text;
								for (var i = 1; i < arguments.length; i += 1) {
									var re = new RegExp('\\{' + (i-1) + '\\}', 'g');
									result = result.replace(re, arguments[i]);
								}
								return result;
							},
							getFullName: function(object) {
								var fullName = 'NA';
								try {
									fullName = object.getFirstName() + ' ' + object.getLastName();
								} catch(e) {
									try {
										fullName = object.firstName + ' ' + object.lastName;
									} catch(e) {}
								}
								return fullName;
							},
							getSystemTime: function() {
								return new Date().getTime();
							},
							getRandomNumber: function() {
								//generates 8 digit random integer as string
								return Math.floor((Math.random() * 100000000) + 9999999).toString();
							}														
						};

