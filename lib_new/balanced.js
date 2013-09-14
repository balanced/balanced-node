function balanced() {
  var Request = require('./request'),
      fs      = require('fs'),
      moduleDir = '/balanced'
      $scope  = this;
     
  $scope.requestOptions = {
    secret: '',
    hostname: 'api.balancedpayments.com',
    api_version: '1',
    marketplace_uri: ''
  };

  $scope.init = function(secret, marketplace_uri, api_version) {
    $scope.marketplace = makeMethods(require('./balanced/marketplace'));
    $scope.bank_account = makeMethods(require('./balanced/bank_account'));
    $scope.card = makeMethods(require('./balanced/card'));
    $scope.credits = makeMethods(require('./balanced/credits'));
    $scope.customer = makeMethods(require('./balanced/customer'));
    $scope.hold = makeMethods(require('./balanced/hold'));
    $scope.refund = makeMethods(require('./balanced/refund'));
    $scope.account = makeMethods(require('./balanced/account'));
    
    $scope.requestOptions.secret = secret;
    if(typeof api_version !== 'undefined') {
      $scope.requestOptions.api_version = api_version;
    }
    if(typeof marketplace_uri !== 'undefined') {
      $scope.requestOptions.marketplace_uri = marketplace_uri;
    } else {
      throw new Error("marketplace_uri is required");
    }
  }
  
  /*
   *
   * Function to create API methods.
   *
   */
  function makeMethods(json) {
    scope = {};
    var method_keys = Object.keys(json.methods);
    for(var i = 0; i < method_keys.length; i++) {
      var m = json.methods[method_keys[i]];
      scope[method_keys[i]] = createModuleMethod(m, method_keys[i], json);
    }
    return scope;
  }
  
  function createModuleMethod(data, name, json) {
    function _makeCall(options, urlOptions, callback) {
      if(arguments.length === 1) {
        callback = options;
        options = undefined;
        urlOptions = undefined;
      }
      if(arguments.length === 2) {
        callback = urlOptions;
        urlOptions = options;
      }
      
      var check = checkRequiredFields(data.requires, options, json, name);
      if(check.error === true) {
        return callback(check, null);
      }
      
      if(urlOptions) {
        urlOptions.marketplace_uri = $scope.requestOptions.marketplace_uri;
        var pathPieces = data.path.split('/');
        for(var i = 0; i < pathPieces.length; i++) {
          if(pathPieces[i].indexOf(':') >= 0) {
            var variablePieces = pathPieces[i].substr(1).split('.');
            var newVar = urlOptions;
            for(var j = 0; j < variablePieces.length; j++) {
              newVar = newVar[variablePieces[j]];
            }
            pathPieces[i] = newVar;
            data.path = pathPieces.join('/');
          }
        }
      }
      
      new Request($scope.requestOptions).request(data.path, data.method, options, function(err, result) {
        callback(err, result);
      });
    }
    
    return _makeCall;
  }
  
  function checkRequiredFields(required, desired, data, method_name) {
    var ret = {
      error: true,
      message: ''
    };
    if(!required || required.length <= 0) {
      ret.error = false;
      return ret;
    }
    for(var i = 0; i < required.length; i++) {
      if(typeof desired[required[i]] === 'undefined') {
        ret.message = '[' + data.name + '.' + method_name + '] Missing: ' + required[i];
        return ret;
      }
    }
    
    ret.error = false;
    return ret;
  }

  return $scope;
}

module.exports = balanced();