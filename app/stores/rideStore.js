const Store = require('openrecord/store/sqlite3')
const CONFIG = require('../../config')

const store = new Store({
  file: CONFIG.DB_FILE_PATH,
  models: [
    require('../models/driver'),
    require('../models/ride'),
  ]
})

module.exports = store
