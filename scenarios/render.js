var fs = require('fs');
var mu = require('mu2');
//var balanced = require('..');




var scenario = process.argv[process.argv.length-1];
console.log("Looking for scenario.cache", scenario);


var config = {
    api: "balanced", // the name of the api object to use
    user: "user",
    secret: "${ctx.api_key}",
	href: "${request['uri']}",
    // different uris to use
    uri: {
				customer: "${request.get('customer_href', request.get('payload', {}).get('customer'))}",
				bank_account: "${request.get('bank_account_href', request.get('bank_account_uri'))}",
				card: "${request['card_href']}",
				debit: "${request['debit_href']}",
				credit: "${request['credit_href']}",
                order: "${request['order_href']}",
                card_hold: "${request['card_hold_href']}"

        /*marketplace: "${ctx.marketplace_uri}",
        bankAccount: "${request['uri']}",
        card: "${request.get('uri', request.get('debits_uri',''))}",
        account: "${request['uri']}",
        debit: "${request['uri']}",
        hold: "${request.get('uri',  request.get('hold_uri', ''))}",
        credit: "${request['uri']}",
        refund: "${request['uri']}",
        event: "${request['uri']}",
        customer: "${request['uri']}",
        reversal: "${request['uri']}"
    */
		},

    json: {
        merchant: "${to_json( payload['merchant'] ) | n }",
        request: "${to_json( request['payload'] ) | n }"
    },

    name: "${payload['name'] if payload else request['bank_account']['name']}",

    routing_number: "${payload['routing_number'] if payload else request['bank_account']['routing_number']}",
    account_number: "${payload['account_number'] if payload else request['bank_account']['account_number']}",
    card: "${payload['card_number']}",

    amount: "${payload['amount'] if payload else request['amount'] or '1100'}",

    year: "${payload['expiration_year']}",
    month: "${payload['expiration_month']}",
    description: "${ payload.get('description') if 'payload' in locals() else request['payload']['description'] }",
    /*"${ if 'payload in locals():"
      +"  payload.get('description')"
      +"elif 'request' in locals():"
      +"  request['payload']['description']"
      +"else:"
      +"  ''}",*/
    //payload.get('description') if 'payload' in locals() el 'request' in locals()
    //"${payload.get('description') if 'payload' in locals() else request.get('payload',{}).get('description') if }",
    appears_on_statement_as: "${request['payload']['appears_on_statement_as']}"
};

// this config is used with the templates for when we are building the scenarios to run
var config_run = {
    api: "balanced", // the name of the api object to use
    user: "user",
    secret: "3c49b172ca1611e29e4e026ba7f8ec28",
    // different uris to use
    uri: {
        marketplace: "/v1/marketplaces/TEST-MP1Qgo2GJ01p1Unq365Gq8Hw",
        bankAccount: "/v1/bank_accounts/BA7MzJVqI9vsOl4FGqOowxg4",
        card: "/v1/marketplaces/TEST-MP7KGu1qSh88k1ka9w6FvXZu/cards/CCg1bA1f1o1PEdmOweZjxYy",
        account: "/v1/marketplaces/TEST-MP1Qgo2GJ01p1Unq365Gq8Hw/accounts/ACqnnofIf2xQlmUq12EZ7bh",
        debit: "/v1/marketplaces/TEST-MP6E3EVlPOsagSdcBNUXWBDQ/debits/WDEBPPEakDQzIE6T5YVjKC4",
        hold: "/v1/marketplaces/TEST-MP6E3EVlPOsagSdcBNUXWBDQ/holds/HLEEkOOAHJAU5SCfR5fi7TW",
        credit: "/v1/credits/CRtRb08dbRcgATb3rTMtXei",
        refund: "/v1/marketplaces/TEST-MP6E3EVlPOsagSdcBNUXWBDQ/refunds/RF1bNMx3J48PAiYNJMga00YE",
        event: "/v1/events/EVda9622507c9311e2b21f026ba7cac9da",
        customer: "/v1/customers/CU4Ge9p0xB21u0QcFv55rMHJ"
    },



    name: make_selection([ "Johann Bernoulli",
                           "Timmy Q. CopyPasta",
                           "George Washington",
                           "Alan Turing",
                           "Dennis Ritchie"
                         ]),
    routing_number: make_selection(["321174851", "122000030", "021000021"]),
    account_number: make_selection(["9900000001", "2345617845", "9473857386"]),
    card: make_selection(["4111111111111111", "341111111111111", "5105105105105100"]),

    amount: function () {
        return Math.random().toString().substring(2,4) + "00";
    },
    year: function () {
        return (new Date()).getFullYear() + 5 + Math.floor(10 * Math.random());
    },
    month: function () {
        return 1 + Math.floor(Math.random() * 12);
    },

    description: make_selection([ "Renting a bike",
                                  "Party Supplies",
                                  "Testing balanced"
                                ], true),
    appears_on_statement_as: "what up???"
};



function make_selection (arr, rand) {
    var index=0;
    return function () {
        return arr[rand ? Math.floor(arr.length * Math.random()) : index++ % arr.length];
    }
}



var directories = fs.readdirSync(__dirname);

// remove this file from the list
directories.splice(directories.indexOf('render.js'), 1);
directories.splice(directories.indexOf('preamble.js'), 1);

var preamble = "";
var preamble_run = ""

function process_save(dir,definition,request,runner) {
    var result =
        "% if mode == 'definition': \n"
        + definition + "\n"
        + "% else:\n"
        + preamble + "\n"
        + request.replace(/LOG/g, "/* . . . */") + "\n"
        + "% endif\n";
    var code =
        preamble_run + "\n"
        + "function run () { \n"
        + runner.replace(/LOG/g, "console.log(arguments);\n")
        + " \n }";
    fs.writeFile(__dirname+'/'+dir+'/node.mako', result, function(err) {
        if(err)
            console.log("failed to save "+dir);
        console.log(definition || request ? "Generating " : "Blank ", dir);
    });
    if(request)
        fs.writeFile(__dirname+'/'+dir+'/run.js', code, function(err) {
            if(err)
                console.log("failed to save "+dir);
        });
}

function process_request (dir, definition) {
    mu.compile(__dirname+'/'+dir+'/request.js', function(err, template) {
        var job = mu.render(template, config);
        var dd = "";
        job.on('data', function(d) {
            dd += d.toString();
        });
        job.on('end', function(request) {
            //process_save(dir, definition, dd);
            var job2 = mu.render(template, config_run);
            var rr = "";
            job2.on('data', function(d) { rr += d.toString(); });
            job2.on('end', function() {
                process_save(dir, definition, dd, rr);
            });
        });
    });
}

function process_dir(dir) {
    fs.readdir(__dirname+'/'+dir, function(err, contents) {
        if(err) return; // was not a directory

        if(contents.indexOf('node.mako')) {
            contents.splice(contents.indexOf('node.mako'), 1);
        }

        if(contents.indexOf('definition.js') != -1) {
            var dd = "";
            var job = mu.compileAndRender(__dirname+'/'+dir+'/definition.js', config);
            job.on('data', function(d) {
                dd += d.toString();
            });
            job.on('end', function(definition) {
                if(contents.indexOf('request.js') != -1) {
                    process_request(dir, dd);
                }else{
                    process_save(dir, dd, "", "");
                }
            });
        }else if(contents.indexOf('request.js') != -1) {
            process_request(dir, "", "");
        }else{
            process_save(dir, "", "", "");
        }
    });
}

function start_generate() {
    var preamble_job = mu.compileAndRender(__dirname + '/preamble.js', config);
    preamble_job.on('data', function(d) {
        preamble += d.toString();
    });

    preamble_job.on('end', function () {
        var preamble_job_run = mu.compileAndRender(__dirname + '/preamble-run.js', config_run);
        preamble_job_run.on('data', function(d) {
            preamble_run += d.toString();
        });
        preamble_job_run.on('end', function () {
            for(var at = 0; at < directories.length; at++) {
                process_dir(directories[at]);
            }
        });
    });
}


start_generate();
