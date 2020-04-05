module.exports.userSchema = { 
                               userId: {
                                    type: Number,
                                    unique: true,
                                    required: true,
                                    index: true
                                },
                                firstName: { 
                                    type: String,
                                    required: true
                                },
                                lastName: { 
                                    type: String,
                                    required: true
                                },
                                email: { 
                                    type: String,
                                    unique: true,
                                    required: true
                                },
                                password: {
                                    type: String,
                                    required: true
                                },
                                location: {
                                    type: String
                                },
                                gender: {
                                    type: String
                                },
                                dob: {
                                    type: String
                                },
                                logo: {
                                    type: String
                                },
                                status: {
                                    type: String
                                },
                                isAdmin: {
                                    type: Boolean
                                },
                                phone: {
                                    type: Number
                                },
                                createdDate: { 
                                    type: Number,
                                    index: true
                                },
                                updatedDate: { 
                                    type: Number,
                                    index: true
                                }

};