/*
 * Server-related tasks
 *
 */

const http = require("http");
const https = require("https");
const fs = require("fs");
var url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;
var config = require("../config");
var handlers = require("./handlers");
var helpers = require("./helpers");
var path = require("path");

// Instantiate the server module object
var server = {};

//Instantiate the HTTP server
server.httpServer = http.createServer(function (req, res) {
  server.unifiedServer(req, res);
});

//Instantiate the HTTPS server
server.httpsServerOptions = {
  key: fs.readFileSync(path.join(__dirname, "/../https/key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "/../https/cert.pem")),
};
server.httpsServer = https.createServer(server.httpsServerOptions, function (
  req,
  res
) {
  server.unifiedServer(req, res);
});

//All the server logic for both the http and https
server.unifiedServer = function (req, res) {
  //Parse the URL
  var parsedURL = url.parse(req.url, true);

  //Get path
  var path = parsedURL.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, "");

  //Get the query string object
  var queryStringObject = parsedURL.query;

  //Get the headers as an object
  var headers = req.headers;

  //Get the HTTP method
  var method = req.method.toLowerCase();

  //Get the payload if any
  var decoder = new StringDecoder("utf-8");
  var buffer = "";
  req.on("data", function (data) {
    buffer += decoder.write(data);
  });
  req.on("end", function () {
    buffer += decoder.end();

    var chosenHandler =
      typeof server.router[trimmedPath] !== "undefined"
        ? server.router[trimmedPath]
        : handlers.notFound;

    var data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: helpers.parseJsonToObject(buffer),
    };

    chosenHandler(data, function (statuscode, payload) {
      statuscode = typeof statuscode == "number" ? statuscode : 200;
      payload = typeof payload == "object" ? payload : {};

      //convert the payload to a string
      var payloadString = JSON.stringify(payload);

      //return the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statuscode);
      res.end(payloadString);

      //log the request path
      console.log("Returning this response: ", statuscode, payload);
    });
  });
};

//Define a request router
server.router = {
  ping: handlers.ping,
  users: handlers.users,
  tokens: handlers.tokens,
  checks: handlers.checks,
};

// Init script
server.init = function () {
  // Start the HTTP server
  server.httpServer.listen(config.httpPort, function () {
    console.log("The HTTP server is running on port " + config.httpPort);
  });

  // Start the HTTPS server
  server.httpsServer.listen(config.httpsPort, function () {
    console.log("The HTTPS server is running on port " + config.httpsPort);
  });
};

// Export the module
module.exports = server;
