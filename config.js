/*
 *Create and export configuration variables
 */

var environments = {};

//Staging (default) environment
environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: "staging",
  hashingSecret: "Thisisthehashingsecret",
  maxChecks: 5,
  twilio: {
    accountSid: "ACb32d411ad7fe886aac54c665d25e5c5d",
    authToken: "9455e3eb3109edc12e3d8c92768f7a67",
    fromPhone: "+15005550006",
  },
};

//production environment
environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "production",
  hashingSecret: "Thisisthehashingsecret",
  maxChecks: 5,
  twilio: {
    accountSid: "",
    authToken: "",
    fromPhone: "",
  },
};

//Determine the enviroment that was passed in as a command-line argument
var currentEnv =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

//Check the the current environment is one of the environments above, else default to staging
var envToExport =
  typeof environments[currentEnv] == "object"
    ? environments[currentEnv]
    : environments.staging;

//Export module
module.exports = envToExport;
