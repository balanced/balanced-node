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
 * @param {String} [options.action_uri="/reversals"] optional URI to the refunds path for a given account, passed from Account
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
 * Creates a reversal from a credit. You can either reverse the full amount of the credit or you can issue a partial refund,
 *  where the amount is less than the charged amount.
 * Overrides clientBase.create.
 *
 * @param {String} debit_uri The URI originally passed back from Balanced after creating the credit.
 * @param {Object|Function} [data] The data to create the refund with, optional.
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
