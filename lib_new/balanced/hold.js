module.exports = {
  variable: 'hold',
  methods: {
    create: {
      path: 'holds',
      method: 'post',
      required: [
        'source_uri'
      ]
    }
  }
}