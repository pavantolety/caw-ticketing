module.exports.userLogSchema = {
								userLogId: {
									type: Number,
									index: true,
									unique: true
								},
								userId: {
									type: Number,
									required: true,
									index: true
								},
								email: {
									type: String,
									required: true,
									index: true
								},
								userName: {
									type: String
								},
								requestUrl: {
									type: String,
									required: true
								},
								requestMethod: {
									type: String,
									required: true,
									index: true
								},
								apiRequest: {
									type: {}
								},
								apiResponse: {
									type: String,
									required: true,
									index: true
								},
								createdDate: {
									type: Number,
									required: true,
									index: true
								}
							};