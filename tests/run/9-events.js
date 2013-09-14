module.exports = {
  variable: 'events',
  name: 'Events Calls',
  functions: {
    list: {
      path: 'events',
      method: 'get'
    },
    id: {
      path: 'events/:events.list.items.0.id',
      method: 'get'
    }
  }
}