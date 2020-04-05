module.exports.showsSchema = { 
								showId: {
									type: Number,
									unique: true,
									index: true,
									required: true
								},
								showTime: {
									type: String,
									index: true,
									required: true
								},
								showDate: {
									type: String,
									index: true,
									required: true
								},
								movieId: {
									type: Number,
									index: true,
									required: true
								},
								theaterName: {
									type: String,
									index: true,
									required: true
								},
								quality: {
									type: String,
									required: true
								},
								seating: {
									type: {}
								},
								screenNumber: {
									type: Number,
									required:true
								},
								isActive: {
									type: Boolean,
									required: true
								},
								createdBy: {
									type: Number,
									required: true
								},
								createdDate: {
									type: Number,
									required: true
								},
								updatedDate: {
									type: Number
								}
}