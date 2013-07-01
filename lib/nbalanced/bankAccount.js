//===========================================================================
// FILE: bankAccount.js
//
// DESCRIPTION:
//    A bank account class for the nbalanced Payment API.
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
 * bankAccount class represents a saved bank account for the Balanced API.
 *
 * @type {Function}
 * @method bankAccount
 * @constructor bankAccount
 * @param {Object} options specifies the initialization options for the bankAccount class
 * @param {String} options.marketplace_uri the marketplace URI typically passed from the nbalanced init function
 * @param {String} options.secret the Balanced API key secret typically passed from the nbalanced init function
 * @param {String} [options.action_uri="/bank_accounts"] optional URI to the bank accounts path for a given account, passed from Account
 */
var bankAccount = module.exports = function (options) {
    options = options || {};

    if (!validate.parameterRequired(options, "options", null)) return;
    if (!validate.requiredProperties(options, ["marketplace_uri", "secret"], null)) return;

    this._marketplace_uri = options.marketplace_uri;
    this._secret = options.secret;
    // If the action_uri is not supplied, set our default specific to this class implementation.
    this._action_uri = options.bank_accounts_uri || "/bank_accounts";
    this._account_uri = options.account_uri;

}; // exports.bankAccount, bankAccount

/**
 * Creates a saved bank account in Balanced.
 *
 * @param {Object} data The bank account information to save.
 * @param {String} data.name Name on the bank account. Length must be >= 2.
 * @param {String} data.account_number Bank account number. Length must be >= 1.
 * @param {String} data.routing_number Bank account code. Length must be = 9.
 * @param {String} data.type checking or savings.
 * @param {String} [data.meta] Single level mapping from string keys to string values.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
bankAccount.prototype.create = function (data, callback) {
    var self = this;
    if (!validate.parameterRequired(data, "data", callback)) return;
    var requiredKeys = [
        "name",
        "account_number",
        "routing_number",
        "type"
    ];
    if (!validate.requiredProperties(data, requiredKeys, callback)) return;
    // Additional validation based on API rules
    if (data.name.length < 2 &&
        !validate.callbackOrThrow("name must be greater than 2 characters in length.", callback)) return;
    if (data.account_number.length < 1 &&
        !validate.callbackOrThrow("account_number is required.", callback)) return;
    if (data.routing_number.length !== 9 &&
        !validate.callbackOrThrow("routing_number must be exactly 9 digits.", callback)) return;
    if (data.type !== "checking" &&
        data.type !== "savings" &&
        !validate.callbackOrThrow("the only valid values for type are 'checking' and 'savings'.", callback)) return;

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
bankAccount.prototype.get = function (item_uri, callback) {
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
 * @param {Number} [options.limit] The limit for the number of results.
 * @param {Number} [options.offset] The offset for which record to start from.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
bankAccount.prototype.list = function (options, callback) {
    var self = this;
    if (typeof options === "function" && typeof callback === "undefined") {
        callback = options;
        options = { limit: false, offset: false };
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
bankAccount.prototype.update = function (item_uri, data, callback) {
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
 * Creates a new bank account verification.
 *
 * @param {String} verifications_uri The URI originally passed back from Balanced after creating the bank account for verifications.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
bankAccount.prototype.verify = function(verifications_uri, callback) {
    var self = this;
    if (!validate.parameterRequired(verifications_uri, "verifications_uri", callback)) return;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: verifications_uri,
        method: "POST",
        json: { none: "" },
        override_uri: true
    }, callback);

}; // verify

/**
 *  Retrieves a verification for a bank account.
 *
 * @param {String} verification_uri The URI originally passed back from Balanced after creating the verification.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
bankAccount.prototype.verification = function (verification_uri, callback) {
    var self = this;
    if (!validate.parameterRequired(verification_uri, "verification_uri", callback)) return;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: verification_uri,
        method: "GET",
        override_uri: true
    }, callback);

}; // verification

/**
 *  Retrieves a list of all verifications for a bank account.
 *
 * @param {String} verifications_uri The URI originally passed back from Balanced after creating the bank account for verifications.
 * @param {Object|Function} [options] The options for the list function that support paging.
 * @param {Number} [options.limit=10] The limit for the number of results.
 * @param {Number} [options.offset=0] The offset for which record to start from.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
bankAccount.prototype.verifications = function (verifications_uri, options, callback) {
    var self = this;
    if (!validate.parameterRequired(verifications_uri, "verifications_uri", callback)) return;
    if (typeof options === "function" && typeof callback === "undefined") {
        callback = options;
        options = {};
    }

    var limit = options.limit;
    var offset = options.offset;
    var uri = verifications_uri;

    if (limit) uri += ("?limit=" + limit);
    if (offset) uri += ((limit ? "&" : "?") + "offset=" + offset);

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: uri,
        method: "GET",
        override_uri: true
    }, callback);

}; // verifications

/**
 * Confirms the trial deposit amounts. For the test environment the trial deposit amounts are always 1 and 1.
 *
 * @param {String} verification_uri The URI originally passed back from Balanced after creating the verification.
 * @param {Number} amount1 The first deposit amount.
 * @param {Number} amount2 The second deposit amount.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
bankAccount.prototype.confirm = function (verification_uri, amount1, amount2, callback) {
    var self = this;
    if (!validate.parameterRequired(verification_uri, "verification_uri", callback)) return;
    if (!validate.parameterRequired(amount1, "amount1", callback)) return;
    if (!validate.parameterRequired(amount2, "amount2", callback)) return;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: verification_uri,
        method: "PUT",
        json: {
            amount_1: amount1,
            amount_2: amount2
        },
        override_uri: true
    }, callback);

}; // confirm

/**
 * Credits a saved bank account for the specified amount and appends an optional description.
 *
 * @param {String} credits_uri The URI originally passed back from Balanced after creating the bank account for credits.
 * @param {Number} amount The amount to credit. USD cents. You must have amount funds transferred to cover the credit.
 * @param {String|Function} [description] The description of the credit transaction, optional.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
bankAccount.prototype.credit = function (credits_uri, amount, description, callback) {
    var self = this;
    if (typeof description === "function" && typeof callback === "undefined") {
        callback = description;
        description = null;
    }
    if (!validate.parameterRequired(credits_uri, "credits_uri", callback)) return;
    if (!validate.parameterRequired(amount, "amount", callback)) return;
    // Validate amount of credit is greater than $.50 (50 cents) or 50 hundredths, whichever currency we're using.
    if (amount < 50 && !validate.callbackOrThrow("amount must be greater than 50.", callback)) return;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: credits_uri,
        method: "POST",
        json: {
            amount: amount,
            description: description
        },
        override_uri: true
    }, callback);

}; // credit

/**
 * Gets a list of all credits for a given bank account using the credits_uri from that bank account.
 *
 * @param {String} credits_uri The URI originally passed back from Balanced after creating the bank account for credits.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
bankAccount.prototype.credits = function (credits_uri, callback) {
    var self = this;
    if (!validate.parameterRequired(credits_uri, "credits_uri", callback)) return;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: credits_uri,
        method: "GET",
        override_uri: true
    }, callback);

}; // credits

/**
 * Base implementation of 'delete'. Deletes a specific item by uri.
 *
 * @param {String} item_uri The URI originally passed back from Balanced after creating the item.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
bankAccount.prototype.unstore = bankAccount.prototype.delete = function (item_uri, callback) {
    var self = this;
    if (!validate.parameterRequired(item_uri, "item_uri", callback)) return;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: item_uri,
        method: "DELETE",
        override_uri: true
    }, callback);

}; // delete