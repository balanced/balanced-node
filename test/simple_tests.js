var tests = {};
/*
  fun: function to run this test
  deps: what this function depends on to run
  required: what is depending on this test to run
  running: bool if this test has been started
  finish: bool
  result: the result from running this test
  errors: [] // only if
*/

var running_test = 0;

function get_deps(fun) {
    var r = /function\s*[^\(]*\(([^\)]*)\)/;
    var data = r.exec(fun.toString());
    var list = data[1].split(',');
    for(var a = 0; a < list.length; a++) {
	list[a] = list[a].trim();
	if(list[a] == '')
	    list.splice(a--, 1);
    }
    return list;
}


module.exports = function test (name, fun) {
    if(!tests[name])
	tests[name] = {};
    var deps = get_deps(fun);
    tests[name].fun = fun;
    tests[name].deps = deps;
    tests[name].running = false;
    tests[name].finish = false;
    tests[name].required = tests[name].required || [];
    tests[name].errors = [];
};

function run(name) {
    var self = tests[name];
    if(self.running == true) return;
    var can_run = true;
    var args = [];
    //console.log('>> running: ', name);
    for(var a=0; a < self.deps.length; a++) {
	if(tests[self.deps[a]].finish) {
	    args.push(tests[self.deps[a]].result);
	}else{
	    can_run = false;
	    tests[self.deps[a]].required.push(name);
	    run(self.deps[a]);
	}
    }
    if(!can_run) return; // can not run this test yet
    function finish(result){
	if(self.finish)
	    throw new Error("Called finish on a test "+name+" twice");
	self.result = result;
	self.finish = true;
	for(var a=0; a < self.required.length; a++) {
	    run(self.required[a]);
	}
	running_test--;
	print_results();
    }
    finish.assert = function(is_true, do_throw) {
	// only check if the asserted value is true
	if(!is_true) {
	    var e = new Error("Assert error, test: "+ name);
	    self.errors.push(e);
	    if(do_throw === true) throw e;
	}
    };
    running_test++;
    self.running = true;
    console.log('Running test:', name);
    try {
	var rets = self.fun.apply(finish, args);
	if (rets && typeof rets.then == 'function') {
	    rets.then(function(val) {
		finish(val);
	    }, function(err) {
		self.errors.push(err)
		//finish(err);
	    });
	}
    } catch(e) {
	self.errors.push(e);
    }

}

function print_results () {
    var exit_code = 0;
    if(running_test == 0) {
	console.error("=======================");
	console.error(" COMPLTED SIMPLE TESTS ");
	console.error("=======================");
	// print skipped
	for(var name in tests) {
	    if(tests[name].running == false) {
		console.error("Skipped:", name);
	    }
	}
	// print passed
	for(var name in tests) {
	    if(tests[name].finish == true && tests[name].errors.length == 0) {
		console.error("Passed:", name);
	    }
	}
	// print failled to callback
	for(var name in tests) {
	    if(tests[name].running == true && tests[name].finish == false) {
		console.error("Failed to callback:", name);
	    }
	}
	// print failed
	for(var name in tests) {
	    if(tests[name].errors.length != 0) {
		console.error("Failed:", name);
		var err = tests[name].errors;
		for(var a=0; a < err.length; a++) {
		    console.error(err[a].toString(), err[a].stack);
		}
		exit_code++;
	    }
	}
	process.exit(exit_code);
    }
}

process.on('exit', function (){
    if(running_test) {
	running_test = 0;
	print_results();
    }
});





var startTimeout = setTimeout(start, 100);
function start () {
    clearTimeout(startTimeout);
    // check if there are tests listed in the args otherwise run everything
    var all_tests = true;
    for(var a = 2; a < process.argv.length; a++) {
	if(process.argv[a] in tests) {
	    all_tests = false;
	    run(process.argv[a]);
	}
    }
    if(all_tests) {
	// just run all the tests
	for(var name in tests) {
	    run(name);
	}
    }
}

module.exports.start = start;
