"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = createHybridFs;

var _unionfs = require("unionfs");

var _memfs = require("memfs");

var _mountFromFs = _interopRequireDefault(require("./mount-from-fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function createHybridFs(mounts) {
  var vfs = (0, _memfs.createFsFromVolume)(new _memfs.Volume());
  var fs = (0, _mountFromFs["default"])(mounts.map(function (mount) {
    return typeof mount === 'string' ? [mount, mount] : mount;
  }));
  return _unionfs.ufs.use(fs).use(vfs);
}