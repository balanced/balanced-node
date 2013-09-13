module.exports = {
  variable: 'debits',
  name: 'Debit Calls',
  functions: {
    customer_debit: {
      path: 'customers/:customers.create.id/debits',
      method: 'post',
      data: {
        appears_on_statement_as: 'A transaction',
        amount: 500,
        description: 'A more descriptive response about this transaction'
      }
    }
  }
}