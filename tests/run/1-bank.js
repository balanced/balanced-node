module.exports = {
  variable: 'bank',
  name: 'Bank Account Calls',
  functions: {
    create: {
      module: 'bank_account',
      method: 'create',
      data: {
        routing_number: '021000021',
        name: 'Joe M. Bob',
        account_number: '9900000002',
        type: 'checking'
      }
    },
    list: {
      module: 'bank_account',
      method: 'list',
      data: {
        limit: 10,
        offset: 0
      }
    },
    id: {
      module: 'bank_account',
      method: 'id',
      urlOptions: {
        bank_account_id: ':bank.create.id'
      }
    }
  }
}