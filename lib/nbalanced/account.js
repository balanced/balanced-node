//===========================================================================
// FILE: account.js
//
// DESCRIPTION:
//    An account class for the nbalanced Payment API.
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
 * Represents a Balanced account which can help organize card and bank account information.
 *
 * @name account
 * @method account
 * @constructor account
 * @param {Object} options specifies the initialization options for the account class
 * @param {String} options.marketplace_uri the marketplace URI typically passed from the nbalanced init function
 * @param {String} options.secret the Balanced API key secret typically passed from the nbalanced init function
 */
var account = module.exports = function (options) {
    options = options || {};

    if (!validate.parameterRequired(options, "options", null)) return;
    if (!validate.requiredProperties(options, ["marketplace_uri", "secret"], null)) return;

    this._marketplace_uri = options.marketplace_uri;
    this._secret = options.secret;
    // Action URI cannot be overridden through the options, this is a special case.
    this._action_uri = "/accounts";
    // cache account uri if we're initialized with an exising account
    this._account_uri = options.account_uri;
}; // exports.account, account

/**
 * Creates a new account in Balanced.
 *
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
account.prototype.create = function(callback) {
    var self = this;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: self._action_uri,
        method: "POST"
    }, callback);

}; // create

/**
 * Base implementation of 'get'. Retrieves an item by its URI.
 *
 * @param {String} item_uri The URI originally passed back from Balanced after creating the item.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
account.prototype.get = function (item_uri, callback) {
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
account.prototype.list = function (options, callback) {
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
account.prototype.update = function (item_uri, data, callback) {
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
 * Add a saved card to an account.
 *
 * @param {String} account_uri The account URI originally passed back from Balanced after creating the account.
 * @param {String} card_uri The URI originally passed back from Balanced after creating the card.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
account.prototype.addCard = function (account_uri, card_uri, callback) {
    var self = this;
    if (!validate.parameterRequired(account_uri, "account_uri", null)) return;
    if (!validate.parameterRequired(card_uri, "card_uri", null)) return;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: account_uri,
        method: "PUT",
        json: {card_uri: card_uri}
    }, callback);

}; // addCard

/**
 * Adds a saved bank account to an account.
 *
 * @param {String} account_uri The account URI originally passed back from Balanced after creating the account.
 * @param {String} bank_account_uri The URI originally passed back from Balanced after creating the bank account.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
account.prototype.addBankAccount = function (account_uri, bank_account_uri, callback) {
    var self = this;
    if (!validate.parameterRequired(account_uri, "account_uri", null)) return;
    if (!validate.parameterRequired(bank_account_uri, "bank_account_uri", null)) return;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: account_uri,
        method: "PUT",
        json: {bank_account_uri: bank_account_uri},
        override_uri: true
    }, callback);

}; // addBankAccount

/**
 * Creates a new underwritten account in Balanced.
 *
 * @param {Object} data The data to be used when creating the account.
 * @param {String} data.type Either "person" or "business".
 * @param {String} data.name The name of the account. Sequence of characters. Length must be <= 128.
 * @param {String} data.phone_number E.164 formatted phone number. Length must be <= 15.
 * @param {String} [data.email_address] The email address associated with the account. RFC-2822 formatted.
 * @param {Object} [data.meta] single level object representing key value pairs of meta-data for the account.
 * @param {String} [data.tax_id] The tax id of the merchant or individual. Length must be between 4 and 9.
 * @param {String} [data.dob] Date-of-birth formatted as YYYY-MM-DD.
 * @param {Object} [data.person] The person associated with the merchant company or the person themselves, optional.
 * @param {String} [data.person.name] The name of the person.
 * @param {String} [data.person.dob] Date-of-birth formatted as YYYY-MM-DD.
 * @param {String} [data.person.city] City.
 * @param {String} [data.person.region] Region (e.g. state, province, etc). This field has been deprecated.
 * @param {String} [data.person.state] US state. This field has been deprecated.
 * @param {String} [data.person.postal_code] Postal code. This is known as a zip code in the USA. requires country_code.
 * @param {String} [data.person.street_address] Street address. requires postal_code.
 * @param {String} [data.person.country_code] ISO-3166-3 three character country code.
 * @param {String} [data.person.tax_id] The tax id of the person. Length must be between 4 and 9.
 * @param {String} [data.city] City.
 * @param {String} [data.region] Region (e.g. state, province, etc). This field has been deprecated.
 * @param {String} [data.state] US state. This field has been deprecated.
 * @param {String} [data.postal_code] Postal code. This is known as a zip code in the USA. requires country_code.
 * @param {String} [data.street_address] Street address. requires postal_code.
 * @param {String} [data.country_code] ISO-3166-3 three character country code.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
account.prototype.underwrite = function(data, callback) {
    var self = this;
    if (!validate.parameterRequired(data, "data", callback)) return;
    var requiredKeys = String(data.type).toLowerCase() == 'person' ? [
        "type",
        "name",
        "phone_number",
        "street_address",
        "postal_code",
        "country_code"
    ] : [
        "type",
        "name",
        "phone_number",
        "street_address",
        "postal_code",
        "country_code",
        "person.name",
        "person.dob",
        "person.street_address",
        "person.postal_code",
        "person.country_code"
    ];
    if (!validate.requiredProperties(data, requiredKeys, callback)) return;

    // wrap properties in "merchant" object for the api
    var merchant = {};
    for(var key in data){
        if(data.hasOwnProperty(key)){
            merchant[key] = data[key];
        }
    }
    data = { merchant: merchant };

    if(this._account_uri){
        // update existing account
        utility.apiCall({
            marketplace_uri: self._marketplace_uri,
            secret: self._secret,
            uri: self._account_uri,
            method: "PUT",
            json: data
        }, callback);
    }else{
        // This is the same as a create.
        utility.apiCall({
            marketplace_uri: self._marketplace_uri,
            secret: self._secret,
            uri: self._action_uri,
            method: "POST",
            json: data
        }, callback);
    }

}; // underwrite