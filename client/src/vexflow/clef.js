Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Clef = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _stavemodifier = require('./stavemodifier');

var _glyph = require('./glyph');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna Cheppudira 2013.
// Co-author: Benjamin W. Bohl
//
// ## Description
//
// This file implements various types of clefs that can be rendered on a stave.
//
// See `tests/clef_tests.js` for usage examples.

// To enable logging for this class, set `Vex.Flow.Clef.DEBUG` to `true`.
function L() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (Clef.DEBUG) _vex.Vex.L('Vex.Flow.Clef', args);
}

var Clef = exports.Clef = function (_StaveModifier) {
  _inherits(Clef, _StaveModifier);

  _createClass(Clef, null, [{
    key: 'CATEGORY',
    get: function get() {
      return 'clefs';
    }

    // Every clef name is associated with a glyph code from the font file
    // and a default stave line number.

  }, {
    key: 'types',
    get: function get() {
      return {
        'treble': {
          code: 'v83',
          line: 3
        },
        'bass': {
          code: 'v79',
          line: 1
        },
        'alto': {
          code: 'vad',
          line: 2
        },
        'tenor': {
          code: 'vad',
          line: 1
        },
        'percussion': {
          code: 'v59',
          line: 2
        },
        'soprano': {
          code: 'vad',
          line: 4
        },
        'mezzo-soprano': {
          code: 'vad',
          line: 3
        },
        'baritone-c': {
          code: 'vad',
          line: 0
        },
        'baritone-f': {
          code: 'v79',
          line: 2
        },
        'subbass': {
          code: 'v79',
          line: 0
        },
        'french': {
          code: 'v83',
          line: 4
        },
        'tab': {
          code: 'v2f'
        }
      };
    }

    // Sizes affect the point-size of the clef.

  }, {
    key: 'sizes',
    get: function get() {
      return {
        'default': 40,
        'small': 32
      };
    }

    // Annotations attach to clefs -- such as "8" for octave up or down.

  }, {
    key: 'annotations',
    get: function get() {
      return {
        '8va': {
          code: 'v8',
          sizes: {
            'default': {
              point: 20,
              attachments: {
                'treble': {
                  line: -1.2,
                  x_shift: 11
                }
              }
            },
            'small': {
              point: 18,
              attachments: {
                'treble': {
                  line: -0.4,
                  x_shift: 8
                }
              }
            }
          }
        },
        '8vb': {
          code: 'v8',
          sizes: {
            'default': {
              point: 20,
              attachments: {
                'treble': {
                  line: 6.3,
                  x_shift: 10
                },
                'bass': {
                  line: 4,
                  x_shift: 1
                }
              }
            },
            'small': {
              point: 18,
              attachments: {
                'treble': {
                  line: 5.8,
                  x_shift: 6
                },
                'bass': {
                  line: 3.5,
                  x_shift: 0.5
                }
              }
            }
          }
        }
      };
    }

    // Create a new clef. The parameter `clef` must be a key from
    // `Clef.types`.

  }]);

  function Clef(type, size, annotation) {
    _classCallCheck(this, Clef);

    var _this = _possibleConstructorReturn(this, (Clef.__proto__ || Object.getPrototypeOf(Clef)).call(this));

    _this.setAttribute('type', 'Clef');

    _this.setPosition(_stavemodifier.StaveModifier.Position.BEGIN);
    _this.setType(type, size, annotation);
    _this.setWidth(_this.glyph.getMetrics().width);
    L('Creating clef:', type);
    return _this;
  }

  _createClass(Clef, [{
    key: 'getCategory',
    value: function getCategory() {
      return Clef.CATEGORY;
    }
  }, {
    key: 'setType',
    value: function setType(type, size, annotation) {
      this.type = type;
      this.clef = Clef.types[type];
      if (size === undefined) {
        this.size = 'default';
      } else {
        this.size = size;
      }
      this.clef.point = Clef.sizes[this.size];
      this.glyph = new _glyph.Glyph(this.clef.code, this.clef.point);

      // If an annotation, such as 8va, is specified, add it to the Clef object.
      if (annotation !== undefined) {
        var anno_dict = Clef.annotations[annotation];
        this.annotation = {
          code: anno_dict.code,
          point: anno_dict.sizes[this.size].point,
          line: anno_dict.sizes[this.size].attachments[this.type].line,
          x_shift: anno_dict.sizes[this.size].attachments[this.type].x_shift
        };

        this.attachment = new _glyph.Glyph(this.annotation.code, this.annotation.point);
        this.attachment.metrics.x_max = 0;
        this.attachment.setXShift(this.annotation.x_shift);
      } else {
        this.annotation = undefined;
      }

      return this;
    }
  }, {
    key: 'getWidth',
    value: function getWidth() {
      if (this.type === 'tab' && !this.stave) {
        throw new _vex.Vex.RERR('ClefError', "Can't get width without stave.");
      }

      return this.width;
    }
  }, {
    key: 'setStave',
    value: function setStave(stave) {
      this.stave = stave;

      if (this.type !== 'tab') return this;

      var glyphScale = void 0;
      var glyphOffset = void 0;
      var numLines = this.stave.getOptions().num_lines;
      switch (numLines) {
        case 8:
          glyphScale = 55;
          glyphOffset = 14;
          break;
        case 7:
          glyphScale = 47;
          glyphOffset = 8;
          break;
        case 6:
          glyphScale = 40;
          glyphOffset = 1;
          break;
        case 5:
          glyphScale = 30;
          glyphOffset = -6;
          break;
        case 4:
          glyphScale = 23;
          glyphOffset = -12;
          break;
        default:
          throw new _vex.Vex.RERR('ClefError', 'Invalid number of lines: ' + numLines);
      }

      this.glyph.setPoint(glyphScale);
      this.glyph.setYShift(glyphOffset);

      return this;
    }
  }, {
    key: 'draw',
    value: function draw() {
      if (!this.x) throw new _vex.Vex.RERR('ClefError', "Can't draw clef without x.");
      if (!this.stave) throw new _vex.Vex.RERR('ClefError', "Can't draw clef without stave.");
      this.setRendered();

      this.glyph.setStave(this.stave);
      this.glyph.setContext(this.stave.context);
      if (this.clef.line !== undefined) {
        this.placeGlyphOnLine(this.glyph, this.stave, this.clef.line);
      }

      this.glyph.renderToStave(this.x);

      if (this.annotation !== undefined) {
        this.placeGlyphOnLine(this.attachment, this.stave, this.annotation.line);
        this.attachment.setStave(this.stave);
        this.attachment.setContext(this.stave.context);
        this.attachment.renderToStave(this.x);
      }
    }
  }]);

  return Clef;
}(_stavemodifier.StaveModifier);