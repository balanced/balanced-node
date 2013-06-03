//===========================================================================
// FILE: event.js
//
// DESCRIPTION:
//    An event class for the nbalanced Payment API.
//
// HISTORY:
//    Created: 6/03/2013 Matthew Francis-Landau
//===========================================================================

//
// Includes
//
var utility = require("./utility"),
    validate = require("./validate");


var event = module.exports = function (options) {
     options = options || {};

    if (!validate.parameterRequired(options, "options", null)) return;
    if (!validate.requiredProperties(options, ["marketplace_uri", "secret"], null)) return;

    this._marketplace_uri = options.marketplace_uri;
    this._secret = options.secret;

    this._event_uri = "/v1/events";

}; // exports.event, event


/**
 * Retrieves a customers by its URI.
 *
 * @param  {String} item_uri The URI origionally passed back from Balanced after some action.
 */
event.prototype.get = function(item_uri, callback) {
    var self = this;
    if (!validate.parameterRequired(item_uri, "item_uri", callback)) return;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: item_uri,
        method: "GET",
	override_uri: true
    }, callback);
}; // get


/**
 * Get a list of events.
 *
 * @param {Object|Funciton} [options] The options for the lits function that support paging.
 * @param {Number} [options.limit=10] The limit for the number of results.
 * @param {Number} [options.offset=0] The offset for which record to start from.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
event.prototype.list = function(options, callback) {
     var self = this;
    if (typeof options === "function" && typeof callback === "undefined") {
        callback = options;
        options = {};
    }

    var limit = options.limit;
    var offset = options.offset;
    // Optionally can use an action_uri for a specific Account, otherwise use our base marketplace only
    var uri = self._event_uri;

    if (limit) uri += ("?limit=" + limit);
    if (offset) uri += ((limit ? "&" : "?") + "offset=" + offset);

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: uri,
        override_uri: true,
        method: "GET"
    }, callback);

};
