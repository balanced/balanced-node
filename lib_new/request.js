function Request(opts) {
  var extend = require('extend'),
      https  = require('https'),
      $scope = this,
      defaults = {
        secret: '',
        hostname: 'api.balancedpayments.com',
        api_version: '1',
        marketplace_uri: ''
      };
  
  $scope.requestOptions = extend(defaults, opts);
  
  $scope.request = function(path, method, data, callback) {
    var used_args = arguments;

    method = method.toLowerCase();
  
    if(method !== 'get') {
      var q = JSON.stringify(data);
      if(q === undefined) {
        q = '';
      }
    }
    
    if(path.substr(0, 3) !== '/v' + $scope.requestOptions.api_version) {
      path = '/v' + $scope.requestOptions.api_version + '/' + path;
    }
    
    if(method === 'get' && data) {
      var dataKeys = Object.keys(data);
      for(var i = 0; i < dataKeys.length; i++) {
        if(i === 0) {
          path += '?';
        } else {
          path += '&';
        }
        path += encodeURIComponent(dataKeys[i]) + '=' + encodeURIComponent(data[dataKeys[i]]);
      }
    }
    
    var opts = {
      host: $scope.requestOptions.hostname,
      path: path,
      method: method,
      port: 443,
      auth: $scope.requestOptions.secret + ':',
      headers: {
        'content-type': 'application/json',
        'accept': '*/*'
      }
    };
    
    if((method === 'post' || method === 'put') && q !== undefined) {
      opts.headers['content-length'] = q.length;
    }
    
    if(method === 'delete' || method === 'get') {
      opts.headers['content-length'] = 0;
    }
    
    var req = https.request(opts, function(sock) {
      var fullData = '';
      sock.setEncoding('utf-8');
      sock.on('data', function(chunk) {
        fullData += chunk;
      });
      
      sock.on('end', function() {
        try {
          if(fullData.length > 0) {
            var j = JSON.parse(fullData);
          }
        } catch(e) {
          return callback({
            error: e,
            message: 'Error on: [' + method + '] ' + path,
            details: fullData,
            arguments: used_args
          }, null);
        }
        
        if(typeof j === 'object') {
          if(j.status_code && j.status_code != 200) {
            j.arguments = used_args;
            return callback(j, null);
          }
        } else {
          j = {};
        }
        callback(null, j);
      });
    });
    
    req.on('error', function(e) {
      callback(e, null);
    });
    
    if(method === 'post' || method === 'put' || method === 'delete') {
      req.write(q, 'utf-8');
    }
    
    req.end();
  };
  
  return $scope;
}

module.exports = Request;