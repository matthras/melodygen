Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GraceNote = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stavenote = require('./stavenote');

var _tables = require('./tables');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.

var GraceNote = exports.GraceNote = function (_StaveNote) {
  _inherits(GraceNote, _StaveNote);

  _createClass(GraceNote, null, [{
    key: 'CATEGORY',
    get: function get() {
      return 'gracenotes';
    }
  }, {
    key: 'LEDGER_LINE_OFFSET',
    get: function get() {
      return 2;
    }
  }, {
    key: 'SCALE',
    get: function get() {
      return 0.66;
    }
  }]);

  function GraceNote(note_struct) {
    _classCallCheck(this, GraceNote);

    var _this = _possibleConstructorReturn(this, (GraceNote.__proto__ || Object.getPrototypeOf(GraceNote)).call(this, Object.assign(note_struct, {
      glyph_font_scale: _tables.Flow.DEFAULT_NOTATION_FONT_SCALE * GraceNote.SCALE,
      stroke_px: GraceNote.LEDGER_LINE_OFFSET
    })));

    _this.setAttribute('type', 'GraceNote');

    _this.slash = note_struct.slash;
    _this.slur = true;

    _this.buildNoteHeads();

    _this.width = 3;
    return _this;
  }

  _createClass(GraceNote, [{
    key: 'getStemExtension',
    value: function getStemExtension() {
      var glyph = this.getGlyph();

      if (this.stem_extension_override != null) {
        return this.stem_extension_override;
      }

      if (glyph) {
        return this.getStemDirection() === 1 ? glyph.gracenote_stem_up_extension : glyph.gracenote_stem_down_extension;
      }

      return 0;
    }
  }, {
    key: 'getCategory',
    value: function getCategory() {
      return GraceNote.CATEGORY;
    }
  }, {
    key: 'draw',
    value: function draw() {
      _get(GraceNote.prototype.__proto__ || Object.getPrototypeOf(GraceNote.prototype), 'draw', this).call(this);
      this.setRendered();
      var ctx = this.context;
      var stem_direction = this.getStemDirection();

      if (this.slash) {
        ctx.beginPath();

        var x = this.getAbsoluteX();
        var y = this.getYs()[0] - this.stem.getHeight() / 2.8;
        if (stem_direction === 1) {
          x += 1;
          ctx.moveTo(x, y);
          ctx.lineTo(x + 13, y - 9);
        } else if (stem_direction === -1) {
          x -= 4;
          y += 1;
          ctx.moveTo(x, y);
          ctx.lineTo(x + 13, y + 9);
        }

        ctx.closePath();
        ctx.stroke();
      }
    }
  }]);

  return GraceNote;
}(_stavenote.StaveNote);