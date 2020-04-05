module.exports.roleSchema = { 
                               roleId: {
                                    type: Number,
                                    unique: true,
                                    required: true,
                                    index: true
                                },
                                name: { 
                                    type: String
                                },
                                description: {
                                    type: String
                                },
                                createdDate: { 
                                    type: Number
                                },
                                updatedDate: { 
                                    type: Number
                                }

};