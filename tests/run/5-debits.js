module.exports = {
  variable: 'debits',
  name: 'Debit Calls',
  functions: {
    customer_debit: {
      module: 'customer',
      method: 'add_debit',
      data: {
        appears_on_statement_as: 'A transaction',
        amount: 500,
        description: 'A more descriptive response about this transaction'
      },
      urlOptions: {
        customer_id: ':customers.create.id'
      }
    }
  }
}