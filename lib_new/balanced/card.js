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
    retreive: {
      path: ':marketplace_uri/cards/:id',
      method: 'get'
    },
    update: {
      path: ':marketplace_uri/cards/:id',
      method: 'put'
    },
    delete_card: {
      path: ':marketplace_uri/cards/:cards.create.id',
      method: 'delete'
    }
  }
}