const moment = require('moment')

module.exports = {
  toMoment (time, toUtc = false) {
    if (!time) return null

    const absoluteTime = toUtc ? moment.utc(time) : moment(time)
    const dayStartTime = absoluteTime.clone().startOf('day')

    return absoluteTime.diff(dayStartTime, 'seconds')
  },
}
