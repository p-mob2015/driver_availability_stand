const Store = require('openrecord/store/sqlite3')
const { toMoment } = require('../utils/datetime')

/**
 * Ride model
 */
class Ride extends Store.BaseModel {
  /**
   * Extract only useful values for score calculation
   * @return {Object}
   */
  get scoreExtracts () {
    const {
      timeRequested,
      timeAccepted,
      timeArriving,
      timeInProgress,
      timeCompleted,
      timeCanceled,
      status,
    } = this

    return {
      status,
      momentRequested: toMoment(timeRequested),
      momentAccepted: toMoment(timeAccepted),
      momentArriving: toMoment(timeArriving),
      momentInProgress: toMoment(timeInProgress),
      momentCompleted: toMoment(timeCompleted),
      momentCanceled: toMoment(timeCanceled),
    }
  }
}

module.exports = Ride
