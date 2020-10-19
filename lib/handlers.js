/*
 * Request Handlers
 */

//Dependencies
const { lookup } = require("dns");
var _data = require("./data");
var helpers = require("./helpers");

//Define the handlers
var handlers = {};

//User handler
handlers.users = function (data, callback) {
  var acceptableMethods = ["get", "post", "delete", "put"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
};

//users sub-handlers object
handlers._users = {};

//users - get
//Required field(s): phone
//Optional field(s): none
// @TODO only let an authenticated user be able to access their own data
handlers._users.get = function (data, callback) {
  //Check that the phone number is valid
  var phone =
    typeof data.queryStringObject.phone == "string" &&
    data.queryStringObject.phone.trim().length == 11
      ? data.queryStringObject.phone.trim()
      : false;

  if (phone) {
    _data.read("users", phone, function (err, data) {
      if (!err && data) {
        // Remove the hashed password from the user object before returning it
        delete data.hashedPassword;
        callback(200, data);
      } else {
        callback(404, {
          Error: "User not found",
        });
      }
    });
  } else {
    callback(400, {
      Error: "Missing or incorrect phone numbers",
    });
  }
};

//users - post
//Required data: firstName, lastName, phone, password, tosAgreement
//Optional data: none
handlers._users.post = function (data, callback) {
  //Check that all required data are filled in correctly
  var firstName =
    typeof data.payload.firstName == "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  var lastName =
    typeof data.payload.lastName == "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  var phone =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length == 11
      ? data.payload.phone.trim()
      : false;
  var password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 1
      ? data.payload.password.trim()
      : false;
  var tosAgreement =
    typeof data.payload.tosAgreement == "boolean" &&
    data.payload.tosAgreement == true
      ? true
      : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    //Make sure user with phone number doesnt exist before
    _data.read("users", phone, function (err, data) {
      if (err) {
        //Hash the password
        var hashedPassword = helpers.hash(password);

        if (hashedPassword) {
          //Create the user object
          var userObject = {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            hashedPassword: hashedPassword,
            tosAgreement: tosAgreement,
          };

          //Persist user in file
          _data.create("users", phone, userObject, function (err) {
            if (!err) {
              callback(200);
            } else {
              callback(400, {
                Error: "Could not create user",
              });
            }
          });
        } else {
          callback(500, {
            Error: "Server error. Password hashing failed",
          });
        }
      } else {
        callback(400, {
          Error:
            "User with this phone number already exists. Please sign in instead",
        });
      }
    });
  } else {
    callback(400, {
      Error: "Missing or incorrect required fields",
    });
  }
};

//users - put
// Required fields: phone
// Optional field(s): firstName, lastName, password(at least one must be supplied)
// @TODO only let an authenticated user be able to edit their own data object
handlers._users.put = function (data, callback) {
  //Check for required fields
  var phone =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length == 11
      ? data.payload.phone.trim()
      : false;

  //Check for optional fields
  var firstName =
    typeof data.payload.firstName == "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  var lastName =
    typeof data.payload.lastName == "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  var password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 1
      ? data.payload.password.trim()
      : false;
  //Error if phone is invalid
  if (phone) {
    //error is nothing is sent for update
    if (firstName || lastName || password) {
      // Lookup the user
      _data.read("users", phone, function (err, userData) {
        if (!err && userData) {
          //Update the necessary fields
          if (firstName) {
            userData.firstName = firstName;
          }
          if (lastName) {
            userData.lastName = lastName;
          }
          if (password) {
            userData.hashedPassword = helpers.hash(password);
          }
          //Store the updated data
          _data.update("users", phone, userData, function (err) {
            if (!err) {
              callback(200);
            } else {
              console.log(err);
              callback(500, {
                Error: "Could not update user",
              });
            }
          });
        } else {
          callback(400, {
            Error: "User not found",
          });
        }
      });
    } else {
      callback(400, {
        Error: "Missing at least one optional field",
      });
    }
  } else {
    callback(400, {
      Error: "Error: missing phone number",
    });
  }
};

//users - delete
//Required field(s): phone
//Optional field(s): none
// @TODO only let an authenticated user be able to delete their own data
// @TODO cliean up any other file associated with this user
handlers._users.delete = function (data, callback) {
  //Check that the phone number is valid
  var phone =
    typeof data.queryStringObject.phone == "string" &&
    data.queryStringObject.phone.trim().length == 11
      ? data.queryStringObject.phone.trim()
      : false;

  if (phone) {
    _data.read("users", phone, function (err, data) {
      if (!err && data) {
        _data.delete("users", phone, function (err) {
          if (!err) {
            callback(200);
          } else {
            callback(500, {
              Error: "Could not delete user",
            });
          }
        });
      } else {
        callback(404, {
          Error: "User not found",
        });
      }
    });
  } else {
    callback(400, {
      Error: "Missing or incorrect phone numbers",
    });
  }
};

//Ping handler
handlers.ping = function (data, callback) {
  callback(200);
};

handlers.notFound = function (data, callback) {
  callback(404);
};

//Export module
module.exports = handlers;
