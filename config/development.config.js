module.exports = (ROOTPATH) => ({
  DB_SOURCE_PATH: `${ROOTPATH}/data/rideHistory.csv`,
  DB_FILE_PATH: `${ROOTPATH}/db/go2.sqlite`,
  DB_MIGRATION_PATH: `${ROOTPATH}/db/migrations/`,
})
