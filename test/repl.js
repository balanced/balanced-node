balanced = require('../');
var repl = require('repl');

var r = repl.start("balanced> ");

r.context.balanced = balanced;

function dump(err, value) {
    console.log('dump '+dump.len+' recieved');
		dump.last = dump[dump.len++] = err || value;
}

dump.len = 0;

r.context.dump = dump;

balanced.api_key.create().then(function (obj) {
    balanced.configure(obj.secret);
    r.context.marketplace = marketplace = balanced.marketplace;
});
