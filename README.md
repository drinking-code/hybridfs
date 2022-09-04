# hybridfs

Basically [`memfs`](https://github.com/streamich/memfs), but you can mount directories from the native nodejs
filesystem.  
Install with:

```shell
npm i drinking-code/hybridfs
```

Use like:

```js
import createHybridFs from 'hybridfs'

// create in-memory fs with "./node_modules" from the node:fs mounted to "/node_modules"
const hfs = createHybridFs([
    ['node_modules', '/node_modules']
])

hfs.writeFileSync('/foo', 'bar') // writes to the in-memory fs
console.log(
    hfs.readFileSync('/foo', 'utf8')
) // -> "bar"
```

Uses `memfs`' API ([Node's `fs` API](https://nodejs.org/api/fs.html)) for the file system.

## Reference

### `createHybridFs(rewrites: (string | [string, string])[])`

Create a hybrid file system. Accepts an array of mounts where one mount is either

- a string: "/foo" mounts "/foo" from the native filesystem to "/foo" in the in-memory filesystem; or
- an array of two strings: ["/foo", "/bar"] mounts "/foo" from the native filesystem to "/bar" in the in-memory
  filesystem.

Both types can be mixed in the array.

Returns a hybrid file system.
