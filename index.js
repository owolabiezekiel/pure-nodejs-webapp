/*
 *Primary file for the API
 *
 */

//Dependencies
const http = require("http");
const https = require("https");
const fs = require("fs");
var url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;
var config = require("./config");
var handlers = require("./lib/handlers");
var helpers = require("./lib/helpers");

// helpers.sendTwilioSms(
//   "8106723916",
//   "Hello There. this is a test sms",
//   function (err) {
//     console.log("This was the error: ", err);
//   }
// );
//Instantiate the HTTP server
var httpServer = http.createServer(function (req, res) {
  unifiedServer(req, res);
});

//Start the HTTP server
httpServer.listen(config.httpPort, function () {
  console.log("This server is listen on port " + config.httpPort);
});

//Instantiate the HTTPS server
var httpsServerOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem"),
};
var httpsServer = https.createServer(httpsServerOptions, function (req, res) {
  unifiedServer(req, res);
});

//Start the HTTPs server
httpsServer.listen(config.httpsPort, function () {
  console.log("This server is listen on port " + config.httpsPort);
});

//All the server logic for both the http and https
var unifiedServer = function (req, res) {
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
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
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
var router = {
  ping: handlers.ping,
  users: handlers.users,
  tokens: handlers.tokens,
  checks: handlers.checks,
};
