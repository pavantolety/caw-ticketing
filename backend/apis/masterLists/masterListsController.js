var utils = require('../../assets/utils').utils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var VALIDATE = utils.CONSTANTS.VALIDATE;
var validate = utils.validate;

var MasterList = function() {
    return {
        masterListId : 0,
		masterListName : [],
		list:[]
   }
};

function MasterListAPI(masterListRecord) {
    var masterList = new MasterList();

    masterList.getMasterListId = function() {
        return this.masterListId;
    };
    masterList.setMasterListId = function(masterListId) {
        if (masterListId) {
            if (validate.isInteger(masterListId + '')) {
                this.masterListId = masterListId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, masterListId, 'masterListId')
                };
            }
        }
    };

    masterList.getMasterListName = function() {
        return this.masterListName;
    }
    masterList.setMasterListName = function(masterListName) {
        if (masterListName) {
            this.masterListName = masterListName;
        }
    }

    masterList.getList = function() {
        return this.list;
    }
    masterList.setList = function(list) {
        if (list) {
            this.list = list;
        }
    }

    if (masterListRecord) {
        var errorList = [];
		try {
            masterList.setMasterListId(masterListRecord.masterListId);
        } catch (e) {
			errorList.push(e);
        }
        try {
            masterList.setMasterListName(masterListRecord.masterListName);
        } catch (e) {
			 errorList.push(e);
        }
        try {
            masterList.setList(masterListRecord.list);
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
	return masterList;
}
module.exports.MasterListAPI = MasterListAPI;