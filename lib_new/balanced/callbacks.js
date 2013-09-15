module.exports = {
  name: 'callbacks',
  methods: {
    list: {
      path: 'callbacks',
      method: 'get'
    },
    id: {
      path: 'callbacks/:callback_id',
      method: 'get'
    },
    create: {
      path: 'callbacks',
      method: 'post',
      requires: [
        'url'
      ]
    },
    update: {
      path: 'callbacks/:callback_id',
      method: 'put',
      requires: [
        'url'
      ]
    },
    delete: {
      path: 'callbacks/:callback_id',
      method: 'delete'
    }
  }
}