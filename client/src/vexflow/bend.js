'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bend = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _tables = require('./tables');

var _modifier = require('./modifier');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
//
// This file implements tablature bends.

/**
   @param text Text for bend ("Full", "Half", etc.) (DEPRECATED)
   @param release If true, render a release. (DEPRECATED)
   @param phrase If set, ignore "text" and "release", and use the more
                 sophisticated phrase specified.

   Example of a phrase:

     [{
       type: UP,
       text: "whole"
       width: 8;
     },
     {
       type: DOWN,
       text: "whole"
       width: 8;
     },
     {
       type: UP,
       text: "half"
       width: 8;
     },
     {
       type: UP,
       text: "whole"
       width: 8;
     },
     {
       type: DOWN,
       text: "1 1/2"
       width: 8;
     }]
 */
var Bend = exports.Bend = function (_Modifier) {
  _inherits(Bend, _Modifier);

  _createClass(Bend, null, [{
    key: 'format',


    // ## Static Methods
    // Arrange bends in `ModifierContext`
    value: function format(bends, state) {
      if (!bends || bends.length === 0) return false;

      var last_width = 0;
      // Bends are always on top.
      var text_line = state.top_text_line;

      // Format Bends
      for (var i = 0; i < bends.length; ++i) {
        var bend = bends[i];
        bend.setXShift(last_width);
        last_width = bend.getWidth();
        bend.setTextLine(text_line);
      }

      state.right_shift += last_width;
      state.top_text_line += 1;
      return true;
    }

    // ## Prototype Methods

  }, {
    key: 'CATEGORY',
    get: function get() {
      return 'bends';
    }
  }, {
    key: 'UP',
    get: function get() {
      return 0;
    }
  }, {
    key: 'DOWN',
    get: function get() {
      return 1;
    }
  }]);

  function Bend(text, release, phrase) {
    _classCallCheck(this, Bend);

    var _this = _possibleConstructorReturn(this, (Bend.__proto__ || Object.getPrototypeOf(Bend)).call(this));

    _this.setAttribute('type', 'Bend');

    _this.text = text;
    _this.x_shift = 0;
    _this.release = release || false;
    _this.font = '10pt Arial';
    _this.render_options = {
      line_width: 1.5,
      line_style: '#777777',
      bend_width: 8,
      release_width: 8
    };

    if (phrase) {
      _this.phrase = phrase;
    } else {
      // Backward compatibility
      _this.phrase = [{ type: Bend.UP, text: _this.text }];
      if (_this.release) _this.phrase.push({ type: Bend.DOWN, text: '' });
    }

    _this.updateWidth();
    return _this;
  }

  _createClass(Bend, [{
    key: 'getCategory',
    value: function getCategory() {
      return Bend.CATEGORY;
    }
  }, {
    key: 'setXShift',
    value: function setXShift(value) {
      this.x_shift = value;
      this.updateWidth();
    }
  }, {
    key: 'setFont',
    value: function setFont(font) {
      this.font = font;return this;
    }
  }, {
    key: 'getText',
    value: function getText() {
      return this.text;
    }
  }, {
    key: 'updateWidth',
    value: function updateWidth() {
      var that = this;

      function measure_text(text) {
        var text_width = void 0;
        if (that.context) {
          text_width = that.context.measureText(text).width;
        } else {
          text_width = _tables.Flow.textWidth(text);
        }

        return text_width;
      }

      var total_width = 0;
      for (var i = 0; i < this.phrase.length; ++i) {
        var bend = this.phrase[i];
        if ('width' in bend) {
          total_width += bend.width;
        } else {
          var additional_width = bend.type === Bend.UP ? this.render_options.bend_width : this.render_options.release_width;

          bend.width = _vex.Vex.Max(additional_width, measure_text(bend.text)) + 3;
          bend.draw_width = bend.width / 2;
          total_width += bend.width;
        }
      }

      this.setWidth(total_width + this.x_shift);
      return this;
    }
  }, {
    key: 'draw',
    value: function draw() {
      this.checkContext();
      if (!(this.note && this.index != null)) {
        throw new _vex.Vex.RERR('NoNoteForBend', "Can't draw bend without a note or index.");
      }

      this.setRendered();

      var start = this.note.getModifierStartXY(_modifier.Modifier.Position.RIGHT, this.index);
      start.x += 3;
      start.y += 0.5;
      var x_shift = this.x_shift;

      var ctx = this.context;
      var bend_height = this.note.getStave().getYForTopText(this.text_line) + 3;
      var annotation_y = this.note.getStave().getYForTopText(this.text_line) - 1;
      var that = this;

      function renderBend(x, y, width, height) {
        var cp_x = x + width;
        var cp_y = y;

        ctx.save();
        ctx.beginPath();
        ctx.setLineWidth(that.render_options.line_width);
        ctx.setStrokeStyle(that.render_options.line_style);
        ctx.setFillStyle(that.render_options.line_style);
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(cp_x, cp_y, x + width, height);
        ctx.stroke();
        ctx.restore();
      }

      function renderRelease(x, y, width, height) {
        ctx.save();
        ctx.beginPath();
        ctx.setLineWidth(that.render_options.line_width);
        ctx.setStrokeStyle(that.render_options.line_style);
        ctx.setFillStyle(that.render_options.line_style);
        ctx.moveTo(x, height);
        ctx.quadraticCurveTo(x + width, height, x + width, y);
        ctx.stroke();
        ctx.restore();
      }

      function renderArrowHead(x, y, direction) {
        var width = 4;
        var dir = direction || 1;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - width, y + width * dir);
        ctx.lineTo(x + width, y + width * dir);
        ctx.closePath();
        ctx.fill();
      }

      function renderText(x, text) {
        ctx.save();
        ctx.setRawFont(that.font);
        var render_x = x - ctx.measureText(text).width / 2;
        ctx.fillText(text, render_x, annotation_y);
        ctx.restore();
      }

      var last_bend = null;
      var last_drawn_width = 0;
      for (var i = 0; i < this.phrase.length; ++i) {
        var bend = this.phrase[i];
        if (i === 0) bend.draw_width += x_shift;

        last_drawn_width = bend.draw_width + (last_bend ? last_bend.draw_width : 0) - (i === 1 ? x_shift : 0);
        if (bend.type === Bend.UP) {
          if (last_bend && last_bend.type === Bend.UP) {
            renderArrowHead(start.x, bend_height);
          }

          renderBend(start.x, start.y, last_drawn_width, bend_height);
        }

        if (bend.type === Bend.DOWN) {
          if (last_bend && last_bend.type === Bend.UP) {
            renderRelease(start.x, start.y, last_drawn_width, bend_height);
          }

          if (last_bend && last_bend.type === Bend.DOWN) {
            renderArrowHead(start.x, start.y, -1);
            renderRelease(start.x, start.y, last_drawn_width, bend_height);
          }

          if (last_bend === null) {
            last_drawn_width = bend.draw_width;
            renderRelease(start.x, start.y, last_drawn_width, bend_height);
          }
        }

        renderText(start.x + last_drawn_width, bend.text);
        last_bend = bend;
        last_bend.x = start.x;

        start.x += last_drawn_width;
      }

      // Final arrowhead and text
      if (last_bend.type === Bend.UP) {
        renderArrowHead(last_bend.x + last_drawn_width, bend_height);
      } else if (last_bend.type === Bend.DOWN) {
        renderArrowHead(last_bend.x + last_drawn_width, start.y, -1);
      }
    }
  }]);

  return Bend;
}(_modifier.Modifier);