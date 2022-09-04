"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rewritableMethods = exports.proxyableMethods = exports.props = void 0;
var props = ['constants', 'F_OK', 'R_OK', 'W_OK', 'X_OK', 'Stats'];
exports.props = props;
var rewritableMethods = ['accessSync', 'access', 'appendFileSync', 'appendFile', 'chmodSync', 'chmod', 'chownSync', 'chown', 'createReadStream', 'createWriteStream', 'existsSync', 'exists', 'lchmodSync', 'lchmod', 'lchownSync', 'lchown', 'linkSync', 'link', 'lstatSync', 'lstat', 'mkdirSync', 'mkdir', 'mkdtempSync', 'mkdtemp', 'openSync', 'open', 'readdirSync', 'readdir', 'readFileSync', 'readFile', 'readlinkSync', 'readlink', 'realpathSync', 'realpath', 'renameSync', 'rename', 'rmdirSync', 'rmdir', 'statSync', 'stat', 'symlinkSync', 'symlink', 'truncateSync', 'truncate', 'unlinkSync', 'unlink', 'unwatchFile', 'utimesSync', 'utimes', 'watch', 'watchFile', 'writeFileSync', 'writeFile'];
exports.rewritableMethods = rewritableMethods;
var proxyableMethods = ['ftruncateSync', 'fchownSync', 'fchmodSync', 'fstatSync', 'closeSync', 'futimesSync', 'fsyncSync', 'writeSync', 'readSync', 'fdatasyncSync', 'ftruncate', 'fchown', 'fchmod', 'fstat', 'close', 'futimes', 'fsync', 'write', 'read', 'fdatasync', '_toUnixTimestamp'];
exports.proxyableMethods = proxyableMethods;