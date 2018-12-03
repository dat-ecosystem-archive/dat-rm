/* global DatArchive */

var rm = require('./')
var test = require('./node_modules/tape')

test('directory', async t => {
  var dat = await DatArchive.create()
  await dat.mkdir('sub')
  await dat.mkdir('sub/subsub')
  await dat.writeFile('sub/subsub/file.txt', '')
  await rm(dat, 'nonexistent')

  rm(dat, 'sub', async err => {
    t.notOk(err)
    t.notOk(await exists(dat, 'sub/sub'))
    t.notOk(await exists(dat, 'sub'))
    t.end()
  })
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
})

test('array', async t => {
  var dat = await DatArchive.create()
  await dat.writeFile('ping.txt', '')
  await dat.writeFile('pong.md', '')

  await rm(dat, ['*.txt', '*.md'])
  t.notOk(await exists(dat, 'ping.txt'))
  t.notOk(await exists(dat, 'pong.md'))
  t.ok(await exists(dat, 'dat.json'))
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
