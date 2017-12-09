'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KeySignature = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _tables = require('./tables');

var _stavemodifier = require('./stavemodifier');

var _glyph = require('./glyph');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// Author: Cyril Silverman
//
// ## Description
//
// This file implements key signatures. A key signature sits on a stave
// and indicates the notes with implicit accidentals.

var KeySignature = exports.KeySignature = function (_StaveModifier) {
  _inherits(KeySignature, _StaveModifier);

  _createClass(KeySignature, null, [{
    key: 'CATEGORY',
    get: function get() {
      return 'keysignatures';
    }

    // Space between natural and following accidental depending
    // on vertical position

  }, {
    key: 'accidentalSpacing',
    get: function get() {
      return {
        '#': {
          above: 6,
          below: 4
        },
        'b': {
          above: 4,
          below: 7
        },
        'n': {
          above: 4,
          below: 1
        },
        '##': {
          above: 6,
          below: 4
        },
        'bb': {
          above: 4,
          below: 7
        },
        'db': {
          above: 4,
          below: 7
        },
        'd': {
          above: 4,
          below: 7
        },
        'bbs': {
          above: 4,
          below: 7
        },
        '++': {
          above: 6,
          below: 4
        },
        '+': {
          above: 6,
          below: 4
        },
        '+-': {
          above: 6,
          below: 4
        },
        '++-': {
          above: 6,
          below: 4
        },
        'bs': {
          above: 4,
          below: 10
        },
        'bss': {
          above: 4,
          below: 10
        }
      };
    }

    // Create a new Key Signature based on a `key_spec`

  }]);

  function KeySignature(keySpec, cancelKeySpec, alterKeySpec) {
    _classCallCheck(this, KeySignature);

    var _this = _possibleConstructorReturn(this, (KeySignature.__proto__ || Object.getPrototypeOf(KeySignature)).call(this));

    _this.setAttribute('type', 'KeySignature');

    _this.setKeySig(keySpec, cancelKeySpec, alterKeySpec);
    _this.setPosition(_stavemodifier.StaveModifier.Position.BEGIN);
    _this.glyphFontScale = 38; // TODO(0xFE): Should this match StaveNote?
    _this.glyphs = [];
    _this.xPositions = []; // relative to this.x
    _this.paddingForced = false;
    return _this;
  }

  _createClass(KeySignature, [{
    key: 'getCategory',
    value: function getCategory() {
      return KeySignature.CATEGORY;
    }

    // Add an accidental glyph to the `KeySignature` instance which represents
    // the provided `acc`. If `nextAcc` is also provided, the appropriate
    // spacing will be included in the glyph's position

  }, {
    key: 'convertToGlyph',
    value: function convertToGlyph(acc, nextAcc) {
      var accGlyphData = _tables.Flow.accidentalCodes(acc.type);
      var glyph = new _glyph.Glyph(accGlyphData.code, this.glyphFontScale);

      // Determine spacing between current accidental and the next accidental
      var extraWidth = 1;
      if (acc.type === 'n' && nextAcc) {
        var spacing = KeySignature.accidentalSpacing[nextAcc.type];
        if (spacing) {
          var isAbove = nextAcc.line >= acc.line;
          extraWidth = isAbove ? spacing.above : spacing.below;
        }
      }

      // Place the glyph on the stave
      this.placeGlyphOnLine(glyph, this.stave, acc.line);
      this.glyphs.push(glyph);

      var xPosition = this.xPositions[this.xPositions.length - 1];
      var glyphWidth = glyph.getMetrics().width + extraWidth;
      // Store the next accidental's x position
      this.xPositions.push(xPosition + glyphWidth);
      // Expand size of key signature
      this.width += glyphWidth;
    }

    // Cancel out a key signature provided in the `spec` parameter. This will
    // place appropriate natural accidentals before the key signature.

  }, {
    key: 'cancelKey',
    value: function cancelKey(spec) {
      this.formatted = false;
      this.cancelKeySpec = spec;

      return this;
    }
  }, {
    key: 'convertToCancelAccList',
    value: function convertToCancelAccList(spec) {
      // Get the accidental list for the cancelled key signature
      var cancel_accList = _tables.Flow.keySignature(spec);

      // If the cancelled key has a different accidental type, ie: # vs b
      var different_types = this.accList.length > 0 && cancel_accList.length > 0 && cancel_accList[0].type !== this.accList[0].type;

      // Determine how many naturals needed to add
      var naturals = different_types ? cancel_accList.length : cancel_accList.length - this.accList.length;

      // Return if no naturals needed
      if (naturals < 1) return;

      // Get the line position for each natural
      var cancelled = [];
      for (var i = 0; i < naturals; i++) {
        var index = i;
        if (!different_types) {
          index = cancel_accList.length - naturals + i;
        }

        var acc = cancel_accList[index];
        cancelled.push({ type: 'n', line: acc.line });
      }

      // Combine naturals with main accidental list for the key signature
      this.accList = cancelled.concat(this.accList);
    }

    // Deprecated

  }, {
    key: 'addToStave',
    value: function addToStave(stave) {
      this.paddingForced = true;
      stave.addModifier(this);

      return this;
    }

    // Apply the accidental staff line placement based on the `clef` and
    // the  accidental `type` for the key signature ('# or 'b').

  }, {
    key: 'convertAccLines',
    value: function convertAccLines(clef, type) {
      var offset = 0.0; // if clef === "treble"
      var customLines = void 0; // when clef doesn't follow treble key sig shape

      switch (clef) {
        // Treble & Subbass both have offsets of 0, so are not included.
        case 'soprano':
          if (type === '#') customLines = [2.5, 0.5, 2, 0, 1.5, -0.5, 1];else offset = -1;
          break;
        case 'mezzo-soprano':
          if (type === 'b') customLines = [0, 2, 0.5, 2.5, 1, 3, 1.5];else offset = 1.5;
          break;
        case 'alto':
          offset = 0.5;
          break;
        case 'tenor':
          if (type === '#') customLines = [3, 1, 2.5, 0.5, 2, 0, 1.5];else offset = -0.5;
          break;
        case 'baritone-f':
        case 'baritone-c':
          if (type === 'b') customLines = [0.5, 2.5, 1, 3, 1.5, 3.5, 2];else offset = 2;
          break;
        case 'bass':
        case 'french':
          offset = 1;
          break;
        default:
          break;
      }

      // If there's a special case, assign those lines/spaces:
      var i = void 0;
      if (typeof customLines !== 'undefined') {
        for (i = 0; i < this.accList.length; ++i) {
          this.accList[i].line = customLines[i];
        }
      } else if (offset !== 0) {
        for (i = 0; i < this.accList.length; ++i) {
          this.accList[i].line += offset;
        }
      }
    }
  }, {
    key: 'getPadding',
    value: function getPadding(index) {
      if (!this.formatted) this.format();

      return this.glyphs.length === 0 || !this.paddingForced && index < 2 ? 0 : this.padding;
    }
  }, {
    key: 'getWidth',
    value: function getWidth() {
      if (!this.formatted) this.format();

      return this.width;
    }
  }, {
    key: 'setKeySig',
    value: function setKeySig(keySpec, cancelKeySpec, alterKeySpec) {
      this.formatted = false;
      this.keySpec = keySpec;
      this.cancelKeySpec = cancelKeySpec;
      this.alterKeySpec = alterKeySpec;

      return this;
    }

    // Alter the accidentals of a key spec one by one.
    // Each alteration is a new accidental that replaces the
    // original accidental (or the canceled one).

  }, {
    key: 'alterKey',
    value: function alterKey(alterKeySpec) {
      this.formatted = false;
      this.alterKeySpec = alterKeySpec;

      return this;
    }
  }, {
    key: 'convertToAlterAccList',
    value: function convertToAlterAccList(alterKeySpec) {
      var max = Math.min(alterKeySpec.length, this.accList.length);
      for (var i = 0; i < max; ++i) {
        if (alterKeySpec[i]) {
          this.accList[i].type = alterKeySpec[i];
        }
      }
    }
  }, {
    key: 'format',
    value: function format() {
      if (!this.stave) {
        throw new _vex.Vex.RERR('KeySignatureError', "Can't draw key signature without stave.");
      }

      this.width = 0;
      this.glyphs = [];
      this.xPositions = [0]; // initialize with initial x position
      this.accList = _tables.Flow.keySignature(this.keySpec);
      if (this.cancelKeySpec) {
        this.convertToCancelAccList(this.cancelKeySpec);
      }
      var firstAccidentalType = this.accList.length > 0 ? this.accList[0].type : null;
      if (this.alterKeySpec) {
        this.convertToAlterAccList(this.alterKeySpec);
      }

      if (this.accList.length > 0) {
        this.convertAccLines(this.stave.clef, firstAccidentalType);
        for (var i = 0; i < this.accList.length; ++i) {
          this.convertToGlyph(this.accList[i], this.accList[i + 1]);
        }
      }

      this.formatted = true;
    }
  }, {
    key: 'draw',
    value: function draw() {
      if (!this.x) {
        throw new _vex.Vex.RERR('KeySignatureError', "Can't draw key signature without x.");
      }

      if (!this.stave) {
        throw new _vex.Vex.RERR('KeySignatureError', "Can't draw key signature without stave.");
      }

      if (!this.formatted) this.format();
      this.setRendered();

      for (var i = 0; i < this.glyphs.length; i++) {
        var glyph = this.glyphs[i];
        var x = this.x + this.xPositions[i];
        glyph.setStave(this.stave);
        glyph.setContext(this.stave.context);
        glyph.renderToStave(x);
      }
    }
  }]);

  return KeySignature;
}(_stavemodifier.StaveModifier);