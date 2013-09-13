module.exports = {
  variable: 'bank',
  name: 'Bank Account Calls',
  functions: {
    create: {
      path: 'bank_accounts',
      method: 'post',
      data: {
        routing_number: '021000021',
        name: 'Joe M. Bob',
        account_number: '9900000002',
        type: 'checking'
      }
    },
    list: {
      path: 'bank_accounts',
      method: 'get',
      data: {
        limit: 10,
        offset: 0
      }
    },
    retreive: {
      path: 'bank_accounts/:bank.create.id',
      method: 'get'
    }
  }
}