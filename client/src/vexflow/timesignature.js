Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimeSignature = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _glyph3 = require('./glyph');

var _stavemodifier = require('./stavemodifier');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
// Implements time signatures glyphs for staffs
// See tables.js for the internal time signatures
// representation

var assertIsValidFraction = function assertIsValidFraction(timeSpec) {
  var numbers = timeSpec.split('/').filter(function (number) {
    return number !== '';
  });

  if (numbers.length !== 2) {
    throw new _vex.Vex.RERR('BadTimeSignature', 'Invalid time spec: ' + timeSpec + '. Must be in the form "<numerator>/<denominator>"');
  }

  numbers.forEach(function (number) {
    if (isNaN(Number(number))) {
      throw new _vex.Vex.RERR('BadTimeSignature', 'Invalid time spec: ' + timeSpec + '. Must contain two valid numbers.');
    }
  });
};

var TimeSignature = exports.TimeSignature = function (_StaveModifier) {
  _inherits(TimeSignature, _StaveModifier);

  _createClass(TimeSignature, null, [{
    key: 'CATEGORY',
    get: function get() {
      return 'timesignatures';
    }
  }, {
    key: 'glyphs',
    get: function get() {
      return {
        'C': {
          code: 'v41',
          point: 40,
          line: 2
        },
        'C|': {
          code: 'vb6',
          point: 40,
          line: 2
        }
      };
    }
  }]);

  function TimeSignature() {
    var timeSpec = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var customPadding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 15;

    _classCallCheck(this, TimeSignature);

    var _this = _possibleConstructorReturn(this, (TimeSignature.__proto__ || Object.getPrototypeOf(TimeSignature)).call(this));

    _this.setAttribute('type', 'TimeSignature');

    if (timeSpec === null) return _possibleConstructorReturn(_this);

    var padding = customPadding;

    _this.point = 40;
    _this.topLine = 2;
    _this.bottomLine = 4;
    _this.setPosition(_stavemodifier.StaveModifier.Position.BEGIN);
    _this.setTimeSig(timeSpec);
    _this.setWidth(_this.timeSig.glyph.getMetrics().width);
    _this.setPadding(padding);
    return _this;
  }

  _createClass(TimeSignature, [{
    key: 'getCategory',
    value: function getCategory() {
      return TimeSignature.CATEGORY;
    }
  }, {
    key: 'parseTimeSpec',
    value: function parseTimeSpec(timeSpec) {
      if (timeSpec === 'C' || timeSpec === 'C|') {
        var _TimeSignature$glyphs = TimeSignature.glyphs[timeSpec],
            line = _TimeSignature$glyphs.line,
            code = _TimeSignature$glyphs.code,
            point = _TimeSignature$glyphs.point;

        return {
          line: line,
          num: false,
          glyph: new _glyph3.Glyph(code, point)
        };
      }

      assertIsValidFraction(timeSpec);

      var _timeSpec$split$map = timeSpec.split('/').map(function (number) {
        return number.split('');
      }),
          _timeSpec$split$map2 = _slicedToArray(_timeSpec$split$map, 2),
          topDigits = _timeSpec$split$map2[0],
          botDigits = _timeSpec$split$map2[1];

      return {
        num: true,
        glyph: this.makeTimeSignatureGlyph(topDigits, botDigits)
      };
    }
  }, {
    key: 'makeTimeSignatureGlyph',
    value: function makeTimeSignatureGlyph(topDigits, botDigits) {
      var glyph = new _glyph3.Glyph('v0', this.point);
      glyph.topGlyphs = [];
      glyph.botGlyphs = [];

      var topWidth = 0;
      for (var i = 0; i < topDigits.length; ++i) {
        var num = topDigits[i];
        var topGlyph = new _glyph3.Glyph('v' + num, this.point);

        glyph.topGlyphs.push(topGlyph);
        topWidth += topGlyph.getMetrics().width;
      }

      var botWidth = 0;
      for (var _i = 0; _i < botDigits.length; ++_i) {
        var _num = botDigits[_i];
        var botGlyph = new _glyph3.Glyph('v' + _num, this.point);

        glyph.botGlyphs.push(botGlyph);
        botWidth += botGlyph.getMetrics().width;
      }

      var width = topWidth > botWidth ? topWidth : botWidth;
      var xMin = glyph.getMetrics().x_min;

      glyph.getMetrics = function () {
        return {
          x_min: xMin,
          x_max: xMin + width,
          width: width
        };
      };

      var topStartX = (width - topWidth) / 2.0;
      var botStartX = (width - botWidth) / 2.0;

      var that = this;
      glyph.renderToStave = function renderToStave(x) {
        var start_x = x + topStartX;
        for (var _i2 = 0; _i2 < this.topGlyphs.length; ++_i2) {
          var _glyph = this.topGlyphs[_i2];
          _glyph3.Glyph.renderOutline(this.context, _glyph.metrics.outline, _glyph.scale, start_x + _glyph.x_shift, this.stave.getYForLine(that.topLine) + 1);
          start_x += _glyph.getMetrics().width;
        }

        start_x = x + botStartX;
        for (var _i3 = 0; _i3 < this.botGlyphs.length; ++_i3) {
          var _glyph2 = this.botGlyphs[_i3];
          that.placeGlyphOnLine(_glyph2, this.stave, _glyph2.line);
          _glyph3.Glyph.renderOutline(this.context, _glyph2.metrics.outline, _glyph2.scale, start_x + _glyph2.x_shift, this.stave.getYForLine(that.bottomLine) + 1);
          start_x += _glyph2.getMetrics().width;
        }
      };

      return glyph;
    }
  }, {
    key: 'getTimeSig',
    value: function getTimeSig() {
      return this.timeSig;
    }
  }, {
    key: 'setTimeSig',
    value: function setTimeSig(timeSpec) {
      this.timeSig = this.parseTimeSpec(timeSpec);
      return this;
    }
  }, {
    key: 'draw',
    value: function draw() {
      if (!this.x) {
        throw new _vex.Vex.RERR('TimeSignatureError', "Can't draw time signature without x.");
      }

      if (!this.stave) {
        throw new _vex.Vex.RERR('TimeSignatureError', "Can't draw time signature without stave.");
      }

      this.setRendered();
      this.timeSig.glyph.setStave(this.stave);
      this.timeSig.glyph.setContext(this.stave.context);
      this.placeGlyphOnLine(this.timeSig.glyph, this.stave, this.timeSig.line);
      this.timeSig.glyph.renderToStave(this.x);
    }
  }]);

  return TimeSignature;
}(_stavemodifier.StaveModifier);