module.exports = {
  variable: 'holds',
  name: 'Hold Calls',
  functions: {
    create: {
      module: 'hold',
      method: 'create',
      data: {
        source_uri: ':cards.create.uri',
        amount: 500,
        description: 'A more descriptive response about this hold'
      }
    }
  }
}