module.exports = {
  name: 'customer',
  methods: {
    create: {
      path: 'customers',
      method: 'post'
    },
    list: {
      path: 'customers',
      method: 'get'
    },
    add_card: {
      path: 'customers/:customer_id',
      method: 'put',
      requires: [
        'card_uri'
      ]
    },
    add_bank: {
      path: 'customers/:customer_id',
      method: 'put',
      requires: [
        'bank_account_uri'
      ]
    },
    verify_bank: {
      path: 'bank_accounts/:bank_account_id/verifications',
      method: 'post'
    },
    confirm_bank_account: {
      path: 'bank_accounts/:bank_account_id/verifications/:verification_id',
      method: 'put',
      requires: [
        'amount_1',
        'amount_2'
      ]
    },
    delete_customer: {
      path: 'customers/:customers.create.id',
      method: 'delete'
    }
  }
}