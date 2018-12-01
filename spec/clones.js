const { toMoment } = require('../app/utils/datetime')

class Ride {
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

class Driver {
}

module.exports = {
  Ride,
  Driver,
}
