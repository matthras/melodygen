Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StaveConnector = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _element = require('./element');

var _tables = require('./tables');

var _glyph = require('./glyph');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.

function drawBoldDoubleLine(ctx, type, topX, topY, botY) {
  if (type !== StaveConnector.type.BOLD_DOUBLE_LEFT && type !== StaveConnector.type.BOLD_DOUBLE_RIGHT) {
    throw new _vex.Vex.RERR('InvalidConnector', 'A REPEAT_BEGIN or REPEAT_END type must be provided.');
  }

  var x_shift = 3;
  var variableWidth = 3.5; // Width for avoiding anti-aliasing width issues
  var thickLineOffset = 2; // For aesthetics

  if (type === StaveConnector.type.BOLD_DOUBLE_RIGHT) {
    x_shift = -5; // Flips the side of the thin line
    variableWidth = 3;
  }

  // Thin line
  ctx.fillRect(topX + x_shift, topY, 1, botY - topY);
  // Thick line
  ctx.fillRect(topX - thickLineOffset, topY, variableWidth, botY - topY);
}

var StaveConnector = exports.StaveConnector = function (_Element) {
  _inherits(StaveConnector, _Element);

  _createClass(StaveConnector, null, [{
    key: 'type',

    // SINGLE_LEFT and SINGLE are the same value for compatibility
    // with older versions of vexflow which didn't have right sided
    // stave connectors
    get: function get() {
      return {
        SINGLE_RIGHT: 0,
        SINGLE_LEFT: 1,
        SINGLE: 1,
        DOUBLE: 2,
        BRACE: 3,
        BRACKET: 4,
        BOLD_DOUBLE_LEFT: 5,
        BOLD_DOUBLE_RIGHT: 6,
        THIN_DOUBLE: 7,
        NONE: 8
      };
    }
  }, {
    key: 'typeString',
    get: function get() {
      return {
        singleRight: StaveConnector.type.SINGLE_RIGHT,
        singleLeft: StaveConnector.type.SINGLE_LEFT,
        single: StaveConnector.type.SINGLE,
        double: StaveConnector.type.DOUBLE,
        brace: StaveConnector.type.BRACE,
        bracket: StaveConnector.type.BRACKET,
        boldDoubleLeft: StaveConnector.type.BOLD_DOUBLE_LEFT,
        boldDoubleRight: StaveConnector.type.BOLD_DOUBLE_RIGHT,
        thinDouble: StaveConnector.type.THIN_DOUBLE,
        none: StaveConnector.type.NONE
      };
    }
  }]);

  function StaveConnector(top_stave, bottom_stave) {
    _classCallCheck(this, StaveConnector);

    var _this = _possibleConstructorReturn(this, (StaveConnector.__proto__ || Object.getPrototypeOf(StaveConnector)).call(this));

    _this.setAttribute('type', 'StaveConnector');

    _this.thickness = _tables.Flow.STAVE_LINE_THICKNESS;
    _this.width = 3;
    _this.top_stave = top_stave;
    _this.bottom_stave = bottom_stave;
    _this.type = StaveConnector.type.DOUBLE;
    _this.font = {
      family: 'times',
      size: 16,
      weight: 'normal'
    };
    // 1. Offset Bold Double Left to align with offset Repeat Begin bars
    // 2. Offset BRACE type not to overlap with another StaveConnector
    _this.x_shift = 0;
    _this.texts = [];
    return _this;
  }

  _createClass(StaveConnector, [{
    key: 'setType',
    value: function setType(type) {
      type = typeof type === 'string' ? StaveConnector.typeString[type] : type;

      if (type >= StaveConnector.type.SINGLE_RIGHT && type <= StaveConnector.type.NONE) {
        this.type = type;
      }
      return this;
    }
  }, {
    key: 'setText',
    value: function setText(text, options) {
      this.texts.push({
        content: text,
        options: _vex.Vex.Merge({ shift_x: 0, shift_y: 0 }, options)
      });
      return this;
    }
  }, {
    key: 'setFont',
    value: function setFont(font) {
      _vex.Vex.Merge(this.font, font);
    }
  }, {
    key: 'setXShift',
    value: function setXShift(x_shift) {
      if (typeof x_shift !== 'number') {
        throw _vex.Vex.RERR('InvalidType', 'x_shift must be a Number');
      }

      this.x_shift = x_shift;
      return this;
    }
  }, {
    key: 'draw',
    value: function draw() {
      var ctx = this.checkContext();
      this.setRendered();

      var topY = this.top_stave.getYForLine(0);
      var botY = this.bottom_stave.getYForLine(this.bottom_stave.getNumLines() - 1) + this.thickness;
      var width = this.width;
      var topX = this.top_stave.getX();

      var isRightSidedConnector = this.type === StaveConnector.type.SINGLE_RIGHT || this.type === StaveConnector.type.BOLD_DOUBLE_RIGHT || this.type === StaveConnector.type.THIN_DOUBLE;

      if (isRightSidedConnector) {
        topX = this.top_stave.getX() + this.top_stave.width;
      }

      var attachment_height = botY - topY;
      switch (this.type) {
        case StaveConnector.type.SINGLE:
          width = 1;
          break;
        case StaveConnector.type.SINGLE_LEFT:
          width = 1;
          break;
        case StaveConnector.type.SINGLE_RIGHT:
          width = 1;
          break;
        case StaveConnector.type.DOUBLE:
          topX -= this.width + 2;
          break;
        case StaveConnector.type.BRACE:
          {
            width = 12;
            // May need additional code to draw brace
            var x1 = this.top_stave.getX() - 2 + this.x_shift;
            var y1 = topY;
            var x3 = x1;
            var y3 = botY;
            var x2 = x1 - width;
            var y2 = y1 + attachment_height / 2.0;
            var cpx1 = x2 - 0.90 * width;
            var cpy1 = y1 + 0.2 * attachment_height;
            var cpx2 = x1 + 1.10 * width;
            var cpy2 = y2 - 0.135 * attachment_height;
            var cpx3 = cpx2;
            var cpy3 = y2 + 0.135 * attachment_height;
            var cpx4 = cpx1;
            var cpy4 = y3 - 0.2 * attachment_height;
            var cpx5 = x2 - width;
            var cpy5 = cpy4;
            var cpx6 = x1 + 0.40 * width;
            var cpy6 = y2 + 0.135 * attachment_height;
            var cpx7 = cpx6;
            var cpy7 = y2 - 0.135 * attachment_height;
            var cpx8 = cpx5;
            var cpy8 = cpy1;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x2, y2);
            ctx.bezierCurveTo(cpx3, cpy3, cpx4, cpy4, x3, y3);
            ctx.bezierCurveTo(cpx5, cpy5, cpx6, cpy6, x2, y2);
            ctx.bezierCurveTo(cpx7, cpy7, cpx8, cpy8, x1, y1);
            ctx.fill();
            ctx.stroke();
            break;
          }case StaveConnector.type.BRACKET:
          topY -= 4;
          botY += 4;
          attachment_height = botY - topY;
          _glyph.Glyph.renderGlyph(ctx, topX - 5, topY - 3, 40, 'v1b', true);
          _glyph.Glyph.renderGlyph(ctx, topX - 5, botY + 3, 40, 'v10', true);
          topX -= this.width + 2;
          break;
        case StaveConnector.type.BOLD_DOUBLE_LEFT:
          drawBoldDoubleLine(ctx, this.type, topX + this.x_shift, topY, botY);
          break;
        case StaveConnector.type.BOLD_DOUBLE_RIGHT:
          drawBoldDoubleLine(ctx, this.type, topX, topY, botY);
          break;
        case StaveConnector.type.THIN_DOUBLE:
          width = 1;
          break;
        case StaveConnector.type.NONE:
          break;
        default:
          throw new _vex.Vex.RERR('InvalidType', 'The provided StaveConnector.type (' + this.type + ') is invalid');
      }

      if (this.type !== StaveConnector.type.BRACE && this.type !== StaveConnector.type.BOLD_DOUBLE_LEFT && this.type !== StaveConnector.type.BOLD_DOUBLE_RIGHT && this.type !== StaveConnector.type.NONE) {
        ctx.fillRect(topX, topY, width, attachment_height);
      }

      // If the connector is a thin double barline, draw the paralell line
      if (this.type === StaveConnector.type.THIN_DOUBLE) {
        ctx.fillRect(topX - 3, topY, width, attachment_height);
      }

      ctx.save();
      ctx.lineWidth = 2;
      ctx.setFont(this.font.family, this.font.size, this.font.weight);
      // Add stave connector text
      for (var i = 0; i < this.texts.length; i++) {
        var text = this.texts[i];
        var text_width = ctx.measureText('' + text.content).width;
        var x = this.top_stave.getX() - text_width - 24 + text.options.shift_x;
        var y = (this.top_stave.getYForLine(0) + this.bottom_stave.getBottomLineY()) / 2 + text.options.shift_y;

        ctx.fillText('' + text.content, x, y + 4);
      }
      ctx.restore();
    }
  }]);

  return StaveConnector;
}(_element.Element);