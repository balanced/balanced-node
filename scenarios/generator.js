var //test      = require('../tests/run'),
    scenarios = require('./scenarios'),
    fs        = require('fs'),
    mu2       = require('mu2');
    
function buildScenarios() {
  console.log('\n\nBuilding Scenarios\n\n');
  var sKeys = Object.keys(scenarios);
  for(var i = 0; i < sKeys.length; i++) {
    if(!scenarios[sKeys[i]].definition) {
      continue;
    }
    console.log(sKeys[i]);
    var dir = __dirname + '/' + sKeys[i];
    if(!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    } else {
      var files = [];
      if( fs.existsSync(dir) ) {
        files = fs.readdirSync(dir);
        files.forEach(function(file, index){
          var curPath = dir + "/" + file;
          fs.unlinkSync(curPath);
        });
      }
    }
  }
}
  
/*  
function testLoaded() {
  if(test.complete !== true) {
    setTimeout(function(){
      testLoaded();
    }, 500);
    return;
  }
  
  // We load the tests for some sample data to use.
  buildScenarios();
}
*/

//test.noLog = true;
//test.noDelete = true;
buildScenarios();