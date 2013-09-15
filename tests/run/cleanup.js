module.exports = {
  variable: 'cleanup',
  name: 'Delete created items',
  functions: {
    delete_bank: {
      module: 'bank_account',
      method: 'delete',
      urlOptions: {
        bank_account_id: ':bank.create.id'
      }
    },
    delete_card: {
      module: 'card',
      method: 'delete',
      urlOptions: {
        card_id: ':cards.create.id'
      }
    },
    delete_customer: {
      module: 'customer',
      method: 'delete',
      urlOptions: {
        customer_id: ':customers.create.id'
      }
    }
  }
}