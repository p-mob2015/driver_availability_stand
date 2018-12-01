const readline = require('readline')
const moment = require('moment')
const logger = require('../app/logger')

const { rideStore } = require('../app/stores')
const { AvailabilityService } = require('../app/services')
const Driver = require('../app/models/driver')

// Initiate logging session
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
const scoreService = initSession()

/**
 * Get availability score of the driver (async)
 * @param  {String} driverId
 * @return {Promise}
 */
async function getAvailabilityScore(driverId) {
  try {
    await rideStore.ready()
    const driver = await Driver.find(driverId).include('rides')

    if (!driver) {
      logger.error({ message: 'Driver not found', scope: 'score', id: driverId })
    } else {
      logger.info(scoreService.getScore(driver))
    }
    initInquiry()
  } catch (error) {
    logger.error({ message: 'Error occurred while accessing the DB', scope: 'db', error })
  }
}

// Initiate a new interactive UI for driver ID acceptance
function initInquiry () {
  rl.question('Driver ID to inquire: ', (driverId) => {
    if (driverId === 'exit') {
      gracefulExit()
    } else {
      getAvailabilityScore(driverId, {})
    }    
  })
}

/**
 * Initializes a new inquiry session
 * @return {AvailabilityService}
 */
function initSession () {
  const time = process.argv[2]

  if (!time || !moment.utc(time).isValid()) {
    logger.warn('Please enter the valid time')
    gracefulExit()
    return null
  }

  logger.info('Type \'exit\' to end the session.')
  initInquiry()
  return new AvailabilityService(time)
}

// Handles db connection & process termination
function gracefulExit () {
  rideStore.close(() => {
    logger.info('Closed DB connection.')
    process.exit(0)
  })
}

process.on('SIGINT', gracefulExit)
