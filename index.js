/*
 *Primary file for the API
 *
 */

//Dependencies
const http = require("http");
var url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;
var config = require("./config");

//The server should respond to all requests with a string
var server = http.createServer(function (req, res) {
  //Parse the URL
  var parsedURL = url.parse(req.url, true);

  //Get path
  var path = parsedURL.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, "");

  //Get the query string object
  var queryStringObject = parsedURL.query;

  //Get the headers as an object
  var headers = parsedURL.headers;

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
      payload: buffer,
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
});

//Start the server
server.listen(config.port, function () {
  console.log(
    "This server is listen on port " +
      config.port +
      " in " +
      config.envName +
      " mode"
  );
});

//Define the handlers
var handlers = {};

//Define the sample handler
handlers.sample = function (data, callback) {
  callback(406, {
    name: "sample handler",
  });
};

handlers.notFound = function (data, callback) {
  callback(404);
};

//Define a request router
var router = {
  sample: handlers.sample,
};
