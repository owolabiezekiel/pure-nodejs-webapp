/*
 * Library for storing and editing data
 */

//Dependencies
const fs = require("fs");
const path = require("path");
const helpers = require("./helpers");

//Container for the module (to be exported)
var lib = {};

//Base directory of the data folder
lib.baseDir = path.join(__dirname, "/../.data/");

//Write data to a file
lib.create = function (dir, file, data, callback) {
  //Open the file for writing
  fs.open(lib.baseDir + dir + "/" + file + ".json", "wx", function (
    err,
    fileDescriptor
  ) {
    if (!err && fileDescriptor) {
      //Convert JSON data to string
      var stringData = JSON.stringify(data);
      //Write string data to file
      fs.writeFile(fileDescriptor, stringData, function (err) {
        if (!err) {
          fs.close(fileDescriptor, function (err) {
            if (!err) {
              callback(false);
            } else {
              callback("Error closing open file");
            }
          });
        } else {
          callback("Could not write to file");
        }
      });
    } else {
      callback("Could not create file. the file may already exist");
    }
  });
};

//Read data from a file
lib.read = function (dir, file, callback) {
  fs.readFile(lib.baseDir + dir + "/" + file + ".json", "utf8", function (
    err,
    data
  ) {
    if (!err && data) {
      var parsedData = helpers.parseJsonToObject(data);
      callback(false, parsedData);
    } else {
      callback(err, data);
    }
  });
};

//Update data from a file
lib.update = function (dir, file, data, callback) {
  fs.open(lib.baseDir + dir + "/" + file + ".json", "r+", function (
    err,
    fileDescriptor
  ) {
    if (!err && fileDescriptor) {
      //Convert JSON data to string
      var stringData = JSON.stringify(data);
      //Truncate the file
      fs.ftruncate(fileDescriptor, function (err) {
        if (!err) {
          fs.writeFile(fileDescriptor, stringData, function (err) {
            if (!err) {
              fs.close(fileDescriptor, function (err) {
                if (!err) {
                  callback(false);
                } else {
                  callback("Error closing existing file");
                }
              });
            } else {
              callback("Error writing to existing file");
            }
          });
        } else {
          callback("Error truncating file");
        }
      });
    } else {
      callback("Error updating file. File may not exist or might be corrupt");
    }
  });
};

//Delete a file
lib.delete = function (dir, file, callback) {
  fs.unlink(lib.baseDir + dir + "/" + file + ".json", function (err) {
    if (!err) {
      callback(false);
    } else {
      callback("Error, couldnt delete file");
    }
  });
};
//Export module
module.exports = lib;
