const sqlite = require('sqlite')
const fs = require('fs')
const PapaParse = require('papaparse')
const logger = require('../app/logger')

/**
 * Parse CSV file to valid JS object (async)
 * @param  {String} sourcePath
 * @return {Promise}
 */
function parseSource (sourcePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createReadStream(sourcePath)

    PapaParse.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    })
  })
}

/**
 * Transform 'NULL' strings to null vaue
 * @param  {Object} data
 * @return {Object}
 */
function nullify (data) {
  return data.map((ride) => {
    return Object.keys(ride)
            .reduce((obj, key) => {
              obj[key] = ride[key] === 'NULL' ? null : ride[key]
              return obj
            }, {})
  })
}

/**
 * Extract Driver and Ride records from the CSV-parsed data
 * @param  {Object} data
 * @return {Object}      has 'drivers' and 'rides' arrays as props
 */
function extractEntities (data) {
  const drivers = {}
  const rides = []

  for (let i=0; i<data.length; i++) {
    const {
      id,
      driverId,
      driverName,
      driverPhone,
      driverPlate,
      createdAt,
      timeAccepted,
      timeArriving,
      timeInProgress,
      timeCompleted,
      timeCanceled,
      status,
    } = data[i]

    if (!driverId || !createdAt) continue
    if (!drivers[driverId]) {
      drivers[driverId] = {
        id: driverId,
        name: driverName,
        phone: driverPhone ? `${driverPhone}` : null,
        plate: driverPlate,
      }
    }

    rides.push({
      id,
      timeRequested: createdAt,
      timeAccepted,
      timeArriving,
      timeInProgress,
      timeCompleted,
      timeCanceled,
      status,
      driverId,
    })
  }

  return {
    drivers: Object.values(drivers),
    rides,
  }
}

async function seed (sourcePath, dbPath) {
  try {
    const data = await parseSource(sourcePath)
    const db = await sqlite.open(dbPath, { Promise })
    const { drivers, rides } = extractEntities(nullify(data))

    // Clean up the DB from the previous status
    await db.exec('DELETE FROM Rides; DELETE FROM Drivers')

    // Seed drivers
    for (let i=0; i<drivers.length; i++) {
      const { id, name, phone, plate } = drivers[i]

      await db.run('INSERT INTO Drivers (id, name, phone, plate) VALUES (?, ?, ?, ?)', [
        id, name, phone, plate
      ])
    }

    // Seed rides
    for (let i=0; i<rides.length; i++) {
      const {
        id,
        timeRequested,
        timeAccepted,
        timeArriving,
        timeInProgress,
        timeCompleted,
        timeCanceled,
        status,
        driverId,
      } = rides[i]

      await db.run('INSERT INTO Rides (id, timeRequested, timeAccepted, timeArriving, timeInProgress, timeCompleted, timeCanceled, status, driverId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
        id, timeRequested, timeAccepted, timeArriving, timeInProgress, timeCompleted, timeCanceled, status, driverId
      ])
    }

    await db.close()
    logger.info('Seeding successful.')
  } catch (error) {
    logger.error({ message: 'There was an error seeding the database.', scope: 'db', error })
    throw(error)
  }
}

module.exports = seed
