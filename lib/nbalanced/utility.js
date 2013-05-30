//===========================================================================
// FILE: utility.js
//
// DESCRIPTION:
//    utility library
//
// HISTORY:
//    Created: 03/2013 Chad Scharf
//===========================================================================
/**
 * Provides utility functions
 *
 * @name utility
 */

//
// Includes
//
var https = require("https"),
    validate = require("./validate");

/**
 * The apiCall method is called in order to make a secure HTTPs call against the Balanced API.
 *
 * @method apiCall
 * @param {Object} options Options for executing the API call to Balanced.
 * @param {String} options.marketplace_uri The marketplace URI for the given marketplace.
 * @param {String} options.secret The API key secret.
 * @param {String} [options.method="POST"] The HTTP method to use for the API action call.
 * @param {String} options.uri The URI for the action that is being requested.
 * @param {Object} [options.json] The data to pass to the server, optional.
 * @param {Boolean} [options.override_uri=false] true if the uri provided should not be tampered, otherwise false
 * @param {Function} callback The callback method to call upon completion or error.
 */
exports.apiCall = function (options, callback) {
    var requiredKeys = [
        "marketplace_uri",
        "secret",
        "uri"
    ];
    if (!validate.parameterRequired(options, "options", callback)) return;
    if (!validate.requiredProperties(options, requiredKeys, null)) return;

    var marketplace_uri = options.marketplace_uri;
    var secret = options.secret;
    var method = options.method || "POST";
    var uri = options.uri;
    var json = options.json;
    var override_uri = options.override_uri || false;

    // Validate the callback function
    if (callback && typeof callback !== "function") {
        // have to throw exception, callback is not a valid function, duh.
        throw "callback supplied is not a function";
    }

    // Get the absolute URI relative to the host/root of the API
    var path = uri;
    // For some actions we expect the URI to be an object URI from Balanced. This means
    //  that the URI is a complete path, not partial and we need not prepend the marketplace_uri
    //  to it since it will already be in there. Auto-detect this and if that's not the case
    //  prepend the marketplace_uri.
    if (!override_uri && uri.indexOf(marketplace_uri) < 0 && uri.indexOf("/customers/") < 0) {
        path = marketplace_uri + (uri.indexOf("/") === 0 ? uri : ("/" + uri));
    }
    // Get our data that will be passed to the server, if using a POST or PUT request
    var data = json ? JSON.stringify(json) : false;
    // Get our expected status code
    var status = 200;
    if (method == "PUT") status = 201;
    if (method == "DELETE") status = 204;

    // Setup the request options
    var reqOptions = {
        hostname: "api.balancedpayments.com",
        port: 443,
        path: path,
        method: method,
        auth: secret + ":",
        headers: {
            "content-type": "application/json",
            "content-length": (data || "").length,
            "accept": "*/*"
        }
    }; // options

    //* // Debug
    console.log("marketplace_uri", marketplace_uri);
    console.log("secret", secret);
    console.log("method", method);
    console.log("uri", path);
    //*/

    // Build our https request
    var req = https.request(reqOptions, function (res) {
        // Ensure the outgoing and expected encoding incoming is UTF-8
        res.setEncoding('utf-8');

        // Build our response string when the data event is fired
        var responseString = "";
        res.on("data", function (chunk) {
            responseString += chunk;
        }); // response data

        // Capture the end event so we can deserialize our object if available
        res.on("end", function() {
            var resultObject = { status: res.statusCode || status };
            try {
                // Parse the response string if one was sent in the response
                if (responseString)
                    resultObject = JSON.parse(responseString);
            }
            catch(e) {
                // Build an error response, throw exception if no callback
                validate.callbackOrThrow(e, callback);
                return;
            }

            if (callback) {
                var err = null;
                if (res.statusCode >= 400) {
                    err = resultObject;
                    resultObject = null;
                }
                // callback should take ERROR as the first parameter, 2nd is the magical return object
                callback(err, resultObject);
            }
            else {
                if (res.statusCode >= 400) {
                    throw JSON.stringify(resultObject || {});
                }
            }

        }); // response end

    }); // req

    req.on("error", function(e){
        validate.callbackOrThrow(e, callback);

    }); // req on error

    // Write the data, if we have any, to the request stream
    if (data && method != "GET" && method != "DELETE")
        req.write(data, "utf-8");

    // Fire the actual request now that our setup is complete
    req.end();

}; // apiCall
