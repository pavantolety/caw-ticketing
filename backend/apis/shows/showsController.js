var utils = require('../../assets/utils').utils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var VALIDATE = utils.CONSTANTS.VALIDATE;
var validate = utils.validate;

var Show = function() {
    return {
    	showId: 0,
		showTime: null,
		showDate: null,
		showId: 0,
		theaterName: null,
		movieId: 0,
		seating: {},
		screenNumber: 0,
		quality: null,
		isActive: true,
		createdBy: 0,
		createdDate: 0,
        updatedDate: 0
	}
};

function ShowsAPI(showRecord) {
    var show = new Show();
    show.getShowId = function() {
        return this.showId;
    };
    show.setShowId = function(showId) {
        if (showId) {
            if (validate.isInteger(showId + '')) {
                this.showId = showId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, showId, 'showId')
                };
            }
        }
    };
    show.getMovieId = function() {
        return this.movieId;
    };
    show.setMovieId = function(movieId) {
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
    show.getScreenNumber = function() {
        return this.screenNumber;
    };
    show.setScreenNumber = function(screenNumber) {
        if (screenNumber) {
            if (validate.isInteger(screenNumber + '')) {
                this.screenNumber = screenNumber;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, screenNumber, 'screenNumber')
                };
            }
        }
    };
    show.getTheaterName = function() {
        return this.theaterName;
    };
    show.setTheaterName = function(theaterName) {
         if (theaterName) {
            if (theaterName.length <= 250) {
                this.theaterName = theaterName;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.VALUE_TOO_BIG, theaterName, 'theaterName')
                };
            }
        }
    };

    show.getShowDate = function() {
        return this.showDate;
    };
    show.setShowDate = function(showDate) {
        if (showDate) {
            this.showDate = showDate;
        }
    };
    show.getShowTime = function() {
        return this.showTime;
    };
    show.setShowTime = function(showTime) {
        if (showTime) {
            this.showTime = showTime;
        }
    };
    show.getSeating = function() {
        return this.seating;
    };
    show.setSeating = function(seating) {
        if (seating) {
            this.seating = seating;
        }
    };
    show.getquality = function() {
        return this.quality;
    };
    show.setQuality = function(quality) {
        if (quality) {
            this.quality = quality;
        }
    };
    show.getIsActive = function() {
        return this.isActive;
    };
    show.setIsActive = function(isActive) {
        if (isActive) {
            this.isActive = isActive;
        }
    };
    show.getCreatedBy = function() {
        return this.createdBy;
    };
    show.setCreatedBy = function(createdBy) {
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
	show.getCreatedDate = function() {
        return this.createdDate;
    };
    show.setCreatedDate = function(createdDate) {
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
    show.getUpdatedDate = function() {
        return this.updatedDate;
    };
    show.setUpdatedDate = function(updatedDate) {
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

    if (showRecord) {
        var errorList = [];
        try {
            show.setShowId(showRecord.showId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            show.setMovieId(showRecord.movieId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            show.setShowTime(showRecord.showTime);
        } catch (e) {
           errorList.push(e);
        }
        try {
            show.setShowDate(showRecord.showDate);
        } catch (e) {
           errorList.push(e);
        }
        try {
            show.setTheaterName(showRecord.theaterName);
        } catch (e) {
            errorList.push(e);
        }
        try {
            show.setSeating(showRecord.seating);
        } catch (e) {
             errorList.push(e);
        }
        try {
            show.setScreenNumber(showRecord.screenNumber);
        } catch (e) {
             errorList.push(e);
        }
        try {
            show.setQuality(showRecord.quality);
        } catch (e) {
             errorList.push(e);
        }
        try {
            show.setCreatedBy(showRecord.createdBy);
        } catch (e) {
            errorList.push(e);
        }
        try {
            show.setCreatedDate(showRecord.createdDate);
        } catch (e) {
            errorList.push(e);
        }
        try {
            show.setUpdatedDate(showRecord.updatedDate);
        } catch (e) {
            errorList.push(e);
        }
        try {
            show.setIsActive(showRecord.isActive);
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
    return show;
}

module.exports.ShowsAPI = ShowsAPI;