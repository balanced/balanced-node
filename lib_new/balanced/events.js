module.exports = {
  name: 'events',
  methods: {
    list: {
      path: 'events',
      method: 'get'
    },
    id: {
      path: 'events/:event_id',
      method: 'get'
    }
  }
}