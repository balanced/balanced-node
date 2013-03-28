//===========================================================================
// FILE: debit.js
//
// DESCRIPTION:
//    A debit class for the Balanced Payment API.
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
 * The debit class represents debits in the Balanced payments API.
 *
 * @name debit
 * @method debit
 * @constructor debit
 * @param {Object} options specifies the initialization options for the debit class
 * @param {String} options.marketplace_uri the marketplace URI typically passed from the nbalanced init function
 * @param {String} options.secret the Balanced API key secret typically passed from the nbalanced init function
 * @param {String} [options.action_uri="/debits"] optional URI to the debits path for a given account, passed from Account
 */
var debit = module.exports = function (options) {
    options = options || {};

    if (!validate.parameterRequired(options, "options", null)) return;
    if (!validate.requiredProperties(options, ["marketplace_uri", "secret"], null)) return;

    this._marketplace_uri = options.marketplace_uri;
    this._secret = options.secret;
    // If the action_uri is not supplied, set our default specific to this class implementation.
    this._action_uri = options.debits_uri || "/debits";
    this._account_uri = options.account_uri;

}; // exports.debit, debit

/**
 * Debits an account. Returns a uri that can later be used to reference this debit.
 *
 * Successful creation of a debit using a card will return an associated hold mapping as part of the response.
 * This hold was created and captured behind the scenes automatically.
 * For ACH debits there is no corresponding hold.
 *
 * @param {Object} data The request data necessary to perform the debit.
 * @param {Number} [data.amount] integer. If the resolving URI references a hold then this is hold amount. You can
 *  always capture less than the hold amount (e.g. a partial capture). Otherwise its the maximum per debit amount
 *  for your marketplace. Value must be >= the minimum per debit amount for your marketplace. Value must be <= the
 *  maximum per debit amount for your marketplace.
 * @param {String} [data.appears_on_statement_as] Text that will appear on the buyer's statement.
 * @param {Object} [data.meta] Single level mapping from string keys to string values.
 * @param {String} [data.description] Custom description of the transaction or additional text.
 * @param {String} [data.account_uri] The account URI, optional.
 * @param {String} [data.on_behalf_of_uri] The account of a merchant, usually a seller or service provider, that is
 *  associated with this card charge or bank account debit.
 * @param {String} [data.hold_uri] If no hold is provided one my be generated and captured if the funding source is a card.
 * @param {String} [data.source_uri] URI of a specific bank account or card to be debited.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
debit.prototype.create = function (data, callback) {
    var self = this;
    if (!validate.parameterRequired(data, "data", callback)) return;

    // Set up the account uri if not passed in and we have one.
    if (!data.account_uri && self._account_uri) data.account_uri = self._account_uri;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: self._action_uri,
        method: "POST",
        json: data
    }, callback);

}; // create

/**
 * Updates the description or meta-data for a debit. Amounts, accounts, etc. cannot be updated.
 *
 * @param {String} item_uri The URI originally passed back from Balanced after creating the debit.
 * @param {Object} data The data to update on the debit.
 * @param {String} [data.description] The description of the debit transaction.
 * @param {Object} [data.meta] Single level mapping from string keys to string values.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
debit.prototype.update = function (item_uri, data, callback) {
    var self = this;
    if (!validate.parameterRequired(item_uri, "item_uri", callback)) return;
    if (!validate.parameterRequired(data, "data", callback)) return;

    // Only a limited set of data is allowed to be updated, so curb any attempt to send anything else here.
    var updateData = {};
    if (data.meta) updateData.meta = data.meta;
    if (data.description) updateData.description = data.description;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: item_uri,
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
debit.prototype.get = function (item_uri, callback) {
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
debit.prototype.list = function (options, callback) {
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
 * Issues a refund against an existing debit. This is a convenience method.
 *
 * @param {String} debit_uri The URI of the original debit to issue the refund against.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
debit.prototype.refund = function (debit_uri, callback) {
    var self = this;
    if (!validate.parameterRequired(debit_uri, "debit_uri", callback)) return;

    var uri = debit_uri + "/refunds";

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: uri,
        method: "POST"
    }, callback);

}; // refund