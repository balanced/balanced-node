module.exports = {
  variable: 'credits',
  name: 'Credit Calls',
  functions: {
    credit_bank_account: {
      path: 'bank_accounts/:bank.create.id/credits',
      method: 'post',
      data: {
        amount: '10000'
      }
    }
  }
}