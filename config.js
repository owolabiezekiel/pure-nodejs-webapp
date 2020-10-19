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
};

//production environment
environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "production",
  hashingSecret: "Thisisthehashingsecret",
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
