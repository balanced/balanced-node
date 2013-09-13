module.exports = {
  variable: 'customers',
  name: 'Customer Calls',
  functions: {
    create: {
      path: 'customers',
      method: 'post',
      data: {
        name: 'Joe M Bob'
      }
    }
  }
}