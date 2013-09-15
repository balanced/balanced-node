module.exports = {
  variable: 'refunds',
  name: 'Refund Calls',
  functions: {
    create: {
      module: 'customer',
      method: 'add_refund',
      data: {
        debit_uri: ':debits.customer_debit.uri',
        description: 'A more descriptive response about this refund'
      },
      urlOptions: {
        customer_id: ':customers.create.id'
      }
    }
  }
}