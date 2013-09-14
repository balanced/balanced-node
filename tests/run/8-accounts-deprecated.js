module.exports = {
  variable: 'accounts',
  name: 'Accounts Calls',
  functions: {
    create: {
      path: ':marketplace_uri/accounts',
      method: 'post',
      data: {
        name: 'John Doe',
      }
    },
    add_card: {
      path: ':marketplace_uri/accounts/:accounts.create.id',
      method: 'post',
      data: {
        card_uri: ':cards.create.uri'
      }
    },
    add_bank: {
      path: ':marketplace_uri/accounts/:accounts.create.id',
      method: 'put',
      data: {
        bank_account_uri: ':bank.create.uri'
      }
    },
    underwrite_person: {
      path: ':marketplace_uri/accounts',
      method: 'post',
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
    },
    underwrite_business: {
      path: ':marketplace_uri/accounts',
      method: 'post',
      data: {
        merchant: {
          phone_number: '+14089999999',
          name: 'Skripts4Kids',
          postal_code: '91111',
          type: 'business',
          street_address: '555 VoidMain Road',
          tax_id: 211111111,
          person: {
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
}