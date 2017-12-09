'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClefNote = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _boundingbox = require('./boundingbox');

var _note = require('./note');

var _clef = require('./clef');

var _glyph = require('./glyph');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// Copyright Mohit Muthanna 2010
//
// Author Taehoon Moon 2014

/** @constructor */
var ClefNote = exports.ClefNote = function (_Note) {
  _inherits(ClefNote, _Note);

  _createClass(ClefNote, null, [{
    key: 'CATEGORY',
    get: function get() {
      return 'clefnote';
    }
  }]);

  function ClefNote(type, size, annotation) {
    _classCallCheck(this, ClefNote);

    var _this = _possibleConstructorReturn(this, (ClefNote.__proto__ || Object.getPrototypeOf(ClefNote)).call(this, { duration: 'b' }));

    _this.setAttribute('type', 'ClefNote');

    _this.setType(type, size, annotation);

    // Note properties
    _this.ignore_ticks = true;
    return _this;
  }

  _createClass(ClefNote, [{
    key: 'setType',
    value: function setType(type, size, annotation) {
      this.type = type;
      this.clef_obj = new _clef.Clef(type, size, annotation);
      this.clef = this.clef_obj.clef;
      this.glyph = new _glyph.Glyph(this.clef.code, this.clef.point);
      this.setWidth(this.glyph.getMetrics().width);
      return this;
    }
  }, {
    key: 'getClef',
    value: function getClef() {
      return this.clef;
    }
  }, {
    key: 'setContext',
    value: function setContext(context) {
      this.context = context;
      this.glyph.setContext(this.context);
      return this;
    }
  }, {
    key: 'getBoundingBox',
    value: function getBoundingBox() {
      return new _boundingbox.BoundingBox(0, 0, 0, 0);
    }
  }, {
    key: 'addToModifierContext',
    value: function addToModifierContext() {
      /* overridden to ignore */
      return this;
    }
  }, {
    key: 'getCategory',
    value: function getCategory() {
      return ClefNote.CATEGORY;
    }
  }, {
    key: 'preFormat',
    value: function preFormat() {
      this.setPreFormatted(true);
      return this;
    }
  }, {
    key: 'draw',
    value: function draw() {
      if (!this.stave) throw new _vex.Vex.RERR('NoStave', "Can't draw without a stave.");

      if (!this.glyph.getContext()) {
        this.glyph.setContext(this.context);
      }

      this.setRendered();
      var abs_x = this.getAbsoluteX();

      this.glyph.setStave(this.stave);
      this.glyph.setYShift(this.stave.getYForLine(this.clef.line) - this.stave.getYForGlyphs());
      this.glyph.renderToStave(abs_x);

      // If the Vex.Flow.Clef has an annotation, such as 8va, draw it.
      if (this.clef_obj.annotation !== undefined) {
        var attachment = new _glyph.Glyph(this.clef_obj.annotation.code, this.clef_obj.annotation.point);
        if (!attachment.getContext()) {
          attachment.setContext(this.context);
        }
        attachment.setStave(this.stave);
        attachment.setYShift(this.stave.getYForLine(this.clef_obj.annotation.line) - this.stave.getYForGlyphs());
        attachment.setXShift(this.clef_obj.annotation.x_shift);
        attachment.renderToStave(abs_x);
      }
    }
  }]);

  return ClefNote;
}(_note.Note);