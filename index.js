var { dirname, join } = require('path')
var box = require('callbox')
var flush = require('flush-write-stream')
var glob = require('dat-glob/stream')
var isGlob = require('is-glob')
var pump = require('pump')

module.exports = remove

async function remove (dat, pattern, opts) {
  opts = opts || {}

  if (!isGlob(pattern)) {
    var stats = await stat(dat, pattern)
    if (stats.isDirectory()) {
      return remove(dat, join(pattern, '**/*'), { prune: true })
    } else {
      return unlink(dat, pattern)
    }
  }

  return box(done => {
    var stream = glob(dat, pattern)
    var rm = flush(async function (file, enc, next) {
      await unlink(dat, file)
      if (opts.prune) {
        try {
          await rmdir(dat, dirname(file.toString()))
        } catch (err) {
          if (!err.destDirectoryNotEmpty) throw err
        }
      }
      next()
    })

    pump(stream, rm, done)
  })
}

function stat (dat, path) {
  var lstat = dat.lstat ? dat.lstat.bind(dat) : dat.stat.bind(dat)
  if (lstat.constructor.name === 'AsyncFunction') {
    return lstat(path)
  }
  return box(done => lstat(path, done))
}

function rmdir (dat, path) {
  if (path === '.') return
  if (dat.rmdir.constructor.name === 'AsyncFunction') {
    return dat.rmdir(path)
  }
  return box(done => dat.rmdir(path, done))
}

function unlink (dat, path) {
  if (dat.unlink.constructor.name === 'AsyncFunction') {
    return dat.unlink(path)
  }
  return box(done => dat.unlink(path, done))
}
