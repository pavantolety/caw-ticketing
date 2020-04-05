var utils = require('../../assets/utils').utils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var VALIDATE = utils.CONSTANTS.VALIDATE;
var validate = utils.validate;

var File = function() {
    return {
        fileId: 0,
        fileName: null,
        originalName: null,
        filePath: null,
        mimeType: null,
        category: null,
        subCategory: null,
        description: null,
        createdBy: 0,
        uploadBy: null,
        createdDate: 0,
        updatedDate: 0
   }
};
function FileAPI(fileRecord) {
    var file = new File();

    file.getFileId = function() {
        return this.fileId;
    };
    file.setFileId = function(fileId) {
        if (fileId) {
            if (validate.isInteger(fileId + '')) {
                this.fileId = fileId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, fileId, 'fileId')
                };
            }
        }
    };
    file.getFileName = function() {
        return this.fileName;
    };
    file.setFileName = function(fileName) {       
        if (fileName) {
            if (fileName.length <= 250) {
                this.fileName = fileName;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.VALUE_TOO_BIG, fileName, 'fileName')
                };
            }
        }
    };
    file.getOriginalName = function() {
        return this.originalName;
    };
    file.setOriginalName = function(originalName) {       
        if (originalName) {
            if (originalName.length <= 250) {
                this.originalName = originalName;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.VALUE_TOO_BIG, originalName, 'originalName')
                };
            }
        }
    };
    file.getFilePath = function() {
        return this.filePath;
    };
    file.setFilePath = function(filePath) {
        if (filePath) {
            if (filePath.length <= 500) {
                this.filePath = filePath;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.VALUE_TOO_BIG, filePath, 'filePath')
                };
            }
        }
    };
    file.getMimeType = function() {
        return this.mimeType;
    };
    file.setMimeType = function(mimeType) {       
        if (mimeType) {
            if (mimeType.length <= 250) {
                this.mimeType = mimeType;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.VALUE_TOO_BIG, mimeType, 'mimeType')
                };
            }
        }
    };
    file.getCategory = function() {
        return this.category;
    }
    file.setCategory = function(category) {
        if (category) {
            this.category = category;
        }
    }
    file.getSubCategory = function() {
        return this.subCategory;
    }
    file.setSubCategory = function(subCategory) {
        if (subCategory) {
            this.subCategory = subCategory;
        }
    }
    file.getDescription = function() {
        return this.description;
    }
    file.setDescription = function(description) {
        if (description) {
            this.description = description;
        }
    }
    file.getCreatedBy = function() {
        return this.createdBy;
    };
    file.setCreatedBy = function(createdBy) {
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
    file.getUploadBy = function() {
        return this.uploadBy;
    }
    file.setUploadBy = function(uploadBy) {
        if (uploadBy) {
            this.uploadBy = uploadBy;
        }
    }
    file.getCreatedDate = function() {
        return this.createdDate;
    };
    file.setCreatedDate = function(createdDate) {
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
    file.getUpdatedDate = function() {
        return this.updatedDate;
    };
    file.setUpdatedDate = function(updatedDate) {
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
    if (fileRecord) {
        var errorList = [];
		try {
            file.setFileId(fileRecord.fileId);
        } catch (e) {
			errorList.push(e);
        }
        try {
            file.setFileName(fileRecord.fileName);
        } catch (e) {
			 errorList.push(e);
        }
        try {
            file.setOriginalName(fileRecord.originalName);
        } catch (e) {
			 errorList.push(e);
        }
        try {
            file.setFilePath(fileRecord.filePath);            
        } catch (e) {
            errorList.push(e);
        }
        try {
            file.setMimeType(fileRecord.mimeType);            
        } catch (e) {
            errorList.push(e);
        }
        try {
            file.setCategory(fileRecord.category);
        } catch (e) {
            errorList.push(e);
        }
        try {
            file.setSubCategory(fileRecord.subCategory);
        } catch (e) {
            errorList.push(e);
        }
        try {
            file.setDescription(fileRecord.description);
        } catch (e) {
            errorList.push(e);
        }
        try {
            file.setCreatedBy(fileRecord.createdBy);
        } catch (e) {
            errorList.push(e);
        }
        try {
            file.setUploadBy(fileRecord.uploadBy);
        } catch (e) {
            errorList.push(e);
        }
        try {
            file.setCreatedDate(fileRecord.createdDate);
        } catch (e) {
           errorList.push(e);
        }
        try {
            file.setUpdatedDate(fileRecord.updatedDate);
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
	return file;
}
module.exports.FileAPI = FileAPI;