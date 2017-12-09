'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
// This file implements utility methods used by the rest of the VexFlow
// codebase.
//

var Vex = function Vex() {};

// Default log function sends all arguments to console.
Vex.L = function (block, args) {
  if (!args) return;
  var line = Array.prototype.slice.call(args).join(' ');
  window.console.log(block + ': ' + line);
};

Vex.MakeException = function (name) {
  var exception = function (_Error) {
    _inherits(exception, _Error);

    function exception(message, data) {
      _classCallCheck(this, exception);

      var _this = _possibleConstructorReturn(this, (exception.__proto__ || Object.getPrototypeOf(exception)).call(this, message));

      _this.name = name;
      _this.message = message;
      _this.data = data;
      return _this;
    }

    return exception;
  }(Error);

  return exception;
};

// Default runtime exception.

var RuntimeError = function () {
  function RuntimeError(code, message) {
    _classCallCheck(this, RuntimeError);

    this.code = code;
    this.message = message;
  }

  _createClass(RuntimeError, [{
    key: 'toString',
    value: function toString() {
      return '[RuntimeError] ' + this.code + ':' + this.message;
    }
  }]);

  return RuntimeError;
}();

// Shortcut method for `RuntimeError`.


Vex.RuntimeError = RuntimeError;
Vex.RERR = Vex.RuntimeError;

// Merge `destination` hash with `source` hash, overwriting like keys
// in `source` if necessary.
Vex.Merge = function (destination, source) {
  for (var property in source) {
    // eslint-disable-line guard-for-in
    destination[property] = source[property];
  }
  return destination;
};

// DEPRECATED. Use `Math.*`.
Vex.Min = Math.min;
Vex.Max = Math.max;
Vex.forEach = function (a, fn) {
  for (var i = 0; i < a.length; i++) {
    fn(a[i], i);
  }
};

// Round number to nearest fractional value (`.5`, `.25`, etc.)
Vex.RoundN = function (x, n) {
  return x % n >= n / 2 ? parseInt(x / n, 10) * n + n : parseInt(x / n, 10) * n;
};

// Locate the mid point between stave lines. Returns a fractional line if a space.
Vex.MidLine = function (a, b) {
  var mid_line = b + (a - b) / 2;
  if (mid_line % 2 > 0) {
    mid_line = Vex.RoundN(mid_line * 10, 5) / 10;
  }
  return mid_line;
};

// Take `arr` and return a new list consisting of the sorted, unique,
// contents of arr. Does not modify `arr`.
Vex.SortAndUnique = function (arr, cmp, eq) {
  if (arr.length > 1) {
    var newArr = [];
    var last = void 0;
    arr.sort(cmp);

    for (var i = 0; i < arr.length; ++i) {
      if (i === 0 || !eq(arr[i], last)) {
        newArr.push(arr[i]);
      }
      last = arr[i];
    }

    return newArr;
  } else {
    return arr;
  }
};

// Check if array `a` contains `obj`.
Vex.Contains = function (a, obj) {
  var i = a.length;
  while (i--) {
    if (a[i] === obj) {
      return true;
    }
  }
  return false;
};

// Get the 2D Canvas context from DOM element `canvas_sel`.
Vex.getCanvasContext = function (canvas_sel) {
  if (!canvas_sel) {
    throw new Vex.RERR('BadArgument', 'Invalid canvas selector: ' + canvas_sel);
  }

  var canvas = document.getElementById(canvas_sel);
  if (!(canvas && canvas.getContext)) {
    throw new Vex.RERR('UnsupportedBrowserError', 'This browser does not support HTML5 Canvas');
  }

  return canvas.getContext('2d');
};

// Draw a tiny dot marker on the specified canvas. A great debugging aid.
//
// `ctx`: Canvas context.
// `x`, `y`: Dot coordinates.
Vex.drawDot = function (ctx, x, y) {
  var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '#55';

  ctx.save();
  ctx.setFillStyle(color);

  // draw a circle
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

// Benchmark. Run function `f` once and report time elapsed shifted by `s` milliseconds.
Vex.BM = function (s, f) {
  var start_time = new Date().getTime();
  f();
  var elapsed = new Date().getTime() - start_time;
  Vex.L(s + elapsed + 'ms');
};

// Get stack trace.
Vex.StackTrace = function () {
  var err = new Error();
  return err.stack;
};

// Dump warning to console.
Vex.W = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var line = args.join(' ');
  window.console.log('Warning: ', line, Vex.StackTrace());
};

// Used by various classes (e.g., SVGContext) to provide a
// unique prefix to element names (or other keys in shared namespaces).
Vex.Prefix = function (text) {
  return Vex.Prefix.prefix + text;
};
Vex.Prefix.prefix = 'vf-';

exports.Vex = Vex;