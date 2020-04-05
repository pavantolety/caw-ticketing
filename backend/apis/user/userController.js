var utils = require('../../assets/utils').utils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var VALIDATE = utils.CONSTANTS.VALIDATE;
var validate = utils.validate;

var User = function() {
    return {
        userId: 0,
        firstName: null,
        lastName: null,
        email: null,
        password: null,
        logo:null,
        location: null,
        gender: null,
        dob: 0,
        status: null,
        isAdmin: Boolean,
        phone: 0,
        createdDate: 0,
        updatedDate: 0
    };
};

function UserAPI(userRecord) {
    var user = new User();
    user.getUserId = function() {
        return this.userId;
    };
    user.setUserId = function(userId) {
        if (userId) {
            if (validate.isInteger(userId + '')) {
                    this.userId = userId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, userId, 'userId')
                };
            }
        }
    };
    user.getFirstName = function() {
        return this.firstName;
    };
    user.setFirstName = function(firstName) {
         if (firstName) {
            if (firstName.length <= 100) {
                this.firstName = firstName;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.VALUE_TOO_BIG, firstName, 'firstName')
                };
            }
        }
    };
    user.getLastName = function() {
        return this.lastName;
    };
    user.setLastName = function(lastName) {
         if (lastName) {
            if (lastName.length <= 100) {
                this.lastName = lastName;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.VALUE_TOO_BIG, lastName, 'lastName')
                };
            }
        }
    };
    user.getEmail = function() {
        return this.email;
    };
    user.setEmail= function(email) {
        if (email) {
            if (utils.validate.isEmail(email)) {
                this.email = email;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_AN_EMAIL, email, 'email')
                };
            }
        }
    };
    user.getPassword = function() {
        return this.password;
    };
    user.setPassword = function(password) {
        if (password) {
            this.password = password;
        }
    };
    user.getLocation = function() {
        return this.location;
    };
    user.setLocation = function(location) {
        if (location) {
            this.location = location;
        }
    };
    user.getGender = function() {
        return this.gender;
    };
    user.setGender = function(gender) {
        if (gender) {
            this.gender = gender;
        }
    };
    user.getDob = function() {
        return this.dob;
    };
    user.setDob = function(dob) {
        // if (dob) {
        //     if (validate.isInteger(dob + '')) {
                    this.dob = dob;
        //     } else {
        //         throw {
        //             status: VALIDATE.FAIL,
        //             error: utils.formatText(VALIDATE.NOT_A_INTEGER, dob, 'dob')
        //         };
        //     }
        // }
    };
    user.getLogo = function() {
        return this.logo;
    };
    user.setLogo = function(logo) {
        if (logo) {
            this.logo = logo;
        }
    };
    user.getStatus = function() {
        return this.status;
    };
    user.setStatus = function(status) {
         if (status) {
            if (status.length <= 50) {
                this.status = status;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.VALUE_TOO_BIG, status, 'status')
                };
            }
        }
    };
    user.getIsAdmin = function() {
        return this.isAdmin;
    };
    user.setIsAdmin = function(isAdmin) {
        if (isAdmin == true || isAdmin == false) {
            this.isAdmin = isAdmin; 
        }
    };
    user.getPhone = function() {
        return this.phone;
    };
    user.setPhone = function(phone) {
        if (phone) {
            if (validate.isInteger(phone + '')) {
                    this.phone = phone;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, phone, 'phone')
                };
            }
        }
    };
    user.getCreatedDate = function() {
        return this.createdDate;
    };
    user.setCreatedDate = function(createdDate) {
        if (createdDate) {
            if (validate.isInteger(createdDate + '')) {
                    this.createdDate = createdDate;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, createdDate, 'createdDate')
                };
            }
        }
    };
    user.getUpdatedDate = function() {
        return this.updatedDate;
    };
    user.setUpdatedDate = function(updatedDate) {
        if (updatedDate) {
            if (validate.isInteger(updatedDate + '')) {
                    this.updatedDate = updatedDate;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, updatedDate, 'updatedDate')
                };
            }
        }
    };
   
    if (userRecord) {
        var errorList = [];
        try {
            user.setUserId(userRecord.userId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setFirstName(userRecord.firstName);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setLastName(userRecord.lastName);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setEmail(userRecord.email);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setPassword(userRecord.password);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setGender(userRecord.gender);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setDob(userRecord.dob);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setLogo(userRecord.logo);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setStatus(userRecord.status);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setIsAdmin(userRecord.isAdmin);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setPhone(userRecord.phone);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setCreatedDate(userRecord.createdDate);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setUpdatedDate(userRecord.updatedDate);
        } catch (e) {
            errorList.push(e);
        }
        if (errorList.length) {
            console.log(errorList);
            throw {
                status: REQUEST_CODES.FAIL,
                error: errorList
            };
        }
    }
    return user;
}

module.exports.UserAPI = UserAPI;