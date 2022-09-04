import {ufs} from 'unionfs'
import {IFS} from 'unionfs/lib/fs'
import {createFsFromVolume, Volume} from 'memfs'

import mountFromFs from './mount-from-fs.js'

type Mount = string | [string, string]

/**
 * Create an in-memory filesystem with specified directories mounted from the native node:fs
 * @param mounts Array of mounts where one mount is EITHER a string: "/foo" mounts "/foo" from the native filesystem to "/foo" in the in-memory filesystem; OR an array of two strings: ["/foo", "/bar"] mounts "/foo" from the native filesystem to "/bar" in the in-memory filesystem. Both types can be mixed in the array
 * */
export default function createHybridFs(mounts: Mount[]) {
    // @ts-ignore IFS (unionfs) doesnt match IFs (memfs)
    const vfs: IFS = createFsFromVolume(new Volume())
    // @ts-ignore
    const fs: IFS = mountFromFs(
        mounts.map(mount =>
            typeof mount === 'string'
                ? [mount, mount]
                : mount
        )
    )
    return ufs
        .use(vfs)
        .use(fs)
}
