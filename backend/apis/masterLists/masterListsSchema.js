module.exports.masterListsSchema = {
                                    masterListId: {
                                          type: Number,
                                          unique: true,
                                          required: true,
                                          index: true
                                    },
                                    masterListName: {
                                          type: String,
                                          required: true,
                                    },
                                    list: []
} 