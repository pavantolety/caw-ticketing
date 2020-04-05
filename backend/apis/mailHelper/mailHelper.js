var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

var utils = require('../../assets/utils').utils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;

var config = require('../../libs/config');

var smtpTransport = nodemailer.createTransport(smtpTransport({
    host : config.get('smtpConfig:host'),
    secureConnection : config.get('smtpConfig:secureConnection'),
    port: config.get('smtpConfig:port'),
    auth : config.get('smtpConfig:auth')
}));

function sendMail(template, callback) {
	var mailOptions = {
        from : config.get('smtpConfig:from'),
        to : template.recipients,
        bcc : 'edvenswatech@gmail.com',
        subject : template.subject,
        html : utils.formatText(template.body)
    };
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if(error) {
            callback({
				status: REQUEST_CODES.FAIL,
				result: response
			});
			return;
        } else {
            callback({
				status: REQUEST_CODES.SUCCESS,
				result: response
			});
			return;
        }
    });
}

function sendEMails(mails, callback) {
    var fromEmailId = config.get('smtpConfig:from');
    mails = mails.map(function(mail) {
        mail.form = fromEmailId;
        return mail;
    });
    var mailIndex = 0;
    function sendEmail(mail) {
        smtpTransport.sendMail(mail, function(error, response) {
            if(error) {
                callback({
                    status: REQUEST_CODES.FAIL,
                    result: response
                });
                return;
            } else {
                mailIndex++;
                if (mails[mailIndex]) {
                    sendEmail(mails[mailIndex]);
                } else {
                    callback({
                        status: REQUEST_CODES.SUCCESS,
                        result: response
                    });
                }
                return;
            }
        });
    }
    sendEmail(mails[mailIndex]);
}

function sendWeeklyReport(emailContent, callback) {
    var mailOptions={
        from : config.get('smtpConfig:from'),
        to : emailContent.email,
        bcc : 'edvenswatech@gmail.com',
        subject : emailContent.subject,
        html : emailContent.content
    }
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if(error) {
            callback({
                status: REQUEST_CODES.FAIL,
                result: response
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: response
            });
            return;
        }
    });
}

module.exports.sendMail = sendMail;
module.exports.sendEMails = sendEMails;
module.exports.sendWeeklyReport = sendWeeklyReport;