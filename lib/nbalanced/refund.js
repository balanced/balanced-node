//===========================================================================
// FILE: refund.js
//
// DESCRIPTION:
//    Represents a refund in the Balanced Payment API
//
// HISTORY:
//    Created: 3/24/13 Chad Scharf
//===========================================================================

//
// Includes
//
var utility = require("./utility"),
    validate = require("./validate");

/**
 * The refund class represents debits in the Balanced payments API.
 *
 * @name refund
 * @method refund
 * @constructor refund
 * @param {Object} options specifies the initialization options for the refund class
 * @param {String} options.marketplace_uri the marketplace URI typically passed from the nbalanced init function
 * @param {String} options.secret the Balanced API key secret typically passed from the nbalanced init function
 * @param {String} [options.action_uri="/refunds"] optional URI to the refunds path for a given account, passed from Account
 */
var refund = module.exports = function (options) {
    options = options || {};

    if (!validate.parameterRequired(options, "options", null)) return;
    if (!validate.requiredProperties(options, ["marketplace_uri", "secret"], null)) return;

    this._marketplace_uri = options.marketplace_uri;
    this._secret = options.secret;
    // If the action_uri is not supplied, set our default specific to this class implementation.
    this._action_uri = options.refunds_uri || "/refunds";
    this._account_uri = options.account_uri;

}; // exports.refund, refund

/**
 * Creates a refund from a debit. You can either refund the full amount of the debit or you can issue a partial refund,
 *  where the amount is less than the charged amount.
 * Overrides clientBase.create.
 *
 * @param {String} debit_uri The URI originally passed back from Balanced after creating the debit.
 * @param {Object|Function} [data] The data to create the refund with, optional.
 * @param {Number} [data.amount] integer. Value must be >= 1. Value must be <= the remaining un-refunded amount on the
 *  original debit.
 * @param {String} [data.description] The description of the debit transaction.
 * @param {Object|Function} [data.meta] Single level mapping from string keys to string values.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
refund.prototype.create = function (debit_uri, data, callback) {
    var self = this;
    if (!validate.parameterRequired(data, "data", callback)) return;
    if (!validate.parameterRequired(debit_uri, "debit_uri", callback)) return;
    if (typeof data === "function" && typeof callback === "undefined") {
        callback = data;
        data = {};
    }
    data = data || {};
    data.debit_uri = debit_uri;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: self._action_uri,
        method: "POST",
        json: data
    }, callback);

}; // create

/**
 * Base implementation of 'get'. Retrieves an item by its URI.
 *
 * @param {String} item_uri The URI originally passed back from Balanced after creating the item.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
refund.prototype.get = function (item_uri, callback) {
    var self = this;
    if (!validate.parameterRequired(item_uri, "item_uri", callback)) return;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: item_uri,
        method: "GET"
    }, callback);

}; // get

/**
 * Base implementation of 'list'. Gets a list of items.
 *
 * @param {Object|Function} [options] The options for the list function that support paging.
 * @param {Number} [options.limit=10] The limit for the number of results.
 * @param {Number} [options.offset=0] The offset for which record to start from.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
refund.prototype.list = function (options, callback) {
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
 * Updates the description or meta-data for a refund. Amounts, accounts, etc. cannot be updated.
 * Overrides clientBase.update.
 *
 * @param {String} refund_uri The URI originally passed back from Balanced after creating the refund.
 * @param {Object} data The data to update on the debit.
 * @param {String} [data.description] The description of the debit transaction.
 * @param {Object} [data.meta] Single level mapping from string keys to string values.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
refund.prototype.update = function (refund_uri, data, callback) {
    var self = this;
    if (!validate.parameterRequired(refund_uri, "refund_uri", callback)) return;
    if (!validate.parameterRequired(data, "data", callback)) return;

    // Only a limited set of data is allowed to be updated, so curb any attempt to send anything else here.
    var updateData = {};
    if (data.meta) updateData.meta = data.meta;
    if (data.description) updateData.description = data.description;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: refund_uri,
        method: "PUT",
        json: updateData
    }, callback);

}; // update