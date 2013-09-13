module.exports = {
  name: 'card',
  methods: {
    create: {
      path: ':marketplace_uri/cards',
      method: 'post',
      requires: [
        'card_number',
        'expiration_month',
        'expiration_year',
        'security_code'
      ]
    },
    list: {
      path: ':marketplace_uri/cards',
      method: 'get'
    },
    id: {
      path: ':marketplace_uri/cards/:card_id',
      method: 'get'
    },
    update: {
      path: ':marketplace_uri/cards/:card_id',
      method: 'put'
    },
    delete: {
      path: ':marketplace_uri/cards/:card_id',
      method: 'delete'
    }
  }
}