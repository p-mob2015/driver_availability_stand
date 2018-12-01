const { toMoment } = require('../utils/datetime')
const { reverseProportionalPercentage } = require('../utils/math')

/**
 * Service for availability score calculation of drivers
 * @property {DateTime/String} time the time for which the scores are to be calculated
 * @property {Number} ajacencyHours scope of lower/upper time span for ajacency percentage calculation
 */
class AvailabilityService {
  constructor (time, ajacencyHours = 1) {
    this.moment = toMoment(time, true)
    this.ajacencyHours = 1

    this.ajacencyFactor = this.ajacencyFactor.bind(this)
    this.getRideScore = this.getRideScore.bind(this)
  }

  /**
   * 1/0 factor for score calculation
   * 0 : no need to proceed with score calculation, score is zero
   * 1 : proceed with score calculation
   * @param  {Object} ride
   * @return {Number}
   */
  zeroFactor (ride) {
    return ride.status === 'car_too_big' ? 0 : 1
  }

  /**
   * Downsizing factor caused by the cancellation
   * @param  {Object} ride
   * @return {Number}              the bigger, the more downsizing
   */
  downsizingFactor (ride) {
    const { status, momentCanceled } = ride

    if (!momentCanceled) return 0

    switch (status) {
      case 'driver_canceled':
        return 0.4
      case 'operator_canceled':
        return 0.2
      default:
        return 0.1
    }
  }

  /**
   * Ajacency factor for the given availability time-span
   * @param  {Object} ride
   * @return {Number}                 [description]
   */
  ajacencyFactor (ride) {
    const ajacencySeconds = this.ajacencyHours * 3600
    const { momentAccepted, momentCompleted } = ride

    if (!momentAccepted && !momentCompleted) return 0

    const startMoment = Math.min(momentAccepted, momentCompleted || momentAccepted)
    const endMoment = Math.max(momentAccepted, momentCompleted || momentAccepted)

    if (this.moment >= startMoment && this.moment <= endMoment) {
      return 100
    } else if (this.moment < startMoment) {
      return reverseProportionalPercentage(ajacencySeconds, startMoment - this.moment)
    } else {
      return reverseProportionalPercentage(ajacencySeconds, this.moment - endMoment)
    }
  }

  /**
   * Score for a ride
   * @param  {Ride} ride
   * @return {Number}
   */
  getRideScore (ride) {
    const scoreAttrs = ride.scoreExtracts

    return this.zeroFactor(scoreAttrs) * this.ajacencyFactor(scoreAttrs) * (1 - this.downsizingFactor(scoreAttrs))
  }

  /**
   * Score for a drive
   * @param  {Driver} driver
   * @return {Number}        Availability score of the driver
   */
  getScore (driver) {
    if (driver.rides.length === 0) return 0

    const sumScores = driver.rides.reduce((sum, ride) => sum + this.getRideScore(ride), 0)
    return sumScores / driver.rides.length
  }
}

module.exports = AvailabilityService
