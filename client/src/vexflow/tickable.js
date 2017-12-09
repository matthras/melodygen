'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tickable = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _element = require('./element');

var _tables = require('./tables');

var _fraction = require('./fraction');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
// The tickable interface. Tickables are things that sit on a score and
// have a duration, i.e., they occupy space in the musical rendering dimension.

var Tickable = exports.Tickable = function (_Element) {
  _inherits(Tickable, _Element);

  function Tickable() {
    _classCallCheck(this, Tickable);

    var _this = _possibleConstructorReturn(this, (Tickable.__proto__ || Object.getPrototypeOf(Tickable)).call(this));

    _this.setAttribute('type', 'Tickable');

    // These properties represent the duration of
    // this tickable element.
    _this.ticks = new _fraction.Fraction(0, 1);
    _this.intrinsicTicks = 0;
    _this.tickMultiplier = new _fraction.Fraction(1, 1);

    _this.width = 0;
    _this.x_shift = 0; // Shift from tick context
    _this.voice = null;
    _this.tickContext = null;
    _this.modifierContext = null;
    _this.modifiers = [];
    _this.preFormatted = false;
    _this.postFormatted = false;
    _this.tuplet = null;
    _this.tupletStack = [];

    _this.align_center = false;
    _this.center_x_shift = 0; // Shift from tick context if center aligned

    // This flag tells the formatter to ignore this tickable during
    // formatting and justification. It is set by tickables such as BarNote.
    _this.ignore_ticks = false;

    // This is a space for an external formatting class or function to maintain
    // metrics.
    _this.formatterMetrics = {
      // The freedom of a tickable is the distance it can move without colliding
      // with neighboring elements. A formatter can set these values during its
      // formatting pass, which a different formatter can then use to fine tune.
      freedom: { left: 0, right: 0 },

      // The simplified rational duration of this tick as a string. It can be
      // used as an index to a map or hashtable.
      duration: '',

      // The number of formatting iterations undergone.
      iterations: 0,

      // The space in pixels allocated by this formatter, along with the mean space
      // for tickables of this duration, and the deviation from the mean.
      space: {
        used: 0,
        mean: 0,
        deviation: 0
      }
    };
    return _this;
  }

  _createClass(Tickable, [{
    key: 'reset',
    value: function reset() {
      return this;
    }
  }, {
    key: 'getTicks',
    value: function getTicks() {
      return this.ticks;
    }
  }, {
    key: 'shouldIgnoreTicks',
    value: function shouldIgnoreTicks() {
      return this.ignore_ticks;
    }
  }, {
    key: 'getWidth',
    value: function getWidth() {
      return this.width;
    }
  }, {
    key: 'getFormatterMetrics',
    value: function getFormatterMetrics() {
      return this.formatterMetrics;
    }
  }, {
    key: 'setXShift',
    value: function setXShift(x) {
      this.x_shift = x;
    }
  }, {
    key: 'getCenterXShift',
    value: function getCenterXShift() {
      if (this.isCenterAligned()) {
        return this.center_x_shift;
      }

      return 0;
    }
  }, {
    key: 'isCenterAligned',
    value: function isCenterAligned() {
      return this.align_center;
    }
  }, {
    key: 'setCenterAlignment',
    value: function setCenterAlignment(align_center) {
      this.align_center = align_center;
      return this;
    }

    // Every tickable must be associated with a voice. This allows formatters
    // and preFormatter to associate them with the right modifierContexts.

  }, {
    key: 'getVoice',
    value: function getVoice() {
      if (!this.voice) throw new _vex.Vex.RERR('NoVoice', 'Tickable has no voice.');
      return this.voice;
    }
  }, {
    key: 'setVoice',
    value: function setVoice(voice) {
      this.voice = voice;
    }
  }, {
    key: 'getTuplet',
    value: function getTuplet() {
      return this.tuplet;
    }

    /*
     * resetTuplet
     * @param tuplet -- the specific tuplet to reset
     *   if this is not provided, all tuplets are reset.
     * @returns this
     *
     * Removes any prior tuplets from the tick calculation and
     * resets the intrinsic tick value to
     */

  }, {
    key: 'resetTuplet',
    value: function resetTuplet(tuplet) {
      var noteCount = void 0;
      var notesOccupied = void 0;
      if (tuplet) {
        var i = this.tupletStack.indexOf(tuplet);
        if (i !== -1) {
          this.tupletStack.splice(i, 1);
          noteCount = tuplet.getNoteCount();
          notesOccupied = tuplet.getNotesOccupied();

          // Revert old multiplier by inverting numerator & denom.:
          this.applyTickMultiplier(noteCount, notesOccupied);
        }
        return this;
      }

      while (this.tupletStack.length) {
        tuplet = this.tupletStack.pop();
        noteCount = tuplet.getNoteCount();
        notesOccupied = tuplet.getNotesOccupied();

        // Revert old multiplier by inverting numerator & denom.:
        this.applyTickMultiplier(noteCount, notesOccupied);
      }
      return this;
    }
  }, {
    key: 'setTuplet',
    value: function setTuplet(tuplet) {
      // Attach to new tuplet

      if (tuplet) {
        this.tupletStack.push(tuplet);

        var noteCount = tuplet.getNoteCount();
        var notesOccupied = tuplet.getNotesOccupied();

        this.applyTickMultiplier(notesOccupied, noteCount);
      }

      this.tuplet = tuplet;

      return this;
    }

    /** optional, if tickable has modifiers **/

  }, {
    key: 'addToModifierContext',
    value: function addToModifierContext(mc) {
      this.modifierContext = mc;
      // Add modifiers to modifier context (if any)
      this.preFormatted = false;
    }

    /** optional, if tickable has modifiers **/

  }, {
    key: 'addModifier',
    value: function addModifier(mod) {
      this.modifiers.push(mod);
      this.preFormatted = false;
      return this;
    }
  }, {
    key: 'getModifiers',
    value: function getModifiers() {
      return this.modifiers;
    }
  }, {
    key: 'setTickContext',
    value: function setTickContext(tc) {
      this.tickContext = tc;
      this.preFormatted = false;
    }
  }, {
    key: 'preFormat',
    value: function preFormat() {
      if (this.preFormatted) return;

      this.width = 0;
      if (this.modifierContext) {
        this.modifierContext.preFormat();
        this.width += this.modifierContext.getWidth();
      }
    }
  }, {
    key: 'postFormat',
    value: function postFormat() {
      if (this.postFormatted) return this;
      this.postFormatted = true;
      return this;
    }
  }, {
    key: 'getIntrinsicTicks',
    value: function getIntrinsicTicks() {
      return this.intrinsicTicks;
    }
  }, {
    key: 'setIntrinsicTicks',
    value: function setIntrinsicTicks(intrinsicTicks) {
      this.intrinsicTicks = intrinsicTicks;
      this.ticks = this.tickMultiplier.clone().multiply(this.intrinsicTicks);
    }
  }, {
    key: 'getTickMultiplier',
    value: function getTickMultiplier() {
      return this.tickMultiplier;
    }
  }, {
    key: 'applyTickMultiplier',
    value: function applyTickMultiplier(numerator, denominator) {
      this.tickMultiplier.multiply(numerator, denominator);
      this.ticks = this.tickMultiplier.clone().multiply(this.intrinsicTicks);
    }
  }, {
    key: 'setDuration',
    value: function setDuration(duration) {
      var ticks = duration.numerator * (_tables.Flow.RESOLUTION / duration.denominator);
      this.ticks = this.tickMultiplier.clone().multiply(ticks);
      this.intrinsicTicks = this.ticks.value();
    }
  }]);

  return Tickable;
}(_element.Element);