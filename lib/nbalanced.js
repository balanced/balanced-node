//===========================================================================
// FILE: nbalanced.js
//
// DESCRIPTION:
//    This file contains the nbalanced client for the Balanced Payments API
//
// HISTORY:
//    Created: 3/24/13 Chad Scharf
//===========================================================================
/**
 *
 * This module provides the client functionality for Balanced, https://www.balancedpayments.com/docs/api
 *  within node.js.
 *
 * @module nbalanced
 */

//
// Includes
//
var validate = require("./nbalanced/validate"),
account = require("./nbalanced/account"),
customer = require("./nbalanced/customer"),
card = require("./nbalanced/card"),
bankAccount = require("./nbalanced/bankAccount"),
credit = require("./nbalanced/credit"),
debit = require("./nbalanced/debit"),
hold = require("./nbalanced/hold"),
refund = require("./nbalanced/refund"),
event = require("./nbalanced/event");

/**
 * This is the module constructor for the nbalanced module
 *
 * @name nbalanced
 * @constructor nbalanced
 * @param {Object} options specifies the initialization options for the nbalanced class
 * @param {String} options.marketplace_uri the marketplace URI typically passed from the nbalanced init function
 * @param {String} options.secret the Balanced API key secret typically passed from the nbalanced init function
 */
var nbalanced = module.exports = function (options) {
    if (!validate.parameterRequired(options, "options", null)) return;
    if (!validate.requiredProperties(options, ["marketplace_uri", "secret"], null)) return;

    // Validate and assign the marketplace URI
    try {
	options.marketplace_uri = new RegExp("/v1/marketplaces/(\\w|-)+").exec(options.marketplace_uri)[0];
    }
    catch (e) {
	throw "Invalid marketplace uri '" + (options.marketplace_uri || "") + "'.";
    } // marketplace api catch

    // Set the API secret key and provide warning level validation
    try {
	if (/[0-9A-Fa-f]{32}/.exec(options.secret).length === 0) {
	    // Not important enough to throw an exception. We need to be flexible on the fact that this
	    //	implementation of secret key may change underneath the covers in the nbalanced API, so we
	    //	don't want to shoot ourselves in the foot by forcing this validation, just as a warning for now.
	    console.warn("Potentially invalid secret api key provided.");
	}
    }
    catch (e) {
    } // secret catch

    // Initialize each of the properties
    this.Accounts = new account(options);
    this.Customers = new customer(options);
    this.BankAccounts = new bankAccount(options);
    this.Cards = new card(options);
    this.Credits = new credit(options);
    this.Debits = new debit(options);
    this.Holds = new hold(options);
    this.Refunds = new refund(options);
    this.Events = new event(options);

}; // exports.nbalanced, nbalanced

/**
 * Creates an instance of nbalanced which is specific to the passed in account. It is optimal to pass this in from
 *  the result of a create, get or list request, however if the only property passed in is "id", this method will
 *  attempt to build the URIs based on the API rules (not recommended, per Balanced).
 *
 * @param {Object} account_data The account object that contains the information necessary for taking actions on a specific account.
 * @param {String} account_data.id The account id, this is required.
 * @param {String} [account_data.uri] The URI for the account itself.
 * @param {String} [account_data.bank_accounts_uri] The URI for accessing account bank accounts.
 * @param {String} [account_data.cards_uri] The URI for accessing account cards.
 * @param {String} [account_data.credits_uri] The URI for accessing account credits.
 * @param {String} [account_data.debits_uri] The URI for accessing account debits.
 * @param {String} [account_data.holds_uri] The URI for accessing account holds.
 * @param {String} [account_data.refunds_uri] The URI for accessing account refunds.
 */
account.prototype.balanced = account.prototype.nbalanced = function (account_data) {
    var self = this;
    if (!validate.parameterRequired(account_data, "account_data", null)) return null;
    if (!validate.requiredProperties(account_data, ["id"], null)) return null;

    var id = account_data.id;

    var options = {
	marketplace_uri: self._marketplace_uri,
	secret: self._secret,
	accounts_uri: self._action_uri,
	// Assign each account specific URI or build it from the id, even though it's not a good idea.
	account_uri: account_data.uri || (self._action_uri + "/" + id),
	bank_accounts_uri: account_data.bank_accounts_uri || (self._action_uri + "/" + id + "/bank_accounts"),
	cards_uri: account_data.cards_uri || (self._action_uri + "/" + id + "/cards"),
	credits_uri: account_data.credits_uri || (self._action_uri + "/" + id + "/credits"),
	debits_uri: account_data.debits_uri || (self._action_uri + "/" + id + "/debits"),
	holds_uri: account_data.holds_uri || (self._action_uri + "/" + id + "/holds"),
	refunds_uri: account_data.refunds_uri || (self._action_uri + "/" + id + "/refunds")
    };

    // Return a new nbalanced instance with our overridden options for calling account specific methods.
    return new nbalanced(options);

}; // nbalanced

/**
 * Creates an instance of nbalanced which is specific to the passed in customer. It is required to pass this in from
 *  the result of a create, get or list request.
 *
 * @param {Object} customer_data The customer object that contains the information necessary for taking actions on a specific account.
 * @param {String} customer_data.uri The customer uri, this is required.
 * @param {String} [customer_data.bank_accounts_uri] The URI for accessing customer bank accounts.
 * @param {String} [customer_data.cards_uri] The URI for accessing customer cards.
 * @param {String} [customer_data.credits_uri] The URI for accessing customer credits.
 * @param {String} [customer_data.debits_uri] The URI for accessing customer debits.
 * @param {String} [customer_data.holds_uri] The URI for accessing customer holds.
 * @param {String} [customer_data.refunds_uri] The URI for accessing customer refunds.
 * @param {String} [customer_data.transactions_uri] The URI for accessing customer transactions.
 * @param {String} [customer_data.source_uri] The URI for accessing the customer's default debit source.
 * @param {String} [customer_data.destination_uri] The URI for accessing the customer's default credit source.
 */
customer.prototype.balanced = customer.prototype.nbalanced = function (customer_data) {
    var self = this;
    if (!validate.parameterRequired(customer_data, "customer_data", null)) return null;
    if (!validate.requiredProperties(customer_data, ["id"], null)) return null;

    var id = customer_data.id,
    accounts_uri_prefix = "/accounts"; // hack until balanced updates the api

    var options = {
	marketplace_uri: self._marketplace_uri,
	secret: self._secret,
	customers_uri: self._action_uri,
	customer_uri: customer_data.uri || (self._action_uri + "/" + id),
	bank_accounts_uri: customer_data.bank_accounts_uri || (accounts_uri_prefix + "/" + id + "/bank_accounts"),
	cards_uri: customer_data.cards_uri || (accounts_uri_prefix + "/" + id + "/cards"),
	credits_uri: customer_data.credits_uri || (accounts_uri_prefix + "/" + id + "/credits"),
	debits_uri: customer_data.debits_uri || (accounts_uri_prefix + "/" + id + "/debits"),
	holds_uri: customer_data.holds_uri || (accounts_uri_prefix + "/" + id + "/holds"),
	refunds_uri: customer_data.refunds_uri || (accounts_uri_prefix + "/" + id + "/refunds"),
	transactions_uri: customer_data.transactions_uri || (accounts_uri_prefix + "/" + id + "/transactions"),
	source_uri: customer_data.source_uri,
	destination_uri: customer_data.destination_uri
    };

    // Return a new nbalanced instance with our overridden options for calling account specific methods.
    return new nbalanced(options);

}; // nbalanced


/**
 * Creates a test market for use in demos and tests.
 */
module.exports.MakeTestMarket = function(callback) {
    var https = require('https');
    var config = {};
    var request_params = {
	hostname: "api.balancedpayments.com",
	port: 443,
	path: "/v1/api_keys",
	method: "POST",
	headers: {
	    "content-type": "application/json",
	    "content-length": 0,
	    "accept": "*/*"
	}
    };
    var req = https.request(request_params, function(res) {
	var data = "";
	res.on('data', function(d) { data += d.toString(); });
	res.on('end', function () {
	    var json = JSON.parse(data)
	    config.secret = json.secret;
	    request_params.path = "/v1/marketplaces";
	    request_params.auth = config.secret +":";
	    var req2 = https.request(request_params, function(res) {
		var data = "";
		res.on('data', function(d) { data += d.toString(); });
		res.on('end', function() {
		    var json2 = JSON.parse(data);
		    config.marketplace_uri = json2.uri;
		    callback(null, config);
		});
	    });
	    req2.end("");
	});
    });
    req.end("");
}; // MakeTestMarket
