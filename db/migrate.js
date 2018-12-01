const sqlite = require('sqlite')
const logger = require('../app/logger')

async function migrate (dbPath, migrationsPath) {
  try {
    const db = await sqlite.open(dbPath, { Promise })
    await db.migrate({
      force: false,
      migrationsPath,
    })

    await db.close()
    logger.info('Migration successful.')
  } catch (error) {
    logger.error({ message: 'There was an error migrating the database.', scope: 'db', error })
    throw(error)
  }
}

module.exports = migrate
