module.exports = {
  variable: 'credits',
  name: 'Credit Calls',
  functions: {
    credit_bank_account: {
      module: 'credits',
      method: 'create',
      data: {
        amount: '10000'
      },
      urlOptions: {
        bank_account_id: ':bank.create.id'
      }
    }
  }
}