const sqlite = require('sqlite')
const logger = require('../app/logger')
const migrate = require('../db/migrate')
const seed = require('../db/seed')
const CONFIG = require('../config')
const action = process.argv[2]

async function init () {
  try {
    await migrate(CONFIG.DB_FILE_PATH, CONFIG.DB_MIGRATION_PATH)
    await seed(CONFIG.DB_SOURCE_PATH, CONFIG.DB_FILE_PATH)
  } catch (error) {
    logger.error({ message: 'DB Initialization failed', scope: 'db', error })
  }
}

switch (action) {
  case 'init':
    init()
    break;
  default:
    logger.warn(`Could not find the DB action <${action}>.`)
}
