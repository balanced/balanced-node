module.exports = {
  variable: 'accounts',
  name: 'Accounts Calls',
  functions: {
    create: {
      module: 'account',
      method: 'create',
      data: {
        name: 'John Doe',
      }
    },
    add_card: {
      module: 'account',
      method: 'add_card',
      data: {
        card_uri: ':cards.create.uri'
      },
      urlOptions: {
        account_id: ':accounts.create.id'
      }
    },
    add_bank: {
      module: 'account',
      method: 'add_bank',
      data: {
        bank_account_uri: ':bank.create.uri'
      },
      urlOptions: {
        account_id: ':accounts.create.id'
      }
    },
    add_underwriter: {
      module: 'account',
      method: 'add_underwriter',
      data: {
        merchant: {
          phone_number: '+14089999999',
          name: 'Timmy Q. CopyPasta',
          dob: '1989-12',
          postal_code: '94110',
          type: 'person',
          street_address: '121 Skriptkid Row'
        }
      }
    }
  }
}