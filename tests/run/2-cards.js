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
    }
  }
}