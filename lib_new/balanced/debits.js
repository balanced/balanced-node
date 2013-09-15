module.exports = {
  name: 'debits',
  methods: {
    id: {
      path: ':marketplace_uri/debits/:debit_id',
      method: 'get'
    },
    list: {
      path: ':marketplace_uri/debits',
      method: 'get'
    },
    update: {
      path: ':marketplace_uri/debits/:debit_id',
      method: 'put'
    }
  }
}