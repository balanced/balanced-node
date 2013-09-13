module.exports = {
  variable: 'cleanup',
  name: 'Delete created items',
  functions: {
    delete_bank: {
      path: 'bank_accounts/:bank.create.id',
      method: 'delete'
    },
    delete_card: {
      path: ':marketplace_uri/cards/:cards.create.id',
      method: 'delete'
    },
    delete_customer: {
      path: 'customers/:customers.create.id',
      method: 'delete'
    }
  }
}