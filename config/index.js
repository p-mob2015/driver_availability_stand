const path = require('path')
const util = require('util')
const commons = require('./config')

const rootPath  = path.normalize(__dirname + '/..')
const env       = process.env.NODE_ENV || 'development'

const config    = require(__dirname + util.format('/%s.config.js', env) )(rootPath)

module.exports = {
  ...commons,
  ...config,
}

