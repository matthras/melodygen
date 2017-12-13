Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Glyph = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _element = require('./element');

var _boundingboxcomputation = require('./boundingboxcomputation');

var _boundingbox = require('./boundingbox');

var _vexflow_font = require('./fonts/vexflow_font');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.

function processOutline(outline, originX, originY, scaleX, scaleY, outlineFns) {
  var command = void 0;
  var x = void 0;
  var y = void 0;
  var i = 0;

  function nextX() {
    return originX + outline[i++] * scaleX;
  }
  function nextY() {
    return originY + outline[i++] * scaleY;
  }

  while (i < outline.length) {
    command = outline[i++];
    switch (command) {
      case 'm':
      case 'l':
        outlineFns[command](nextX(), nextY());
        break;
      case 'q':
        x = nextX();
        y = nextY();
        outlineFns.q(nextX(), nextY(), x, y);
        break;
      case 'b':
        x = nextX();
        y = nextY();
        outlineFns.b(nextX(), nextY(), nextX(), nextY(), x, y);
        break;
      default:
        break;
    }
  }
}

var Glyph = exports.Glyph = function (_Element) {
  _inherits(Glyph, _Element);

  _createClass(Glyph, null, [{
    key: 'loadMetrics',

    /* Static methods used to implement loading / unloading of glyphs */
    value: function loadMetrics(font, code, cache) {
      var glyph = font.glyphs[code];
      if (!glyph) {
        throw new _vex.Vex.RERR('BadGlyph', 'Glyph ' + code + ' does not exist in font.');
      }

      var x_min = glyph.x_min;
      var x_max = glyph.x_max;
      var ha = glyph.ha;

      var outline = void 0;

      if (glyph.o) {
        if (cache) {
          if (glyph.cached_outline) {
            outline = glyph.cached_outline;
          } else {
            outline = glyph.o.split(' ');
            glyph.cached_outline = outline;
          }
        } else {
          if (glyph.cached_outline) delete glyph.cached_outline;
          outline = glyph.o.split(' ');
        }

        return {
          x_min: x_min,
          x_max: x_max,
          ha: ha,
          outline: outline
        };
      } else {
        throw new _vex.Vex.RERR('BadGlyph', 'Glyph ' + code + ' has no outline defined.');
      }
    }

    /**
     * A quick and dirty static glyph renderer. Renders glyphs from the default
     * font defined in Vex.Flow.Font.
     *
     * @param {!Object} ctx The canvas context.
     * @param {number} x_pos X coordinate.
     * @param {number} y_pos Y coordinate.
     * @param {number} point The point size to use.
     * @param {string} val The glyph code in Vex.Flow.Font.
     * @param {boolean} nocache If set, disables caching of font outline.
     */

  }, {
    key: 'renderGlyph',
    value: function renderGlyph(ctx, x_pos, y_pos, point, val, nocache) {
      var scale = point * 72.0 / (_vexflow_font.Font.resolution * 100.0);
      var metrics = Glyph.loadMetrics(_vexflow_font.Font, val, !nocache);
      Glyph.renderOutline(ctx, metrics.outline, scale, x_pos, y_pos);
    }
  }, {
    key: 'renderOutline',
    value: function renderOutline(ctx, outline, scale, x_pos, y_pos) {
      ctx.beginPath();
      ctx.moveTo(x_pos, y_pos);
      processOutline(outline, x_pos, y_pos, scale, -scale, {
        m: ctx.moveTo.bind(ctx),
        l: ctx.lineTo.bind(ctx),
        q: ctx.quadraticCurveTo.bind(ctx),
        b: ctx.bezierCurveTo.bind(ctx)
      });
      ctx.fill();
    }
  }, {
    key: 'getOutlineBoundingBox',
    value: function getOutlineBoundingBox(outline, scale, x_pos, y_pos) {
      var bboxComp = new _boundingboxcomputation.BoundingBoxComputation();

      processOutline(outline, x_pos, y_pos, scale, -scale, {
        m: bboxComp.addPoint.bind(bboxComp),
        l: bboxComp.addPoint.bind(bboxComp),
        q: bboxComp.addQuadraticCurve.bind(bboxComp),
        b: bboxComp.addBezierCurve.bind(bboxComp)
      });

      return new _boundingbox.BoundingBox(bboxComp.x1, bboxComp.y1, bboxComp.width(), bboxComp.height());
    }

    /**
     * @constructor
     */

  }]);

  function Glyph(code, point, options) {
    _classCallCheck(this, Glyph);

    var _this = _possibleConstructorReturn(this, (Glyph.__proto__ || Object.getPrototypeOf(Glyph)).call(this));

    _this.setAttribute('type', 'Glyph');

    _this.code = code;
    _this.point = point;
    _this.options = {
      cache: true,
      font: _vexflow_font.Font
    };

    _this.metrics = null;
    _this.x_shift = 0;
    _this.y_shift = 0;

    _this.originShift = {
      x: 0,
      y: 0
    };

    if (options) {
      _this.setOptions(options);
    } else {
      _this.reset();
    }
    return _this;
  }

  _createClass(Glyph, [{
    key: 'setOptions',
    value: function setOptions(options) {
      _vex.Vex.Merge(this.options, options);
      this.reset();
    }
  }, {
    key: 'setPoint',
    value: function setPoint(point) {
      this.point = point;return this;
    }
  }, {
    key: 'setStave',
    value: function setStave(stave) {
      this.stave = stave;return this;
    }
  }, {
    key: 'setXShift',
    value: function setXShift(x_shift) {
      this.x_shift = x_shift;return this;
    }
  }, {
    key: 'setYShift',
    value: function setYShift(y_shift) {
      this.y_shift = y_shift;return this;
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.scale = this.point * 72 / (this.options.font.resolution * 100);
      this.metrics = Glyph.loadMetrics(this.options.font, this.code, this.options.cache);
      this.bbox = Glyph.getOutlineBoundingBox(this.metrics.outline, this.scale, 0, 0);
    }
  }, {
    key: 'getMetrics',
    value: function getMetrics() {
      if (!this.metrics) {
        throw new _vex.Vex.RuntimeError('BadGlyph', 'Glyph ' + this.code + ' is not initialized.');
      }

      return {
        x_min: this.metrics.x_min * this.scale,
        x_max: this.metrics.x_max * this.scale,
        width: this.bbox.getW(),
        height: this.bbox.getH()
      };
    }
  }, {
    key: 'setOriginX',
    value: function setOriginX(x) {
      var bbox = this.bbox;

      var originX = Math.abs(bbox.getX() / bbox.getW());
      var xShift = (x - originX) * bbox.getW();
      this.originShift.x = -xShift;
    }
  }, {
    key: 'setOriginY',
    value: function setOriginY(y) {
      var bbox = this.bbox;

      var originY = Math.abs(bbox.getY() / bbox.getH());
      var yShift = (y - originY) * bbox.getH();
      this.originShift.y = -yShift;
    }
  }, {
    key: 'setOrigin',
    value: function setOrigin(x, y) {
      this.setOriginX(x);
      this.setOriginY(y);
    }
  }, {
    key: 'render',
    value: function render(ctx, x, y) {
      if (!this.metrics) {
        throw new _vex.Vex.RuntimeError('BadGlyph', 'Glyph ' + this.code + ' is not initialized.');
      }

      var outline = this.metrics.outline;
      var scale = this.scale;

      this.setRendered();
      this.applyStyle(ctx);
      Glyph.renderOutline(ctx, outline, scale, x + this.originShift.x, y + this.originShift.y);
      this.restoreStyle(ctx);
    }
  }, {
    key: 'renderToStave',
    value: function renderToStave(x) {
      this.checkContext();

      if (!this.metrics) {
        throw new _vex.Vex.RuntimeError('BadGlyph', 'Glyph ' + this.code + ' is not initialized.');
      }

      if (!this.stave) {
        throw new _vex.Vex.RuntimeError('GlyphError', 'No valid stave');
      }

      var outline = this.metrics.outline;
      var scale = this.scale;

      this.setRendered();
      this.applyStyle();
      Glyph.renderOutline(this.context, outline, scale, x + this.x_shift, this.stave.getYForGlyphs() + this.y_shift);
      this.restoreStyle();
    }
  }]);

  return Glyph;
}(_element.Element);