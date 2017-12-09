'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Stem = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _element = require('./element');

var _tables = require('./tables');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
// This file implements the `Stem` object. Generally this object is handled
// by its parent `StemmableNote`.

// To enable logging for this class. Set `Vex.Flow.Stem.DEBUG` to `true`.
function L() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (Stem.DEBUG) _vex.Vex.L('Vex.Flow.Stem', args);
}

var Stem = exports.Stem = function (_Element) {
  _inherits(Stem, _Element);

  _createClass(Stem, null, [{
    key: 'CATEGORY',
    get: function get() {
      return 'stem';
    }

    // Stem directions

  }, {
    key: 'UP',
    get: function get() {
      return 1;
    }
  }, {
    key: 'DOWN',
    get: function get() {
      return -1;
    }

    // Theme

  }, {
    key: 'WIDTH',
    get: function get() {
      return _tables.Flow.STEM_WIDTH;
    }
  }, {
    key: 'HEIGHT',
    get: function get() {
      return _tables.Flow.STEM_HEIGHT;
    }
  }]);

  function Stem() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Stem);

    var _this = _possibleConstructorReturn(this, (Stem.__proto__ || Object.getPrototypeOf(Stem)).call(this));

    _this.setAttribute('type', 'Stem');

    // Default notehead x bounds
    _this.x_begin = options.x_begin || 0;
    _this.x_end = options.x_end || 0;

    // Y bounds for top/bottom most notehead
    _this.y_top = options.y_top || 0;
    _this.y_bottom = options.y_bottom || 0;

    // Stem top extension
    _this.stem_extension = options.stem_extension || 0;

    // Direction of the stem
    _this.stem_direction = options.stem_direction || 0;

    // Flag to override all draw calls
    _this.hide = options.hide || false;

    _this.isStemlet = options.isStemlet || false;
    _this.stemletHeight = options.stemletHeight || 0;

    // Use to adjust the rendered height without affecting
    // the results of `.getExtents()`
    _this.renderHeightAdjustment = 0;
    return _this;
  }

  // Set the x bounds for the default notehead


  _createClass(Stem, [{
    key: 'setNoteHeadXBounds',
    value: function setNoteHeadXBounds(x_begin, x_end) {
      this.x_begin = x_begin;
      this.x_end = x_end;
      return this;
    }

    // Set the direction of the stem in relation to the noteheads

  }, {
    key: 'setDirection',
    value: function setDirection(direction) {
      this.stem_direction = direction;
    }

    // Set the extension for the stem, generally for flags or beams

  }, {
    key: 'setExtension',
    value: function setExtension(ext) {
      this.stem_extension = ext;
    }
  }, {
    key: 'getExtension',
    value: function getExtension() {
      return this.stem_extension;
    }

    // The the y bounds for the top and bottom noteheads

  }, {
    key: 'setYBounds',
    value: function setYBounds(y_top, y_bottom) {
      this.y_top = y_top;
      this.y_bottom = y_bottom;
    }

    // The category of the object

  }, {
    key: 'getCategory',
    value: function getCategory() {
      return Stem.CATEGORY;
    }

    // Gets the entire height for the stem

  }, {
    key: 'getHeight',
    value: function getHeight() {
      return (this.y_bottom - this.y_top) * this.stem_direction + (Stem.HEIGHT + this.stem_extension) * this.stem_direction;
    }
  }, {
    key: 'getBoundingBox',
    value: function getBoundingBox() {
      throw new _vex.Vex.RERR('NotImplemented', 'getBoundingBox() not implemented.');
    }

    // Get the y coordinates for the very base of the stem to the top of
    // the extension

  }, {
    key: 'getExtents',
    value: function getExtents() {
      var isStemUp = this.stem_direction === Stem.UP;
      var ys = [this.y_top, this.y_bottom];
      var stemHeight = Stem.HEIGHT + this.stem_extension;
      var innerMostNoteheadY = (isStemUp ? Math.min : Math.max).apply(undefined, ys);
      var outerMostNoteheadY = (isStemUp ? Math.max : Math.min).apply(undefined, ys);
      var stemTipY = innerMostNoteheadY + stemHeight * -this.stem_direction;

      return { topY: stemTipY, baseY: outerMostNoteheadY };
    }
  }, {
    key: 'setVisibility',
    value: function setVisibility(isVisible) {
      this.hide = !isVisible;
      return this;
    }
  }, {
    key: 'setStemlet',
    value: function setStemlet(isStemlet, stemletHeight) {
      this.isStemlet = isStemlet;
      this.stemletHeight = stemletHeight;
      return this;
    }

    // Render the stem onto the canvas

  }, {
    key: 'draw',
    value: function draw() {
      this.setRendered();
      if (this.hide) return;
      var ctx = this.checkContext();

      var stem_x = void 0;
      var stem_y = void 0;
      var stem_direction = this.stem_direction;

      if (stem_direction === Stem.DOWN) {
        // Down stems are rendered to the left of the head.
        stem_x = this.x_begin;
        stem_y = this.y_top;
      } else {
        // Up stems are rendered to the right of the head.
        stem_x = this.x_end;
        stem_y = this.y_bottom;
      }

      var stemHeight = this.getHeight();

      L('Rendering stem - ', 'Top Y: ', this.y_top, 'Bottom Y: ', this.y_bottom);

      // The offset from the stem's base which is required fo satisfy the stemlet height
      var stemletYOffset = this.isStemlet ? stemHeight - this.stemletHeight * this.stem_direction : 0;

      // Draw the stem
      ctx.save();
      this.applyStyle(ctx);
      ctx.beginPath();
      ctx.setLineWidth(Stem.WIDTH);
      ctx.moveTo(stem_x, stem_y - stemletYOffset);
      ctx.lineTo(stem_x, stem_y - stemHeight - this.renderHeightAdjustment * stem_direction);
      ctx.stroke();
      ctx.restore();
    }
  }]);

  return Stem;
}(_element.Element);