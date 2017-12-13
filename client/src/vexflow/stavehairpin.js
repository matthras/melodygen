Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StaveHairpin = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _element = require('./element');

var _modifier = require('./modifier');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
// This class by Raffaele Viglianti, 2012 http://itisnotsound.wordpress.com/
//
// This class implements hairpins between notes.
// Hairpins can be either Crescendo or Descrescendo.

var StaveHairpin = exports.StaveHairpin = function (_Element) {
  _inherits(StaveHairpin, _Element);

  _createClass(StaveHairpin, null, [{
    key: 'FormatByTicksAndDraw',


    /* Helper function to convert ticks into pixels.
     * Requires a Formatter with voices joined and formatted (to
     * get pixels per tick)
     *
     * options is struct that has:
     *
     *  {
     *   height: px,
     *   y_shift: px, //vertical offset
     *   left_shift_ticks: 0, //left horizontal offset expressed in ticks
     *   right_shift_ticks: 0 // right horizontal offset expressed in ticks
     *  }
     *
     **/
    value: function FormatByTicksAndDraw(ctx, formatter, notes, type, position, options) {
      var ppt = formatter.pixelsPerTick;

      if (ppt == null) {
        throw new _vex.Vex.RuntimeError('BadArguments', 'A valid Formatter must be provide to draw offsets by ticks.');
      }

      var l_shift_px = ppt * options.left_shift_ticks;
      var r_shift_px = ppt * options.right_shift_ticks;

      var hairpin_options = {
        height: options.height,
        y_shift: options.y_shift,
        left_shift_px: l_shift_px,
        right_shift_px: r_shift_px };

      new StaveHairpin({
        first_note: notes.first_note,
        last_note: notes.last_note
      }, type).setContext(ctx).setRenderOptions(hairpin_options).setPosition(position).draw();
    }

    /**
     * Create a new hairpin from the specified notes.
     *
     * @constructor
     * @param {!Object} notes The notes to tie up.
     * @param {!Object} type The type of hairpin
     */

  }, {
    key: 'type',
    get: function get() {
      return {
        CRESC: 1,
        DECRESC: 2
      };
    }
  }]);

  function StaveHairpin(notes, type) {
    _classCallCheck(this, StaveHairpin);

    var _this = _possibleConstructorReturn(this, (StaveHairpin.__proto__ || Object.getPrototypeOf(StaveHairpin)).call(this));
    /**
     * Notes is a struct that has:
     *
     *  {
     *    first_note: Note,
     *    last_note: Note,
     *  }
     *
     **/


    _this.setAttribute('type', 'StaveHairpin');
    _this.notes = notes;
    _this.hairpin = type;
    _this.position = _modifier.Modifier.Position.BELOW;

    _this.render_options = {
      height: 10,
      y_shift: 0, // vertical offset
      left_shift_px: 0, // left horizontal offset
      right_shift_px: 0 // right horizontal offset
    };

    _this.setNotes(notes);
    return _this;
  }

  _createClass(StaveHairpin, [{
    key: 'setPosition',
    value: function setPosition(position) {
      if (position === _modifier.Modifier.Position.ABOVE || position === _modifier.Modifier.Position.BELOW) {
        this.position = position;
      }
      return this;
    }
  }, {
    key: 'setRenderOptions',
    value: function setRenderOptions(options) {
      if (options.height != null && options.y_shift != null && options.left_shift_px != null && options.right_shift_px != null) {
        this.render_options = options;
      }
      return this;
    }

    /**
     * Set the notes to attach this hairpin to.
     *
     * @param {!Object} notes The start and end notes.
     */

  }, {
    key: 'setNotes',
    value: function setNotes(notes) {
      if (!notes.first_note && !notes.last_note) {
        throw new _vex.Vex.RuntimeError('BadArguments', 'Hairpin needs to have either first_note or last_note set.');
      }

      // Success. Lets grab 'em notes.
      this.first_note = notes.first_note;
      this.last_note = notes.last_note;
      return this;
    }
  }, {
    key: 'renderHairpin',
    value: function renderHairpin(params) {
      var ctx = this.checkContext();
      var dis = this.render_options.y_shift + 20;
      var y_shift = params.first_y;

      if (this.position === _modifier.Modifier.Position.ABOVE) {
        dis = -dis + 30;
        y_shift = params.first_y - params.staff_height;
      }

      var l_shift = this.render_options.left_shift_px;
      var r_shift = this.render_options.right_shift_px;

      ctx.beginPath();

      switch (this.hairpin) {
        case StaveHairpin.type.CRESC:
          ctx.moveTo(params.last_x + r_shift, y_shift + dis);
          ctx.lineTo(params.first_x + l_shift, y_shift + this.render_options.height / 2 + dis);
          ctx.lineTo(params.last_x + r_shift, y_shift + this.render_options.height + dis);
          break;
        case StaveHairpin.type.DECRESC:
          ctx.moveTo(params.first_x + l_shift, y_shift + dis);
          ctx.lineTo(params.last_x + r_shift, y_shift + this.render_options.height / 2 + dis);
          ctx.lineTo(params.first_x + l_shift, y_shift + this.render_options.height + dis);
          break;
        default:
          // Default is NONE, so nothing to draw
          break;
      }

      ctx.stroke();
      ctx.closePath();
    }
  }, {
    key: 'draw',
    value: function draw() {
      this.checkContext();
      this.setRendered();

      var firstNote = this.first_note;
      var lastNote = this.last_note;

      var start = firstNote.getModifierStartXY(this.position, 0);
      var end = lastNote.getModifierStartXY(this.position, 0);

      this.renderHairpin({
        first_x: start.x,
        last_x: end.x,
        first_y: firstNote.getStave().y + firstNote.getStave().height,
        last_y: lastNote.getStave().y + lastNote.getStave().height,
        staff_height: firstNote.getStave().height
      });
      return true;
    }
  }]);

  return StaveHairpin;
}(_element.Element);