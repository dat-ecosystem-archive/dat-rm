/* global DatArchive */

var rm = require('./')
var test = require('./node_modules/tape')

test('dir', async t => {
  var dat = await DatArchive.create()
  await dat.mkdir('subdir')
  await dat.writeFile('subdir/file.txt', '')

  await rm(dat, 'subdir')
  t.notOk(await exists(dat, 'subdir'))
  t.end()
})

test('glob', async t => {
  var dat = await DatArchive.create()
  var files = [
    'subdir/one.txt',
    'subdir/two.txt',
    'root.txt'
  ]

  await dat.mkdir('subdir')
  for await (var path of files) {
    await dat.writeFile(path, '')
  }

  await rm(dat, '**/*.txt', { prune: true })
  for await (var file of files) {
    t.notOk(await exists(dat, file), file)
  }
  t.end()

  window.close()
})

async function exists (dat, file) {
  try {
    await dat.stat(file)
    return true
  } catch (err) {
    return !err.notFound
  }
}
