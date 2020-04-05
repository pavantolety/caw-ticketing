var utils = require('../../assets/utils').utils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var VALIDATE = utils.CONSTANTS.VALIDATE;
var validate = utils.validate;

var Movie = function() {
    return {
        movieId: 0,
        name: null,
        description: null,
        details: null,
        releaseYear: 0,
        createdBy: 0,
        logo: null,
        categories: [],
        audienceRating: null,
        language: null,
        qualities:[],
        avgRating: 0,
        totalRating: 0,
        startDate: 0,
        endDate: 0,
        isActive: true,
        createdDate: 0,
        updatedDate: 0
    }
};

function MoviesAPI(movieRecord) {
    var movie = new Movie();
    movie.getMovieId = function() {
        return this.movieId;
    };
    movie.setMovieId = function(movieId) {
        if (movieId) {
            if (validate.isInteger(movieId + '')) {
                this.movieId = movieId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, movieId, 'movieId')
                };
            }
        }
    };
    movie.getName = function() {
        return this.name;
    };
    movie.setName = function(name) {
         if (name) {
            if (name.length <= 250) {
                this.name = name;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.VALUE_TOO_BIG, name, 'name')
                };
            }
        }
    };
    movie.getDescription = function() {
        return this.description;
    };
    movie.setDescription = function(description) {
        if (description) {
            this.description = description;
        }
    };
    movie.getReleaseYear = function() {
        return this.releaseYear;
    };
    movie.setReleaseYear = function(releaseYear) {
        if (releaseYear) {
            this.releaseYear = releaseYear;
        }
    };
    movie.getLanguage = function() {
        return this.language;
    };
    movie.setLanguage = function(language) {
        if (language) {
            this.language = language;
        }
    };
    movie.getAudienceRating = function() {
        return this.audienceRating;
    };
    movie.setAudienceRating = function(audienceRating) {
        if (audienceRating) {
            this.audienceRating = audienceRating;
        }
    };
    movie.getDetails = function() {
        return this.details;
    };
    movie.setDetails = function(details) {
        if (details) {
            this.details = details;
        }
    };
    movie.getCreatedBy = function() {
        return this.createdBy;
    };
    movie.setCreatedBy = function(createdBy) {
        if (createdBy) {
            if (validate.isInteger(createdBy + '')) {
                this.createdBy = createdBy;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, createdBy, 'createdBy')
                };
            }
        }
    };
    movie.getLogo = function() {
        return this.logo;
    };
    movie.setLogo = function(logo) {
        if (logo) {
            this.logo = logo;
        }
    };
    movie.getCategories = function() {
        return this.categories;
    };
    movie.setCategories = function(categories) {
        if (categories) {
            if (categories.length <= 500) {
                this.categories = categories;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.VALUE_TOO_BIG, categories, 'categories')
                };
            }
        }
    };
    movie.getIsActive = function() {
        return this.isActive;
    };
    movie.setIsActive = function(isActive) {
        this.isActive = isActive;
    };
    movie.getAvgRating = function() {
        return this.avgRating;
    };
    movie.setAvgRating = function(avgRating) {
        if (avgRating) {
            this.avgRating = avgRating;           
        }
    };
    movie.getQualities = function() {
        return this.qualities;
    };
    movie.setQualities = function(qualities) {
        if (qualities) {
            this.qualities = qualities;           
        }
    };
    movie.getTotalRating = function() {
        return this.totalRating;
    };
    movie.setTotalRating = function(totalRating) {
        if (totalRating) {
            this.totalRating = totalRating;           
        }
    };
    movie.getStartDate = function() {
        return this.startDate;
    };
    movie.setStartDate = function(startDate) {
        // if (startDate) {
        //     if (validate.isInteger(startDate + '')) {
                this.startDate = startDate;
        //     } else {
        //         throw {
        //             status: VALIDATE.FAIL,
        //             error: utils.formatText(VALIDATE.NOT_A_INTEGER, startDate, 'startDate')
        //         };
        //     }
        // }
    };
    movie.getEndDate = function() {
        return this.endDate;
    };
    movie.setEndDate = function(endDate) {
        // if (endDate) {
        //     if (validate.isInteger(endDate + '')) {
                this.endDate = endDate;
        //     } else {
        //         throw {
        //             status: VALIDATE.FAIL,
        //             error: utils.formatText(VALIDATE.NOT_A_INTEGER, endDate, 'endDate')
        //         };
        //     }
        // }
    };
    movie.getCreatedDate = function() {
        return this.createdDate;
    };
    movie.setCreatedDate = function(createdDate) {
        // if (createdDate) {
        //     if (validate.isInteger(createdDate + '')) {
                this.createdDate = createdDate;
        //     } else {
        //         throw {
        //             status: VALIDATE.FAIL,
        //             error: utils.formatText(VALIDATE.NOT_A_INTEGER, createdDate, 'createdDate')
        //         };
        //     }
        // }
    };
    movie.getUpdatedDate = function() {
        return this.updatedDate;
    };
    movie.setUpdatedDate = function(updatedDate) {
        // if (updatedDate) {
        //     if (validate.isInteger(updatedDate + '')) {
                this.updatedDate = updatedDate;
        //     } else {
        //         throw {
        //             status: VALIDATE.FAIL,
        //             error: utils.formatText(VALIDATE.NOT_A_INTEGER, updatedDate, 'updatedDate')
        //         };
        //     }
        // }
    };

    if (movieRecord) {
        var errorList = [];
        try {
            movie.setMovieId(movieRecord.movieId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            movie.setName(movieRecord.name);
        } catch (e) {
            errorList.push(e);
        }
        try {
            movie.setDescription(movieRecord.description);
        } catch (e) {
           errorList.push(e);
        }
        try {
            movie.setDetails(movieRecord.details);
        } catch (e) {
           errorList.push(e);
        }
        try {
            movie.setCreatedBy(movieRecord.createdBy);
        } catch (e) {
            errorList.push(e);
        }
        try {
            movie.setLogo(movieRecord.logo);
        } catch (e) {
             errorList.push(e);
        }
        try {
            movie.setCategories(movieRecord.categories);
        } catch (e) {
            errorList.push(e);
        }
        try {
            movie.setReleaseYear(movieRecord.releaseYear);
        } catch (e) {
            errorList.push(e);
        }
        try {
            movie.setLanguage(movieRecord.language);
        } catch (e) {
            errorList.push(e);
        }
        try {
            movie.setAudienceRating(movieRecord.audienceRating);
        } catch (e) {
            errorList.push(e);
        }
        try {
            movie.setQualities(movieRecord.qualities);
        } catch (e) {
            errorList.push(e);
        }
        try {
            movie.setAvgRating(movieRecord.avgRating);
        } catch (e) {
            errorList.push(e);
        }
        try {
            movie.setTotalRating(movieRecord.totalRating);
        } catch (e) {
            errorList.push(e);
        }
        try {
            movie.setStartDate(movieRecord.startDate);
        } catch (e) {
            errorList.push(e);
        }
        try {
            movie.setEndDate(movieRecord.endDate);
        } catch (e) {
            errorList.push(e);
        }
        try {
            movie.setCreatedDate(movieRecord.createdDate);
        } catch (e) {
            errorList.push(e);
        }
        try {
            movie.setUpdatedDate(movieRecord.updatedDate);
        } catch (e) {
            errorList.push(e);
        }
        try {
            movie.setIsActive(movieRecord.isActive);
        } catch (e) {
            errorList.push(e);
        }
        if (errorList.length) {
            throw {
                status: REQUEST_CODES.FAIL,
                error: errorList
            };
        }
    }
    return movie;
}

module.exports.MoviesAPI = MoviesAPI;