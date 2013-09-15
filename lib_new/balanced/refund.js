module.exports = {
  name: 'refund',
  methods: {
    list: {
      path: ':marketplace_uri/refunds',
      method: 'get',
    },
    id: {
      path: ':marketplace_uri/refunds/:refund_id',
      method: 'get'
    },
    update: {
      path: ':marketplace_uri/refunds/:refund_id',
      method: 'put'
    }
  }
}