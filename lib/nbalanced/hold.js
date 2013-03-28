//===========================================================================
// FILE: hold.js
//
// DESCRIPTION:
//    A hold class for the Balanced Payment API.
//
// HISTORY:
//    Created: 3/24/13 Chad Scharf
//===========================================================================

//
// Includes
//
var utility = require("./utility"),
    validate = require("./validate"),
    debit = require("./debit");

/**
 * The hold class represents holds in the Balanced payments API.
 *
 * @name hold
 * @method hold
 * @constructor hold
 * @param {Object} options specifies the initialization options for the hold class
 * @param {String} options.marketplace_uri the marketplace URI typically passed from the nbalanced init function
 * @param {String} options.secret the Balanced API key secret typically passed from the nbalanced init function
 * @param {String} [options.action_uri="/holds"] optional URI to the holds path for a given account, passed from Account
 */
var hold = module.exports = function (options) {
    options = options || {};

    if (!validate.parameterRequired(options, "options", null)) return;
    if (!validate.requiredProperties(options, ["marketplace_uri", "secret"], null)) return;

    this._marketplace_uri = options.marketplace_uri;
    this._secret = options.secret;
    // If the action_uri is not supplied, set our default specific to this class implementation.
    this._action_uri = options.holds_uri || "/holds";
    this._account_uri = options.account_uri;

}; // exports.hold, hold

/**
 * Debits an account. Returns a uri that can later be used to reference this debit.
 *
 * Successful creation of a debit using a card will return an associated hold mapping as part of the response.
 * This hold was created and captured behind the scenes automatically.
 * For ACH debits there is no corresponding hold.
 *
 * @param {Object} data The request data necessary to perform the debit.
 * @param {Number} [data.amount] integer. Value must be >= to the minimum debit amount allowed for your marketplace.
 *  Value must be <= to the maximum debit amount allowed for your marketplace.
 * @param {String} [data.account_uri] The account URI, optional.
 * @param {String} [data.appears_on_statement_as] Text that will appear on the buyer's statement.
 * @param {String} [data.description] Custom description of the transaction or additional text.
 * @param {Object} [data.meta] Single level mapping from string keys to string values.
 * @param {String} [data.source_uri] URI of a specific bank account or card to be debited; otherwise debits an account.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
hold.prototype.create = function (data, callback) {
    var self = this;
    if (!validate.parameterRequired(data, "data", callback)) return;
    if (!validate.requiredProperties(data, ["amount"], callback)) return;

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
hold.prototype.get = function (item_uri, callback) {
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
hold.prototype.list = function (options, callback) {
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
 * Updates the description or meta-data for a hold. Amounts, accounts, etc. cannot be updated.
 *
 * @param {String} hold_uri The URI originally passed back from Balanced after creating the hold.
 * @param {Object} data The data to update on the debit.
 * @param {String} [data.description] The description of the debit transaction.
 * @param {Object} [data.meta] Single level mapping from string keys to string values.
 * @param {String} [data.appears_on_statement_as] Text that will appear on the buyer's statement.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
hold.prototype.update = function (hold_uri, data, callback) {
    var self = this;
    if (!validate.parameterRequired(hold_uri, "hold_uri", callback)) return;
    if (!validate.parameterRequired(data, "data", callback)) return;

    // Only a limited set of data is allowed to be updated, so curb any attempt to send anything else here.
    var updateData = {};
    if (data.meta) updateData.meta = data.meta;
    if (data.description) updateData.description = data.description;
    if (data.appears_on_statement_as) updateData.appears_on_statement_as = data.appears_on_statement_as;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: hold_uri,
        method: "PUT",
        json: updateData
    }, callback);

}; // update

/**
 * Voids a hold. This cancels the hold. After voiding, the hold can no longer be captured.
 * This operation is irreversible.
 *
 * @param {String} hold_uri The URI originally passed back from Balanced after creating the hold.
 * @param {Object|Function} [data] The data to update on the debit.
 * @param {String} [data.description] The description of the debit transaction.
 * @param {Object} [data.meta] Single level mapping from string keys to string values.
 * @param {Boolean} [data.is_void] Flag value, should be true or false.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
hold.prototype.void = function (hold_uri, data, callback) {
    var self = this;
    if (!validate.parameterRequired(hold_uri, "hold_uri", callback)) return;
    if (typeof data === "function" && typeof callback === "undefined") {
        callback = data;
        data = {};
    }

    // Only a limited set of data is allowed to be updated, so curb any attempt to send anything else here.
    var updateData = {};
    if (data.meta) updateData.meta = data.meta;
    if (data.description) updateData.description = data.description;
    updateData.is_void = true;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: hold_uri,
        method: "PUT",
        json: updateData
    }, callback);

}; // void

/**
 * Captures a hold by debiting an account based on a hold. Returns a uri that can later be used to reference this debit.
 *
 * @param {String} hold_uri The URI originally passed back from Balanced after creating the hold.
 * @param {Object} [data] The request data necessary to perform the debit; optional.
 * @param {Number} [data.amount] integer. Only necessary if debiting a lessor amount than the amount of the hold.
 * @param {String} [data.appears_on_statement_as] Text that will appear on the buyer's statement.
 * @param {Object} [data.meta] Single level mapping from string keys to string values.
 * @param {String} [data.description] Custom description of the transaction or additional text.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
hold.prototype.capture = function (hold_uri, data, callback) {
    var self = this;
    if (!validate.parameterRequired(hold_uri, "hold_uri", callback)) return;

    data = data || {};
    data.hold_uri = hold_uri;

    var debitsUri = self._action_uri.replace("/holds", "/debits");

    // We're simply creating a debit for this existing hold.
    new debit({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        action_uri: debitsUri
    }).create(data, callback);

}; // capture