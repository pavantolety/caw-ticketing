var utils = require('../../assets/utils').utils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var VALIDATE = utils.CONSTANTS.VALIDATE;
var validate = utils.validate;

var Messages = function() {
    return {
        messagesId : 0,
		messages : [],
		users : 0,
		createdDate : 0
   }
};

function MessagesAPI(messagesRecord) {
    var messages = new Messages();

    messages.getMessageId = function() {
        return this.messageId;
    };
    messages.setMessageId = function(messagesId) {
        if (messagesId) {
            if (validate.isInteger(messagesId + '')) {
                this.messagesId = messagesId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, messagesId, 'messagesId')
                };
            }
        }
    };

    messages.getMessages = function() {
        return this.messages;
    }
    messages.setMessages = function(messages) {
        if (messages) {
            this.messages = messages;
        }
    }

    messages.getUsers = function() {
        return this.users;
    };
    messages.setUsers = function(users) {
        if (users.length > 1) {
            this.users = users;
        }
    };
    messages.getCreatedDate = function() {
        return this.createdDate;
    };
    messages.setCreatedDate = function(createdDate) {
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

    if (messagesRecord) {
        var errorList = [];
		try {
            messages.setMessageId(messagesRecord.messagesId);
        } catch (e) {
			errorList.push(e);
        }
        try {
            messages.setMessages(messagesRecord.messages);
        } catch (e) {
			 errorList.push(e);
        }
        try {
            messages.setUsers(messagesRecord.users);
        } catch (e) {
            errorList.push(e);
        }
        try {
            messages.setCreatedDate(messagesRecord.createdDate);
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
	return messages;
}
module.exports.MessagesAPI = MessagesAPI;