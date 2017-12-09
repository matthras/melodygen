'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StaveModifier = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _element = require('./element');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
// A base class for stave modifiers (e.g. clefs, key signatures)

var StaveModifier = exports.StaveModifier = function (_Element) {
  _inherits(StaveModifier, _Element);

  _createClass(StaveModifier, null, [{
    key: 'Position',
    get: function get() {
      return {
        LEFT: 1,
        RIGHT: 2,
        ABOVE: 3,
        BELOW: 4,
        BEGIN: 5,
        END: 6
      };
    }
  }]);

  function StaveModifier() {
    _classCallCheck(this, StaveModifier);

    var _this = _possibleConstructorReturn(this, (StaveModifier.__proto__ || Object.getPrototypeOf(StaveModifier)).call(this));

    _this.setAttribute('type', 'StaveModifier');

    _this.padding = 10;
    _this.position = StaveModifier.Position.ABOVE;
    return _this;
  }

  _createClass(StaveModifier, [{
    key: 'getPosition',
    value: function getPosition() {
      return this.position;
    }
  }, {
    key: 'setPosition',
    value: function setPosition(position) {
      this.position = position;return this;
    }
  }, {
    key: 'getStave',
    value: function getStave() {
      return this.stave;
    }
  }, {
    key: 'setStave',
    value: function setStave(stave) {
      this.stave = stave;return this;
    }
  }, {
    key: 'getWidth',
    value: function getWidth() {
      return this.width;
    }
  }, {
    key: 'setWidth',
    value: function setWidth(width) {
      this.width = width;return this;
    }
  }, {
    key: 'getX',
    value: function getX() {
      return this.x;
    }
  }, {
    key: 'setX',
    value: function setX(x) {
      this.x = x;return this;
    }
  }, {
    key: 'getCategory',
    value: function getCategory() {
      return '';
    }
  }, {
    key: 'makeSpacer',
    value: function makeSpacer(padding) {
      // TODO(0xfe): Return an instance of type `Spacer` based on `GhostNote`
      // instead of this hack.

      return {
        getContext: function getContext() {
          return true;
        },
        setStave: function setStave() {},
        renderToStave: function renderToStave() {},
        getMetrics: function getMetrics() {
          return { width: padding };
        }
      };
    }
  }, {
    key: 'placeGlyphOnLine',
    value: function placeGlyphOnLine(glyph, stave, line) {
      glyph.setYShift(stave.getYForLine(line) - stave.getYForGlyphs());
    }
  }, {
    key: 'getPadding',
    value: function getPadding(index) {
      return index !== undefined && index < 2 ? 0 : this.padding;
    }
  }, {
    key: 'setPadding',
    value: function setPadding(padding) {
      this.padding = padding;return this;
    }
  }]);

  return StaveModifier;
}(_element.Element);