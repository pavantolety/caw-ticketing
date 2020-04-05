var utils = require('../../assets/utils').utils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var VALIDATE = utils.CONSTANTS.VALIDATE;
var validate = utils.validate;

var Role = function() {
    return {
        roleId: 0,
        name: null,
        description: null,
        createdDate: 0,
        updatedDate: 0
    };
};

function RoleAPI(roleRecord) {
    var role = new Role();
    role.getRoleId = function() {
        return this.roleId;
    };
    role.setRoleId = function(roleId) {
        if (roleId) {
            if (validate.isInteger(roleId + '')) {
                    this.roleId = roleId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, roleId, 'roleId')
                };
            }
        }
    };
    role.getName = function() {
        return this.name;
    };
    role.setName = function(name) {
         if (name) {
            if (name.length <= 50) {
                this.name = name;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.VALUE_TOO_BIG, name, 'name')
                };
            }
        }
    };
    role.getDescription = function() {
        return this.description;
    };
    role.setDescription = function(description) {
        if (description) {
            this.description = description;
        }
    };
    role.getCreatedDate = function() {
        return this.createdDate;
    };
    role.setCreatedDate = function(createdDate) {
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
    role.getUpdatedDate = function() {
        return this.updatedDate;
    };
    role.setUpdatedDate = function(updatedDate) {
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
   
    if (roleRecord) {
        var errorList = [];
        try {
            role.setRoleId(roleRecord.roleId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            role.setName(roleRecord.name);
        } catch (e) {
            errorList.push(e);
        }
        try {
            role.setDescription(roleRecord.description);
        } catch (e) {
            errorList.push(e);
        }
        try {
            role.setCreatedDate(roleRecord.createdDate);
        } catch (e) {
            errorList.push(e);
        }
        try {
            role.setUpdatedDate(roleRecord.updatedDate);
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
    return role;
}

module.exports.RoleAPI = RoleAPI;