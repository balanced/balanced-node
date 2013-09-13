module.exports = {
  variable: 'refunds',
  name: 'Refund Calls',
  functions: {
    create: {
      path: 'customers/:customers.create.id/refunds',
      method: 'post',
      data: {
        debit_uri: ':debits.customer_debit.uri',
        description: 'A more descriptive response about this refund'
      }
    }
  }
}