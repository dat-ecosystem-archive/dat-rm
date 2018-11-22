# dat-rm

Delete files from `dat` archives using glob patterns.

Supports both raw `hyperdrive` instances and Beaker Browser's `DatArchive` API.

## Usage

```js
var rm = require('dat-rm')

async function main () {
  var dat = await DatArchive.load(key)

  // delete all Markdown files in the archive
  await rm(dat, '**/*.md')
  // delete all jpg images and prune any directories left empty
  await rm(dat, '**/*.jpg', { prune: true })
  // delete entire subdirectory, including its contents
  await rm(dat, 'subdir')
}

main()

// Instead of using `await`, you can pass in a callback too
var hyperdrive = require('hyperdrive')
var rm = require('dat-rm')

var dat = hyperdrive(key)

rm(dat, 'subdir', function (err) {
  if (err) console.error(err)
  else console.info('done!')
})
```

## License

Apache-2.0
