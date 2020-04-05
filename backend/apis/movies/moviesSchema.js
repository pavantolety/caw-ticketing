module.exports.moviesSchema = { 
                                movieId: {
                                    type: Number,
                                    unique: true,
                                    required: true,
                                    index: true
                                },
                                name: { 
                                    type: String,
                                    required: true,
                                    index: true
                                },
                                description: { 
                                    type: String
                                },
                                details: {
                                    type: String
                                },
                                createdBy: { 
                                    type: Number
                                },
                                logo: { 
                                    type: String
                                },
                                categories: { 
                                    type: []
                                },
                                audienceRating: {
                                    type: String
                                },
                                language: { 
                                    type: String
                                },
                                qualities: { 
                                    type: []
                                },
                                releaseYear: { 
                                    type: String
                                },
                                avgRating: {
                                    type: Number
                                },
                                totalRating: {
                                    type: Number
                                },
                                startDate: {
                                    type: String
                                },
                                isActive: {
                                    type: Boolean
                                },
                                endDate: {
                                    type: String
                                },
                                createdDate: {
                                    type: String,
                                    index: true
                                },
                                updatedDate: {
                                    type: String,
                                    index: true
                                }
};