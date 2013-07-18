//===========================================================================
// FILE: card.js
//
// DESCRIPTION:
//    Represents a saved bank card / credit card for the Balanced API
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
 * card class represents a saved bank card or credit card for the Balanced API
 *
 * @name card
 * @method card
 * @constructor card
 * @param {Object} options specifies the initialization options for the card class
 * @param {String} options.marketplace_uri the marketplace URI typically passed from the nbalanced init function
 * @param {String} options.secret the Balanced API key secret typically passed from the nbalanced init function
 * @param {String} [options.action_uri="/cards"] optional URI to the cards path for a given account, passed from Account
 */
var card = module.exports = function (options) {
    options = options || {};

    if (!validate.parameterRequired(options, "options", null)) return;
    if (!validate.requiredProperties(options, ["marketplace_uri", "secret"], null)) return;

    this._marketplace_uri = options.marketplace_uri;
    this._secret = options.secret;
    // If the action_uri is not supplied, set our default specific to this class implementation.
    this._action_uri = options.cards_uri || "/cards";
    this._account_uri = options.account_uri;

}; // exports.card, card

/**
 * Creates a new card for a customer
 *
 * @method create
 * @param {Object} data The data to pass to the server.
 * @param {String} data.card_number The digits of the credit card number.
 * @param {Number} data.expiration_year Expiration year. The current year or later. Value must be <= 9999.
 * @param {Number} data.expiration_month Expiration month (e.g. 1 for January). If expiration_year is the current year then current month or later, otherwise 1. Value must be <= 12.
 * @param {String} [data.security_code] The 3-4 digit security code for the card.
 * @param {String} [data.name] Sequence of characters. Length must be <= 128.
 * @param {String} [data.phone_number] E.164 formatted phone number. Length must be <= 15.
 * @param {String} [data.city] City.
 * @param {String} [data.region] Region (e.g. state, province, etc). This field has been deprecated.
 * @param {String} [data.state] US state. This field has been deprecated.
 * @param {String} [data.postal_code] Postal code. This is known as a zip code in the USA. requires country_code.
 * @param {String} [data.street_address] Street address. requires postal_code.
 * @param {String} [data.country_code] [ISO-3166-3]{@link http://www.iso.org/iso/home/standards/country_codes.htm#2012_iso3166-3} three character country code.
 * @param {Object} [data.meta] Single level mapping from string keys to string values.
 * @param {String} [data.is_valid] Indicates whether the card is active (true) or has been deactivated (false).
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
card.prototype.create = function(data, callback) {
    var self = this;
    if (!validate.parameterRequired(data, "data", callback)) return;
    var requiredKeys = [
        "card_number",
        "expiration_year",
        "expiration_month"
    ];
    if (!validate.requiredProperties(data, requiredKeys, null)) return;

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
card.prototype.get = function (item_uri, callback) {
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
card.prototype.list = function (options, callback) {
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
card.prototype.update = function (item_uri, data, callback) {
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
 * Invalidates a saved card in Balanced. Marks the is_valid property = false.
 *
 * @param {String} card_uri The URI for the saved card to update.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
card.prototype.invalidate = function(card_uri, callback) {
    var self = this;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: card_uri,
        method: "PUT",
        json: {is_valid: false}
    }, callback);

}; // invalidate

/**
 * Unstores (delete) a saved card in Balanced.
 *
 * @param {String} card_uri The URI for the saved card to update.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
card.prototype.unstore = card.prototype.delete = function (item_uri, callback) {
    var self = this;
    if (!validate.parameterRequired(item_uri, "item_uri", callback)) return;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: item_uri,
        method: "DELETE"
    }, callback);

}; // delete
