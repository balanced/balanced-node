module.exports = {
  variable: 'customers',
  name: 'Customer Calls',
  functions: {
    create: {
      module: 'customer',
      method: 'create',
      data: {
        name: 'Joe M Bob'
      }
    },
    list: {
      module: 'customer',
      method: 'list'
    },
    id: {
      module: 'customer',
      method: 'id',
      urlOptions: {
        customer_id: ':customers.create.id'
      }
    },
    add_card: {
      module: 'customer',
      method: 'add_card',
      data: {
        card_uri: ':cards.create.uri'
      },
      urlOptions: {
        customer_id: ':customers.create.id'
      }
    },
    add_bank: {
      module: 'customer',
      method: 'add_bank',
      data: {
        bank_account_uri: ':bank.create.uri'
      },
      urlOptions: {
        customer_id: ':customers.create.id'
      }
    },
    verify_bank: {
      module: 'bank_account',
      method: 'init_bank_account_verification',
      urlOptions: {
        bank_account_id: ':bank.create.id'
      }
    },
    confirm_bank_account: {
      module: 'bank_account',
      method: 'confirm_bank_account_verification',
      data: {
        amount_1: 1,
        amount_2: 1
      },
      urlOptions: {
        bank_account_id: ':bank.create.id',
        verification_id: ':customers.verify_bank.id'
      }
    }
  }
}