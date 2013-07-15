//===========================================================================
// FILE: customer.js
//
// DESCRIPTION:
//    A customer class for the nbalanced Payment API.
//    Based on https://github.com/balanced/balanced-api/blob/master/resources/customers.rst
//
// HISTORY:
//    Created: 5/10/13 Ian Serlin
//===========================================================================

//
// Includes
//
var utility = require("./utility"),
    validate = require("./validate");

/**
 * A customer represents a business or person within your Marketplace. A
 * customer can have many funding instruments such as cards and bank accounts
 * associated to them.
 *
 * @name customer
 * @method customer
 * @constructor customer
 * @param {Object} options specifies the initialization options for the account class
 * @param {String} options.marketplace_uri the marketplace URI typically passed from the nbalanced init function
 * @param {String} options.secret the Balanced API key secret typically passed from the nbalanced init function
 */
var customer = module.exports = function (options) {
    options = options || {};

    if (!validate.parameterRequired(options, "options", null)) return;
    if (!validate.requiredProperties(options, ["marketplace_uri", "secret"], null)) return;

    this._marketplace_uri = options.marketplace_uri;
    this._secret = options.secret;
    // Action URI cannot be overridden through the options, this is a special case.
    this._action_uri = "/v1/customers";
    // cache customer uri if we're initialized with an exising customer
    this.customer_uri = options.customer_uri;
}; // exports.customer, customer

/**
 * Creates a new customer in Balanced.
 *
 * @param {Object} [data] The data to initialize the customer with, see https://github.com/balanced/balanced-api/blob/master/resources/customers.rst
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
customer.prototype.create = function(data, callback) {
    var self = this;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: self._action_uri,
        override_uri: true,
        method: "POST",
        json: data
    }, callback);

}; // create

/**
 * Base implementation of 'get'. Retrieves a customer by its URI.
 *
 * @param {String} [customer_uri] Optional if this is a customer scoped instance. The URI originally passed back from Balanced after creating the customer (customer.uri).
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
customer.prototype.get = function (customer_uri, callback) {
    var self = this;

    if (arguments.length == 1) {
        callback = customer_uri;
        customer_uri = undefined;
    }

    if (validate.stringIsBlank(self.customer_uri)
        && !validate.parameterRequired(customer_uri, "customer_uri", callback)) return;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: customer_uri ? customer_uri : self.customer_uri,
        override_uri: true,
        method: "GET"
    }, callback);

}; // get

/**
 * Base implementation of 'list'. Gets a list of customers.
 *
 * @param {Object|Function} [options] The options for the list function that support paging.
 * @param {Number} [options.limit=10] The limit for the number of results.
 * @param {Number} [options.offset=0] The offset for which record to start from.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
customer.prototype.list = function (options, callback) {
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
        override_uri: true,
        method: "GET"
    }, callback);

}; // list

/**
 * Base implementation of 'update'. Updates a specific customer by uri with specified data.
 *
 * @param {String} [customer_uri] Optional if this is a customer scoped instance. The URI originally passed back from Balanced after creating the customer.
 * @param {Object} data The data to update on the customer. There is currently an api bug that resets any fields you don't send to their defaults.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
customer.prototype.update = function (customer_uri, data, callback) {
    var self = this;

    if (arguments.length == 2) {
        callback = data;
        data = customer_uri;
        customer_uri = undefined;
    }

    if (validate.stringIsBlank(self.customer_uri)
        && !validate.parameterRequired(customer_uri, "customer_uri", callback)) return;
    if (!validate.parameterRequired(data, "data", callback)) return;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: customer_uri ? customer_uri : self.customer_uri,
        override_uri: true,
        method: "PUT",
        json: data
    }, callback);

}; // update

/**
 * Base implementation of 'destroy'. Destroys a customer by its URI.
 *
 * @param {String} [customer_uri] Optional if this is a customer scoped instance. The URI originally passed back from Balanced after creating the customer (customer.uri).
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
customer.prototype.destroy = function (customer_uri, callback) {
    var self = this;
    
    if (arguments.length == 1) {
        callback = customer_uri;
        customer_uri = undefined;
    }

    if (validate.stringIsBlank(self.customer_uri)
        && !validate.parameterRequired(customer_uri, "customer_uri", callback)) return;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: customer_uri ? customer_uri : self.customer_uri,
        override_uri: true,
        method: "DELETE"
    }, callback);

}; // delete

/**
 * Add a saved card to a customer.
 *
 * @param {String} [customer_uri] Optional if this is a customer scoped instance. The account URI originally passed back from Balanced after creating the customer.
 * @param {String} card_uri The URI originally passed back from Balanced after creating the card.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
customer.prototype.addCard = function (customer_uri, card_uri, callback) {
    var self = this;

    if (arguments.length == 2) {
        callback = card_uri;
        card_uri = customer_uri;
        customer_uri = undefined;
    }

    if (validate.stringIsBlank(self.customer_uri)
        && !validate.parameterRequired(customer_uri, "customer_uri", null)) return;
    if (!validate.parameterRequired(card_uri, "card_uri", null)) return;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: customer_uri ? customer_uri : self.customer_uri,
        override_uri: true,
        method: "PUT",
        json: {card_uri: card_uri}
    }, callback);

}; // addCard

/**
 * Adds a saved bank account to an customer.
 *
 * @param {String} [customer_uri] Optional if this is a customer scoped instance. The account URI originally passed back from Balanced after creating the customer.
 * @param {String} bank_account_uri The URI originally passed back from Balanced after creating the bank account.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
customer.prototype.addBankAccount = function (customer_uri, bank_account_uri, callback) {
    var self = this;

    if (arguments.length == 2) {
        callback = bank_account_uri;
        bank_account_uri = customer_uri;
        customer_uri = undefined;
    }

    if (validate.stringIsBlank(self.customer_uri)
        && !validate.parameterRequired(customer_uri, "customer_uri", null)) return;
    if (!validate.parameterRequired(bank_account_uri, "bank_account_uri", null)) return;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: customer_uri ? customer_uri : self.customer_uri,
        override_uri: true,
        method: "PUT",
        json: {bank_account_uri: bank_account_uri},
    }, callback);

}; // addBankAccount

/**
 * Get bank accounts saved to a customer.
 *
 * @param {String} [customer_uri] Optional if this is a customer scoped instance. The account URI originally passed back from Balanced after creating the customer.
 * @param {Function} [callback] The callback method to call upon completion or error.
 */
customer.prototype.getBankAccounts = function(customer_uri, callback) {
    var self = this;
    if (!validate.parameterRequired(customer_uri, "customer_uri", null)) return;

    utility.apiCall({
        marketplace_uri: self._marketplace_uri,
        secret: self._secret,
        uri: customer_uri + '/bank_accounts',
        method: "GET",
    }, callback)
};