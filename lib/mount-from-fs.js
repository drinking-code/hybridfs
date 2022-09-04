"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = mountFromFs;

var _path = require("path");

var fs = _interopRequireWildcard(require("fs"));

var _methodsProps = require("./methods-props.js");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function mountFromFs(rewrites) {
  var resolvedRewrites = [];

  for (var _i = 0, _arr = rewrites; _i < _arr.length; _i++) {
    var _arr$_i = _slicedToArray(_arr[_i], 2),
        from = _arr$_i[0],
        to = _arr$_i[1];

    resolvedRewrites.push([(0, _path.resolve)(from), (0, _path.resolve)(to)]);
  }

  var lfs = {};

  var _iterator = _createForOfIteratorHelper(_methodsProps.props),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var prop = _step.value;
      lfs[prop] = fs[prop];
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  var _iterator2 = _createForOfIteratorHelper(_methodsProps.rewritableMethods),
      _step2;

  try {
    var _loop = function _loop() {
      var method = _step2.value;
      var func = fs[method];
      if (typeof func !== 'function') return "continue";

      lfs[method] = function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var path = args[0];

        if (typeof path !== 'string' && !Buffer.isBuffer(path)) {
          if (!require('url').URL || !(path instanceof require('url').URL)) return func.apply(fs, args);
        }

        var filename = (0, _path.resolve)(String(path));
        var rewritten = false;

        var _iterator4 = _createForOfIteratorHelper(resolvedRewrites),
            _step4;

        try {
          var _loop2 = function _loop2() {
            var _step4$value = _slicedToArray(_step4.value, 2),
                from = _step4$value[0],
                to = _step4$value[1];

            if (!filename.startsWith(to)) return "continue";
            var rootRegex = /(^[a-zA-Z]:\\$)|(^\/$)/;
            var isRoot = to.match(rootRegex);
            var baseRegex = '^(' + to.replace(/\\/g, '\\\\') + ')';

            if (isRoot) {
              var regex = new RegExp(baseRegex);
              filename = filename.replace(regex, function () {
                return from + _path.sep;
              });
            } else {
              var _regex = new RegExp(baseRegex + '(\\\\|\/|$)');

              filename = filename.replace(_regex, function (match, p1, p2) {
                return from + p2;
              });
            }

            rewritten = true;
          };

          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var _ret2 = _loop2();

            if (_ret2 === "continue") continue;
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }

        if (!rewritten) throw new Error();
        args[0] = filename;
        return func.apply(fs, args);
      };
    };

    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _ret = _loop();

      if (_ret === "continue") continue;
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  var _iterator3 = _createForOfIteratorHelper(_methodsProps.proxyableMethods),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var method = _step3.value;
      var func = fs[method];
      if (typeof func !== 'function') continue;
      lfs[method] = func.bind(fs);
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  return lfs;
}