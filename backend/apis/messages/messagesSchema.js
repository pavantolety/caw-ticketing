module.exports.messagesSchema = {
						messagesId: {
							type: Number,
                                    	unique: true,
                                    	required: true,
                                    	index: true
                                    },
                                    messages: {
                                    	type: []
                                    },
                                    users: {
                                          type: [],
                                          required: true
                                    },
                                    createdDate: {
                                    	type: Number,
	                                    required: true,
                                          index: true
                                    }
} 