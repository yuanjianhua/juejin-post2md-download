'use strict'

const cacheManager = require('cache-manager')
const fsStore = require('cache-manager-fs-hash')

const diskCache = cacheManager.caching({
  store: fsStore,
  options: {
    path: 'diskcache', //path for cached files
    ttl: 60 * 60, //time to life in seconds
    subdirs: true, //create subdirectories to reduce the
    //files in a single dir (default: false)
    zip: true //zip files to save diskspace (default: false)
  }
})

module.exports = diskCache
