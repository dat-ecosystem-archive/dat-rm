[![deprecated](http://badges.github.io/stability-badges/dist/deprecated.svg)](https://dat-ecosystem.org/) 

More info on active projects and modules at [dat-ecosystem.org](https://dat-ecosystem.org/) <img src="https://i.imgur.com/qZWlO1y.jpg" width="30" height="30" /> 

---

# dat-rm

Delete files from `dat` archives using glob patterns.

Supports both raw `hyperdrive` instances and Beaker Browser's `DatArchive` API. With [`scoped-fs`](https://github.com/pfrazee/scoped-fs) you can use it on your local file system as well.

## Installation

In [Beaker](https://beakerbrowser.com) or [Webrun](https://github.com/RangerMauve/webrun) you can import the module directly in your code:

```js
import rm from 'dat://brecht.pamphlets.me/lib/dat-rm/v1.1.js'
```

Note that it's advised to always use the `dat` protocol for this. HTTPS might be fine for testing, but I can't guarantee the required reliability and performance for production usage.

If you need `dat-rm` in Node.js, you can get it from NPM:

```sh
npm install dat-rm
```

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

## API

### rm(dat, pattern [, opts, callback])

#### dat

Type: `object` (required)

A `DatArchive`, `hyperdrive`, or `scoped-fs` instance.

#### pattern

Type: `string` or `Array` (required)

A glob (or list of globs) that describes the files to be removed from the archive.

#### opts.prune

Type: `boolean` (default: `false`)

Determines whether empty directories should be removed as well.

#### callback

Type `function`

Optional callback argument. If not provided, `rm` will return a promise.

## License

Apache-2.0
