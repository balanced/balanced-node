module.exports = {
  name: 'bank_account',
  methods: {
    create: {
      path: 'bank_accounts',
      method: 'post',
      requires: [
        'routing_number',
        'name',
        'account_number',
        'type'
      ]
    },
    list: {
      path: 'bank_accounts',
      method: 'get'
    },
    id: {
      path: 'bank_accounts/:bank_account_id',
      method: 'get'
    },
    delete: {
      path: 'bank_accounts/:bank_account_id',
      method: 'delete'
    },
    list_credits: {
      path: 'bank_accounts/:bank_account_id/credits',
      method: 'get'
    },
    init_bank_account_verification: {
      path: 'bank_accounts/:bank_account_id/verifications',
      method: 'post'
    },
    list_bank_account_verifications: {
      path: 'bank_accounts/:bank_account_id/verifications',
      method: 'get'
    },
    get_bank_account_verification: {
      path: 'bank_accounts/:bank_account_id/verifications/:verification_id',
      method: 'get'
    },
    confirm_bank_account_verification: {
      path: 'bank_accounts/:bank_account_id/verifications/:verification_id',
      method: 'put',
      requires: [
        'amount_1',
        'amount_2'
      ]
    },
  }
}