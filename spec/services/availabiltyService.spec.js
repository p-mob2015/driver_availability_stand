const moment = require('moment')

const { AvailabilityService } = require('../../app/services')
const { Ride, Driver } = require('../clones')
const focusTime = '2018-01-01 12:00:00'

describe('Availability Service', () => {
  let service

  beforeEach(() => {
    service = new AvailabilityService(focusTime)
  })

  describe('zeroFactor', () => {
    it('should return 0 when ride is cancelled because of car size', () => {
      const ride = {
        status: 'car_too_big',
      }

      expect(service.zeroFactor(ride)).toBe(0)
    })

    it('should return 1 when otherwise', () => {
      const ride = {
        status: 'other_values',
      }

      expect(service.zeroFactor(ride)).toBe(1)
    })
  })

  describe('downsizingFactor', () => {
    it('should return 0 when ride is successfully completed', () => {
      const ride = {
        momentCanceled: null,
      }

      expect(service.downsizingFactor(ride)).toBe(0)
    })

    it('should return non-zero values when ride is canceled', () => {
      const ride = {
        momentCanceled: 123232,
        status: 'any_status',
      }

      expect(service.downsizingFactor(ride)).toBeGreaterThan(0)
    })

    it('should return higher value when driver canceled the ride', () => {
      const rideDriver = {
        momentCanceled: 123232,
        status: 'driver_canceled',
      }
      const rideOperator = {
        momentCanceled: 123232,
        status: 'operator_canceled',
      }

      expect(service.downsizingFactor(rideDriver)).toBeGreaterThan(service.downsizingFactor(rideOperator))
    })
  })

  describe('ajacencyFactor', () => {
    let ride, rideOther
    beforeEach(() => {
      ride = new Ride()
      rideOther = new Ride()
    })

    it('should return 100 when ride is made on inquired time', () => {
      ride.timeAccepted = '2018-01-01 11:50:00'
      ride.timeCompleted = '2018-01-01 12:10:00'

      expect(service.ajacencyFactor(ride.scoreExtracts)).toBe(100)
    })

    it('should return 0 when inquired time is out of ajacency', () => {
      ride.timeAccepted = '2018-01-01 13:10:00'
      ride.timeCompleted = '2018-01-01 14:10:00'
      rideOther.timeAccepted = '2018-01-01 09:50:00'
      rideOther.timeCompleted = '2018-01-01 10:50:00'

      expect(service.ajacencyFactor(ride.scoreExtracts)).toBe(0)
      expect(service.ajacencyFactor(rideOther.scoreExtracts)).toBe(0)
    })
  })

  describe('getScore', () => {
    let driver, driverOther
    let ride, rideOther

    beforeEach(() => {
      driver = new Driver()
      driverOther = new Driver()
      ride = new Ride()
      rideOther = new Ride()

      driver.rides = [ride]
      driverOther.rides = [rideOther]
    })

    it('should return lower score for the driver who rode in farther time ajacency', () => {
      ride.timeAccepted = '2018-01-01 12:20:00'
      ride.timeCompleted = '2018-01-01 14:00:00'
      rideOther.timeAccepted = '2018-01-01 12:10:00'
      rideOther.timeCompleted = '2018-01-01 12:50:00'

      expect(service.getScore(driver)).toBeLessThan(service.getScore(driverOther))
    })

    it('should ignore date when calculating the score', () => {
      const otherService = new AvailabilityService('2018-01-03 12:00:00')
      ride.timeAccepted = '2018-01-01 12:20:00'
      ride.timeCompleted = '2018-01-01 14:00:00'

      expect(service.getScore(driver)).toBe(otherService.getScore(driver))
    })
  })
})
