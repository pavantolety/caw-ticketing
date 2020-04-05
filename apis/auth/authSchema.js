module.exports.authSchema = {
								userId: {
									type: Number,
									required: true,
									index: true
								},
								user: {},
								email: {
									type: String,
									index: true
								},
								password: {
									type: String								},
								token: {
									type: String,
									index: true
								},
  								createdDate: {
									type: Number,
									index: true
								}
							};