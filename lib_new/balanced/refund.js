module.exports = {
  variable: 'refuns',
  methods: {
    create: {
      path: 'customers/:customer_id/refunds',
      method: 'post',
      required: [
        'debit_uri',
      ]
    }
  }
}