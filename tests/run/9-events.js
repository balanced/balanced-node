module.exports = {
  variable: 'events',
  name: 'Events Calls',
  functions: {
    list: {
      module: 'events',
      method: 'list'
    },
    id: {
      module: 'events',
      method: 'id',
      urlOptions: {
        event_id: ':events.list.items.0.id'
      }
    }
  }
}