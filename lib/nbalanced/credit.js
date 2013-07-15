//===========================================================================
// FILE: credit.js
//
// DESCRIPTION:
//    A credit class for the Balanced Payment API.
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
 * The credit class represents credits in the Balanced payments API.
 *
 * @name credit
 * @method credit
 * @constructor credit
 * @param {Object} options specifies the initialization options for the credit class
 * @param {String} options.marketplace_uri the marketplace URI typically passed from the nbalanced init function
 * @param {String} options.secret the Balanced API key secret typically passed from the nbalanced init function
 * @param {String} [options.action_uri="/credits"] optional URI to the credits path for a given account, passed from Account
 */
var credit = module.exports = function (options) {
    options = options || {};

    if (!validate.parameterRequired(options, "options", null)) return;
    if (!validate.requiredProperties(options, ["marketplace_uri", "secret"], null)) return;

    this._marketplace_uri = options.marketplace_uri;
    this._secret = options.secret;
    // If the action_uri is not supplied, set our default specific to this class implementation.
    this._action_uri = options.credits_uri || "/credits";
    this._account_uri = options.account_uri;

}; // exports.credit, credit

/**
 * Credits a bank account for the specified amount.
 * Overrides clientBase.create.
 *
 * @param {Object} data The data to use to create the credit.
 * @param {Number} data.amount The amount to credit. USD cents. You must have amount funds transferred to cover the credit.
 * @param {Object} data.bank_account The bank account to apply the credit to.
 * @param {String} data.bank_account.name Name on the bank account. Length must be >= 2.
 * @param {String} data.bank_account.account_number Bank account number. Length must be >= 1.
 * @param {String} [data.bank_account.bank_code] Bank account code. Length must be = 9 (see routing_number).
 * @param {String} data.bank_account.routing_number Bank account code. Length must be = 9.
 * @param {String} data.bank_account.type Either "checking" or "savings".
 * @param {Object} [data.bank_account.meta] Single level mapping from string keys to string values.
 * @param {String} [data.description] The description of the credit transaction, optional.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
credit.prototype.create = function (data, callback) {
    var self = this;

    if (!validate.parameterRequired(data, "data", callback)) return;
    if (!validate.requiredProperties(data, ["amount", "bank_account"], callback)) return;
    if (!validate.requiredProperties(data.bank_account, ["name", "account_number", "routing_number", "type"], callback)) return;

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
credit.prototype.get = function (item_uri, callback) {
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
credit.prototype.list = function (options, callback) {
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
 * Base implementation of 'update'. Updates a specific item by uri with specified data.
 *
 * @param {String} item_uri The URI originally passed back from Balanced after creating the item.
 * @param {Object} data The data to update on the item.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
credit.prototype.update = function (item_uri, data, callback) {
    var self = this;
    if (!validate.parameterRequired(item_uri, "item_uri", callback)) return;
    if (!validate.parameterRequired(data, "data", callback)) return;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: item_uri,
        method: "PUT",
        json: data
    }, callback);

}; // update

/**
 * Credits a saved bank account for the specified amount and appends an optional description.
 *
 * @param {String} credits_uri The URI originally passed back from Balanced after creating the bank account for credits.
 * @param {Number} data.amount The amount to credit. USD cents. You must have amount funds transferred to cover the credit.
 * @param {String} data.description The description of the credit transaction, optional.
 * @param {String} data.appears_on_statement_as The text that will appear on the merchant's bank statement.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
credit.prototype.add = function (credits_uri, data, callback) {
    var self = this;
    if (!validate.parameterRequired(credits_uri, "credits_uri", callback)) return;
    if (!validate.parameterRequired(data, "data", callback)) return;
    if (!validate.requiredProperties(data, ["amount"], callback)) return;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: credits_uri,
        method: "POST",
        json: data,
        override_uri: true
    }, callback);
};