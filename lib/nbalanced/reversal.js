//===========================================================================
// FILE: reversal.js
//
// DESCRIPTION:
//    Represents a reversal in the Balanced Payment API
//
// HISTORY:
//    Created: 7/1/2013 Matthew Francis-Landau
//===========================================================================

//
// Includes
//
var utility = require("./utility"),
    validate = require("./validate");

/**
 * The reversal class represents debits in the Balanced payments API.
 *
 * @name reversal
 * @method reversal
 * @constructor reversal
 * @param {Object} options specifies the initialization options for the reversal class
 * @param {String} options.marketplace_uri the marketplace URI typically passed from the nbalanced init function
 * @param {String} options.secret the Balanced API key secret typically passed from the nbalanced init function
 * @param {String} [options.action_uri="/reversals"] optional URI to the reversals path for a given account, passed from Account
 */
var reversal = module.exports = function (options) {
    options = options || {};

    if (!validate.parameterRequired(options, "options", null)) return;
    if (!validate.requiredProperties(options, ["marketplace_uri", "secret"], null)) return;

    this._marketplace_uri = options.marketplace_uri;
    this._secret = options.secret;
    // If the action_uri is not supplied, set our default specific to this class implementation.
    this._action_uri = options.reversals_uri || "/reversals";
    this._account_uri = options.account_uri;

};

/**
 * Creates a reversal from a credit. You can either reverse the full amount of the credit or you can issue a partial reversal,
 *  where the amount is less than the charged amount.
 * Overrides clientBase.create.
 *
 * @param {String} debit_uri The URI originally passed back from Balanced after creating the credit.
 * @param {Object|Function} [data] The data to create the reversal with, optional.
 * @param {Number} [data.amount] integer. Value must be >= 1. Value must be <= the remaining un-reversed amount on the
 *  original credit.
 * @param {String} [data.description] The description of the debit transaction.
 * @param {Object|Function} [data.meta] Single level mapping from string keys to string values.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
reversal.prototype.create = function (credit, data, callback) {
    var self = this;
    if (!validate.parameterRequired(data, "data", callback)) return;
    if (!validate.parameterRequired(credit, "credit", callback)) return;
    if (typeof data === "function" && typeof callback === "undefined") {
        callback = data;
        data = {};
    }


    data = data || {};
    data.credits_uri = credit.uri;

    var uri = credit.reversals_uri;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: uri,
        method: "POST",
        json: data
    }, callback);

};

/**
 * Base implementation of 'list'. Gets a list of items.
 *
 * @param {Object|Function} [options] The options for the list function that support paging.
 * @param {Number} [options.limit=10] The limit for the number of results.
 * @param {Number} [options.offset=0] The offset for which record to start from.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
reversal.prototype.list = function (options, callback) {
    var self = this;
    if (typeof options === "function" && typeof callback === "undefined") {
        callback = options;
        options = {};
    }

    var limit = options.limit;
    var offset = options.offset;
    // Optionally can use an action_uri for a specific Account, otherwise use our base marketplace only
    var uri = self._action_uri;

    if (limit) uri += ("?limit=" + limit);
    if (offset) uri += ((limit ? "&" : "?") + "offset=" + offset);

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: uri,
        method: "GET"
    }, callback);

}; // list

/**
 * Updates the description or meta-data for a reversals. Amounts, accounts, etc. cannot be updated.
 * Overrides clientBase.update.
 *
 * @param {String} reversal_uri The URI originally passed back from Balanced after creating the reversal.
 * @param {Object} data The data to update on the debit.
 * @param {String} [data.description] The description of the debit transaction.
 * @param {Object} [data.meta] Single level mapping from string keys to string values.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
reversal.prototype.update = function (reversal_uri, data, callback) {
    var self = this;
    if (!validate.parameterRequired(reversal_uri, "reversal_uri", callback)) return;
    if (!validate.parameterRequired(data, "data", callback)) return;

    // Only a limited set of data is allowed to be updated, so curb any attempt to send anything else here.
    var updateData = {};
    if (data.meta) updateData.meta = data.meta;
    if (data.description) updateData.description = data.description;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: reversal_uri,
        method: "PUT",
        json: updateData
    }, callback);

}; // update


/**
 * Base implementation of 'get'. Retrieves an item by its URI.
 *
 * @param {String} item_uri The URI originally passed back from Balanced after creating the item.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
reversal.prototype.get = function (item_uri, callback) {
    var self = this;
    if (!validate.parameterRequired(item_uri, "item_uri", callback)) return;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: item_uri,
        method: "GET"
    }, callback);

}; // get
