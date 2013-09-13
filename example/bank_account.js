var balanced = require('../lib_new/balanced'),
    config   = require('./definitions');

balanced.init(config.secret, config.marketplace_uri);

// Invalid Test
balanced.bank_account.create({
  account_number: '8887776665555',
  routing_number: '100000007',
  name: 'Landon Williams',
  type: 'checking'
}, function(err, res) {
  if(err) {
    return console.log(err);
  }
  
  console.log(res);
});

// Valid Test
balanced.bank_account.create({
  account_number: '9900000002',
  routing_number: '021000021',
  name: 'Landon Williams',
  type: 'checking'
}, function(err, res) {
  if(err) {
    return console.log(err);
  }
  
  console.log(res);
  // Now get an account by ID
  balanced.bank_account.id({id: res.id}, function(err, res2) {
    if(err) {
      return console.log(err);
    }
    
    console.log(res);
  });
});