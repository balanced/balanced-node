module.exports = {
  variable: 'cards',
  name: 'Credit Card Calls',
  functions: {
    create: {
      path: ':marketplace_uri/cards',
      method: 'post',
      data: {
        card_number: 5105105105105100,
        expiration_month: 12,
        expiration_year: 2020,
        security_code: 123
      }
    },
    list: {
      path: ':marketplace_uri/cards',
      method: 'get'
    },
    retreive: {
      path: ':marketplace_uri/cards/:cards.create.id',
      method: 'get'
    },
    update: {
      path: ':marketplace_uri/cards/:cards.create.id',
      method: 'put',
      data: {
        meta: {
          my_custom_id: '12345'
        }
      }
    }
  }
}