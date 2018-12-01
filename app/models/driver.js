const Store = require('openrecord/store/sqlite3')

/**
 * Driver model
 */
class Driver extends Store.BaseModel {
  static definition () {
    // defines association with the Ride model
    this.hasMany('rides', { to: 'driverId' })
  }
}

module.exports = Driver
