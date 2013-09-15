module.exports = {
  name: 'hold',
  methods: {
    create: {
      path: 'holds',
      method: 'post'
    },
    list: {
      path: 'holds',
      method: 'get'
    },
    id: {
      path: 'holds/:hold_id',
      method: 'get'
    },
    update: {
      path: 'holds/:hold_id',
      method: 'put'
    },
    capture: {
      path: 'customers/:customer_id/debits',
      method: 'post',
      requires: [
        'hold_uri'
      ]
    },
    void: {
      path: 'holds/:hold_id',
      method: 'put',
      requires: [
        'is_void'
      ]
    }
  }
}