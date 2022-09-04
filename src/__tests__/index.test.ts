import createHybridFs from '../'

describe('mountFromFs(rewrites)', () => {
    it('Simple rewrite', () => {
        const hfs = createHybridFs([['.test_files', '/']])
        expect(hfs.readFileSync('/file1', 'utf8')).toBe("hello world!\n")
    })

    it('Each path step should be rewritten completely', () => {
        const hfs = createHybridFs([['.test_', '/test_']])
        let fileContents
        try {
            fileContents = hfs.readFileSync('/test_files/file1', 'utf8')
            throw new Error('This should not throw')
        } catch(err) {
            expect(err.code).toBe('ENOENT')
        }
    })

    it('Invalid rewrite routes argument throws', () => {
        try {
            const hfs = createHybridFs([['.test_files', 123 as any]])
            throw Error('not_this')
        } catch(err) {
            expect(err.message === 'not_this').toBe(false)
        }
    })

    it('Invalid path argument gets proxied', () => {
        try {
            const hfs = createHybridFs([['.test_files', '/']])
            hfs.readFileSync(123, 'utf8')
            throw new Error('This should not throw')
        } catch(err) {
            expect([err.code, err.prev.code]).toContain('EBADF')
        }
    })

    it('rewrites multi-step paths', () => {
        const hfs = createHybridFs([['.test_files/dir1/dir2/dir3/dir4', '/files']])
        expect(hfs.readFileSync('/files/file2', 'utf8')).toBe("hello from here, too!\n")
    })
})
