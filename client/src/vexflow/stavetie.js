'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StaveTie = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _element = require('./element');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
// This class implements varies types of ties between contiguous notes. The
// ties include: regular ties, hammer ons, pull offs, and slides.

var StaveTie = exports.StaveTie = function (_Element) {
  _inherits(StaveTie, _Element);

  function StaveTie(notes, text) {
    _classCallCheck(this, StaveTie);

    var _this = _possibleConstructorReturn(this, (StaveTie.__proto__ || Object.getPrototypeOf(StaveTie)).call(this));
    /**
     * Notes is a struct that has:
     *
     *  {
     *    first_note: Note,
     *    last_note: Note,
     *    first_indices: [n1, n2, n3],
     *    last_indices: [n1, n2, n3]
     *  }
     *
     **/


    _this.setAttribute('type', 'StaveTie');
    _this.notes = notes;
    _this.context = null;
    _this.text = text;
    _this.direction = null;

    _this.render_options = {
      cp1: 8, // Curve control point 1
      cp2: 12, // Curve control point 2
      text_shift_x: 0,
      first_x_shift: 0,
      last_x_shift: 0,
      y_shift: 7,
      tie_spacing: 0,
      font: { family: 'Arial', size: 10, style: '' }
    };

    _this.font = _this.render_options.font;
    _this.setNotes(notes);
    return _this;
  }

  _createClass(StaveTie, [{
    key: 'setFont',
    value: function setFont(font) {
      this.font = font;return this;
    }
  }, {
    key: 'setDirection',
    value: function setDirection(direction) {
      this.direction = direction;return this;
    }

    /**
     * Set the notes to attach this tie to.
     *
     * @param {!Object} notes The notes to tie up.
     */

  }, {
    key: 'setNotes',
    value: function setNotes(notes) {
      if (!notes.first_note && !notes.last_note) {
        throw new _vex.Vex.RuntimeError('BadArguments', 'Tie needs to have either first_note or last_note set.');
      }

      if (!notes.first_indices) notes.first_indices = [0];
      if (!notes.last_indices) notes.last_indices = [0];

      if (notes.first_indices.length !== notes.last_indices.length) {
        throw new _vex.Vex.RuntimeError('BadArguments', 'Tied notes must have similar index sizes');
      }

      // Success. Lets grab 'em notes.
      this.first_note = notes.first_note;
      this.first_indices = notes.first_indices;
      this.last_note = notes.last_note;
      this.last_indices = notes.last_indices;
      return this;
    }

    /**
     * @return {boolean} Returns true if this is a partial bar.
     */

  }, {
    key: 'isPartial',
    value: function isPartial() {
      return !this.first_note || !this.last_note;
    }
  }, {
    key: 'renderTie',
    value: function renderTie(params) {
      if (params.first_ys.length === 0 || params.last_ys.length === 0) {
        throw new _vex.Vex.RERR('BadArguments', 'No Y-values to render');
      }

      var ctx = this.context;
      var cp1 = this.render_options.cp1;
      var cp2 = this.render_options.cp2;

      if (Math.abs(params.last_x_px - params.first_x_px) < 10) {
        cp1 = 2;cp2 = 8;
      }

      var first_x_shift = this.render_options.first_x_shift;
      var last_x_shift = this.render_options.last_x_shift;
      var y_shift = this.render_options.y_shift * params.direction;

      for (var i = 0; i < this.first_indices.length; ++i) {
        var cp_x = (params.last_x_px + last_x_shift + (params.first_x_px + first_x_shift)) / 2;
        var first_y_px = params.first_ys[this.first_indices[i]] + y_shift;
        var last_y_px = params.last_ys[this.last_indices[i]] + y_shift;

        if (isNaN(first_y_px) || isNaN(last_y_px)) {
          throw new _vex.Vex.RERR('BadArguments', 'Bad indices for tie rendering.');
        }

        var top_cp_y = (first_y_px + last_y_px) / 2 + cp1 * params.direction;
        var bottom_cp_y = (first_y_px + last_y_px) / 2 + cp2 * params.direction;

        ctx.beginPath();
        ctx.moveTo(params.first_x_px + first_x_shift, first_y_px);
        ctx.quadraticCurveTo(cp_x, top_cp_y, params.last_x_px + last_x_shift, last_y_px);
        ctx.quadraticCurveTo(cp_x, bottom_cp_y, params.first_x_px + first_x_shift, first_y_px);
        ctx.closePath();
        ctx.fill();
      }
    }
  }, {
    key: 'renderText',
    value: function renderText(first_x_px, last_x_px) {
      if (!this.text) return;
      var center_x = (first_x_px + last_x_px) / 2;
      center_x -= this.context.measureText(this.text).width / 2;

      this.context.save();
      this.context.setFont(this.font.family, this.font.size, this.font.style);
      this.context.fillText(this.text, center_x + this.render_options.text_shift_x, (this.first_note || this.last_note).getStave().getYForTopText() - 1);
      this.context.restore();
    }
  }, {
    key: 'draw',
    value: function draw() {
      this.checkContext();
      this.setRendered();

      var first_note = this.first_note;
      var last_note = this.last_note;

      var first_x_px = void 0;
      var last_x_px = void 0;
      var first_ys = void 0;
      var last_ys = void 0;
      var stem_direction = void 0;
      if (first_note) {
        first_x_px = first_note.getTieRightX() + this.render_options.tie_spacing;
        stem_direction = first_note.getStemDirection();
        first_ys = first_note.getYs();
      } else {
        first_x_px = last_note.getStave().getTieStartX();
        first_ys = last_note.getYs();
        this.first_indices = this.last_indices;
      }

      if (last_note) {
        last_x_px = last_note.getTieLeftX() + this.render_options.tie_spacing;
        stem_direction = last_note.getStemDirection();
        last_ys = last_note.getYs();
      } else {
        last_x_px = first_note.getStave().getTieEndX();
        last_ys = first_note.getYs();
        this.last_indices = this.first_indices;
      }

      if (this.direction) {
        stem_direction = this.direction;
      }

      this.renderTie({
        first_x_px: first_x_px,
        last_x_px: last_x_px,
        first_ys: first_ys,
        last_ys: last_ys,
        direction: stem_direction
      });

      this.renderText(first_x_px, last_x_px);
      return true;
    }
  }]);

  return StaveTie;
}(_element.Element);