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

//Export module
module.exports = helpers;
