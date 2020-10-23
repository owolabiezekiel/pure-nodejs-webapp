/*
 *Helper library for various tasks
 */

//Dependencies
var crypto = require("crypto");
var config = require("../config");

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

//Export module
module.exports = helpers;
