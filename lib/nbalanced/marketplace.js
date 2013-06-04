//===========================================================================
// FILE: marketplace.js
//
// DESCRIPTION:
//    A marketplace class for the Balanced Payment API.
//
// HISTORY:
//    Created: 6/04/2013 Matthew Francis-Landau
//===========================================================================

//
// Includes
//
var utility = require("./utility"),
    validate = require("./validate");

/**
 * The marketplace class represents holds in the Balanced payments API.
 *
 * @name marketplace
 * @method marketplace
 * @constructor marketplace
 * @param {Object} options specifies the initialization options for the marketplace class
 * @param {String} options.marketplace_uri the marketplace URI typically passed from the nbalanced init function
 * @param {String} options.secret the Balanced API key secret typically passed from the nbalanced init function
 */
var marketplace = module.exports = function (options) {
    options = options || {};

    if (!validate.parameterRequired(options, "options", null)) return;
    if (!validate.requiredProperties(options, ["marketplace_uri", "secret"], null)) return;

    this._marketplace_uri = options.marketplace_uri;
    this._secret = options.secret;
}; // exports.marketplace, marketplace


/**
 * Base implementation of 'get' for marketplace.
 *
 * @param {Function} [callback] The callback method.
 */
marketplace.prototype.get = function(callback) {
    var self = this;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: "",
        method: "GET",
    }, callback);
};


/**
 * Base implementation of 'update'.  Update the current marketplace with specified data.
 *
 * @param {Object} data The data that is to be updated.
 * @param {Function} [callback] The callback method.
 */
marketplace.prototype.update = function(data, callback) {
    var self = this;
    //if (!validate.parameterRequired(hold_uri, "hold_uri", callback)) return;
    if (!validate.parameterRequired(data, "data", callback)) return;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: "",
        method: "PUT",
        json: data
    }, callback);
};
