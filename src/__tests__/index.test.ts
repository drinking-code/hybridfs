import {mountFromFs} from '../mount-from-fs';
import {Volume} from 'memfs';


describe('rewrite(fs, rewrites)', () => {
    it('Simple rewrite', () => {
        const vol = Volume.fromJSON({'/foo': 'bar'});
        const lfs = mountFromFs(vol, ['/lol', '/foo']);
        expect(lfs.readFileSync('/lol', 'utf8')).toBe('bar');
    });

    it('Each path step should be rewritten completely', () => {
        const vol = Volume.fromJSON({'/foo/bar': 'hello'});
        const lfs = mountFromFs(vol, ['/lol', '/fo']);
        let hello;
        try {
            hello = lfs.readFileSync('/lolo/bar', 'utf8');
            throw Error('This should not throw');
        } catch(err) {
            expect(err.code).toBe('ENOENT');
        }
    });

    it('Invalid rewrite routes argument throws', () => {
        const vol = Volume.fromJSON({'/foo/bar': 'hello'});
        try {
            const lfs = mountFromFs(vol, 123 as any);
            throw Error('not_this');
        } catch(err) {
            expect(err.message === 'not_this').toBe(false);
        }
    });

    it('Invalid path argument gets proxied', () => {
        const vol = Volume.fromJSON({'/foo/bar': 'hello'});
        try {
            const lfs = mountFromFs(vol, ['/lol', '/foo']);
            lfs.readFileSync(123, 'utf8');
            throw Error('This should not throw');
        } catch(err) {
            expect(err.code).toBe('EBADF');
        }
    });

    it('rewrites multi-step paths', () => {
        const vol = Volume.fromJSON({
            '/1/2/3/4': 'foo'
        });
        const lfs = mountFromFs(vol, ['/lol', '/1/2/3']);

        expect(lfs.readFileSync('/lol/4', 'utf8')).toBe('foo');
    });

    it('rewrites root path', () => {
        const vol = Volume.fromJSON({
            '/1/2/3/4': 'foo'
        });
        const lfs = mountFromFs(vol, ['/', '/1/2/3']);

        expect(lfs.readFileSync('/4', 'utf8')).toBe('foo');
    });
});
