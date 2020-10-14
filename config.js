/*
 *Create and export configuration variables
 */

var environments = {};

//Staging (default) environment
environments.staging = {
  port: 3000,
  envName: "staging",
};

//production environment
environments.production = {
  port: 5000,
  envName: "production",
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
