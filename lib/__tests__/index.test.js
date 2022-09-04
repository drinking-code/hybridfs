"use strict";

var _ = _interopRequireDefault(require("../"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('mountFromFs(rewrites)', function () {
  it('Simple rewrite', function () {
    var hfs = (0, _["default"])([['.test_files', '/']]);
    expect(hfs.readFileSync('/file1', 'utf8')).toBe("hello world!\n");
  });
  it('Each path step should be rewritten completely', function () {
    var hfs = (0, _["default"])([['.test_', '/test_']]);
    var fileContents;

    try {
      fileContents = hfs.readFileSync('/test_files/file1', 'utf8');
      throw new Error('This should not throw');
    } catch (err) {
      expect(err.code).toBe('ENOENT');
    }
  });
  it('Invalid rewrite routes argument throws', function () {
    try {
      var hfs = (0, _["default"])([['.test_files', 123]]);
      throw Error('not_this');
    } catch (err) {
      expect(err.message === 'not_this').toBe(false);
    }
  });
  it('Invalid path argument gets proxied', function () {
    try {
      var hfs = (0, _["default"])([['.test_files', '/']]);
      hfs.readFileSync(123, 'utf8');
      throw new Error('This should not throw');
    } catch (err) {
      expect([err.code, err.prev.code]).toContain('EBADF');
    }
  });
  it('rewrites multi-step paths', function () {
    var hfs = (0, _["default"])([['.test_files/dir1/dir2/dir3/dir4', '/files']]);
    expect(hfs.readFileSync('/files/file2', 'utf8')).toBe("hello from here, too!\n");
  });
});