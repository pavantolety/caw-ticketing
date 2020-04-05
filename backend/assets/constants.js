const CONSTANTS = {		
					// "BASE_URL_UI": "http://svm.edvenswa.com:3003",
					// "BASE_URL_API": "http://svm.edvenswa.com:3002",
					// "BASE_URL_UI": "http://52.221.197.12",
					// "BASE_URL_API": "http://52.221.197.12:3002",
					"BASE_URL_UI": "http://localhost:3003",
					"BASE_URL_API": "http://localhost:3002",
					"LINK_EXPIRED": "linkexpired",
					"ACTIVATE_USER": "activateduser",
					"ERROR_PAGE": "errorpage",
					"AUTH": {
						"FAIL": "Invalid Credentials"
					},
					"AUTH_CODES": {
						"INVALID_TOKEN": "Invalid token",
						"RESET_SUCCESS": "Auth collection data reset successfully"
					},
					"AUTH_HISTORY": {
						"CREATE_SUCCESS": "authHistory created successfully"
					},	
					"DATABASE_CODES": {
						"FAIL": "Error in Database"
					},
					"REQUEST_CODES": {
						"SUCCESS": "Success",
						"FAIL": "Error",
						"WARNING": "Warning"
					},	
					"USER_CODES" : {
						"CREATE_SUCCESS": "User created successfully with UserId {0}",
						"UPDATE_SUCCESS": "User with UserId {0} updated successfully",
						"UPDATE_FAIL": "User with UserId {0} not updated successfully",
						"ALREADY_EXIST": "This email ID is already registered! Please Sign-in",
						"CREATE_MAIL_SENT": "User Activated",
						"NOT_FOUND": "User with userId {0} not Found"
					},
					"MOVIES": {
						"CREATE_SUCCESS": "Movie created successfully with MovieId {0}",
						"DELETE_SUCCESS": "Movie with MovieId {0} removed successfully",
						"UPDATE_SUCCESS": "Movie with MovieId {0} updated successfully",
						"UPDATE_FAIL": "Movie with MovieId {0} not updated successfully",
						"RESET_SUCCESS": "Movie collection data reset successfully",
						"NOT_FOUND": "Movie with MovieId {0} not Found"
					},
					"SHOWS": {
						"CREATE_SUCCESS": "Show created successfully for movieId {0}",
						"UPDATE_SUCCESS": "Show with movieId {0} updated successfully",
						"UPDATE_FAIL": "Show for movieId {0} update failed",
						"NOT_FOUND": "Shows for movieId {0} not Found"
					},
					"FILE": {
						"CREATE_SUCCESS": "file create successfully with fileId {0}",
						"DELETE_SUCCESS": "file with fieId {0} removed successfully",
						"UPDATE_SUCCESS": "file with fileId {0} updated successfully",
						"UPDATE_FAIL": "file with fileId {0} not updated successfully",
						"PASSWORD_RESET_FAIL": "file with filed {0} password reset is failed",
						"PASSWORD_RESET_SUCCESS": "file with fileId {0} password reset successfully",
						"RESET_SUCCESS": "file collection data reset successfully",
						"NOT_FOUND": "File with fileId {0} not Found"
					},
					"VALIDATE": {
						"FAIL": "Field validation Error",
						"FIELD_VALUE_INVALID": "field {0} value is invalid",
						"REQUIRED": "field '{0}' is required",
						"NOT_A_DATE": "field {0} is incorrect UTC Date",
						"NOT_AN_EMAIL": "field '{0}' is an invalid email address",
						"NOT_A_PHONE": "field {0} is invalid phone value",
						"NOT_A_MOBILE_PHONE": "{0} is not a valid mobile phone value for field {1}",
						"NOT_A_INTEGER": "{0} is not a valid integer value for field {1}",
						"NOT_A_NUMBER": "field {0} is invalid number value",
						"NOT_A_VALUE": "field {0} can't be empty",
						"NOT_A_VALID_GENDER":  "{0} is not a valid gender type.",
						"VALUE_TOO_BIG": "field {0} data is too large",
						"VALUE_TOO_SMALL": "field {0} data is too small",
						"PASSWORD_TOO_SMALL": "Password length should be minimum 12 Characters",
						"MANDATORY": "Fill Mandatory Fields",
						"TEXT_ONLY": "First Name/Last Name should only contain text",
						"NOT_EMPTY": "field {0} is empty",
						"EMPTY_TEXT": "First Name/Last can't be empty",
						"NOT_A_TEXT": "field {0} is invalid Text"									
					},
					"FORGOT_PASSWORD":{
						"PASSWORD_LINK_EXPIRED" : "Password reset link expired",
						"PIN_RESET" : "Pin Reset Successfully",
						"PIN_CHANGE" : "Pin Changed Successfully",
						"WRONG_PASSOWRD" : "Wrong Password",
						"INVALID_PASSWORD" : "Invalid password",
						"INVALID_EMAIL": "Email not Found",
						"SUCCESS": "Your password recovered sucessfully. New Password sent to your email {0}",
						"ACCOUNT_NOT_FOUND": "User not found",
						"PASSWORD_LENGTH" : "{0} should be atleast 12 characters",
						"SAME_PASSWORD" : "New Password and Confirm New Password should be same"
					},
					"LOGIN_CODES": {
						"LOGIN_EMAIL_FAIL": "This email doesn't exist, please check",
						"LOGIN_FAIL": "Invalid Credentials",
						"LOGIN_ADMIN_FAIL": "No admin access found for this user",
						"INACTIVE_USER" : "Inactive User",
						"LOGIN_USER_INACTIVE": " You have not activated your account yet. Please check your mail.",
						"LOGIN_USER_INACTIVE_ORGANISATION": "Inactive Organisation. Please contact your organisation Admin",
						"LOGIN_ADMIN_USER_INACTIVE_ORGANISATION": "Inactive Organisation. Please contact Codel support",
						"LOGIN_USER": "Not Authorized User"
						
					},
					"LOGOUT_CODES": {
						"LOGOUT_SUCCESS": "Logged out successfully and token {0} invalidated",
						"LOGOUT_FAIL": "Logout fail. Unable to invalidate token {0}"
					},
					"ALLOWED_FILE_DOWNLOAD_DOMAINS": ['http://localhost:4001/']
				};

module.exports.CONSTANTS = CONSTANTS;