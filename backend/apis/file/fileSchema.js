module.exports.fileSchema = { 
                                fileId: {
                                    type: Number,
                                    unique: true,
                                    required: true,
                                    index: true
                                },
                                fileName: { 
                                    type: String,
                                    required: true
                                },
                                originalName: {
                                    type: String
                                },
                                filePath: { 
                                    type: String,
                                    required: true
                                },
                                mimeType: {
                                    type: String
                                },
                                category: {
                                    type: String
                                },
                                subCategory: {
                                    type: String
                                },
                                description: {
                                    type: String
                                },
                                createdBy: {
                                    type: Number
                                },
                                uploadBy: {
                                    type: String
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