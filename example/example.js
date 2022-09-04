import createHybridFs from '../lib/'

const hfs = createHybridFs([
    ['node_modules', '/node_modules']
])

console.log(
    hfs.readdirSync('/node_modules').slice(0, 4)
) // -> first 4 entries in this node_modules


hfs.writeFileSync('/foo', 'bar') // writes to the in-memory fs
console.log(
    hfs.readFileSync('/foo', 'utf8')
) // -> "bar"
