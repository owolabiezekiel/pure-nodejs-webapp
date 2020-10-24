/*
 *Helper library for various tasks
 */

//Dependencies
var crypto = require("crypto");
var config = require("../config");
var querystring = require("querystring");
var https = require("https");

//Container for all the helpers
var helpers = {};

//SHA-256 password hash function
helpers.hash = function (password) {
  if (typeof password == "string" && password.length > 0) {
    var hash = crypto
      .createHmac("sha256", config.hashingSecret)
      .update(password)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};

//Return JSON as objects
helpers.parseJsonToObject = function (buffer) {
  try {
    var obj = JSON.parse(buffer);
    return obj;
  } catch (e) {
    return {};
  }
};

//Create a string of random alphanumeric characters of a given length
helpers.createTokenString = function (strLen) {
  strLen = typeof strLen == "number" && strLen > 0 ? strLen : false;
  if (strLen) {
    // Define all the possible chracters of the string
    var possibleChars =
      "qwertyuiopasdfghjklmnbvcxz0123456789QWERTYUIOPLKJHGFDSAZXCVBNM";

    // Declare the final str
    var finalStr = "";
    for (var i = 1; i <= strLen; i++) {
      //pick a random character from a list of possible characters and append it to the string
      var randomChar = possibleChars.charAt(
        Math.floor(Math.random() * possibleChars.length)
      );
      finalStr += randomChar;
    }

    // Return the final string
    return finalStr;
  } else {
    return false;
  }
};

//Create a string of random alphanumeric characters of a given length
helpers.createRandomString = function (strLen) {
  strLen = typeof strLen == "number" && strLen > 0 ? strLen : false;
  if (strLen) {
    // Define all the possible chracters of the string
    var possibleChars =
      "qwertyuiopasdfghjklmnbvcxz0123456789QWERTYUIOPLKJHGFDSAZXCVBNM";

    // Declare the final str
    var finalStr = "";
    for (var i = 1; i <= strLen; i++) {
      //pick a random character from a list of possible characters and append it to the string
      var randomChar = possibleChars.charAt(
        Math.floor(Math.random() * possibleChars.length)
      );
      finalStr += randomChar;
    }

    // Return the final string
    return finalStr;
  } else {
    return false;
  }
};

helpers.sendTwilioSms = function (phone, msg, callback) {
  // Validate parameters
  phone =
    typeof phone == "string" && phone.trim().length == 10
      ? phone.trim()
      : false;
  msg =
    typeof msg == "string" && msg.trim().length > 0 && msg.trim().length <= 1600
      ? msg.trim()
      : false;
  if (phone && msg) {
    // Configure the request payload
    var payload = {
      From: config.twilio.fromPhone,
      To: "+234" + phone,
      Body: msg,
    };
    var stringPayload = querystring.stringify(payload);

    // Configure the request details
    var requestDetails = {
      protocol: "https:",
      hostname: "api.twilio.com",
      method: "POST",
      path:
        "/2010-04-01/Accounts/" + config.twilio.accountSid + "/Messages.json",
      auth: config.twilio.accountSid + ":" + config.twilio.authToken,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(stringPayload),
      },
    };

    // Instantiate the request object
    var req = https.request(requestDetails, function (res) {
      // Grab the status of the sent request
      var status = res.statusCode;
      // Callback successfully if the request went through
      if (status == 200 || status == 201) {
        callback(false);
      } else {
        callback("Status code returned was " + status);
      }
    });

    // Bind to the error event so it doesn't get thrown
    req.on("error", function (e) {
      callback(e);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();
  } else {
    callback("Given parameters were missing or invalid");
  }
};

//Export module
module.exports = helpers;
