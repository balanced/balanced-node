module.exports = {
  variable: 'customers',
  name: 'Customer Calls',
  functions: {
    create: {
      path: 'customers',
      method: 'post',
      data: {
        name: 'Joe M Bob'
      }
    },
    list: {
      path: 'customers',
      method: 'get'
    },
    add_card: {
      path: 'customers/:customers.create.id',
      method: 'put',
      data: {
        card_uri: ':cards.create.uri'
      }
    },
    add_bank: {
      path: 'customers/:customers.create.id',
      method: 'put',
      data: {
        bank_account_uri: ':bank.create.uri'
      }
    },
    verify_bank: {
      path: 'bank_accounts/:bank.create.id/verifications',
      method: 'post'
    },
    confirm_bank_account: {
      path: 'bank_accounts/:bank.create.id/verifications/:customers.verify_bank.id',
      method: 'put',
      data: {
        amount_1: 1,
        amount_2: 1
      }
    }
  }
}