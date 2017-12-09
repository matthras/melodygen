'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TickContext = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _tickable = require('./tickable');

var _fraction = require('./fraction');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
// A formatter for abstract tickable objects, such as notes, chords,
// tabs, etc.

var TickContext = exports.TickContext = function (_Tickable) {
  _inherits(TickContext, _Tickable);

  _createClass(TickContext, null, [{
    key: 'getNextContext',
    value: function getNextContext(tContext) {
      var contexts = tContext.tContexts;
      var index = contexts.indexOf(tContext);

      return contexts[index + 1];
    }
  }]);

  function TickContext() {
    _classCallCheck(this, TickContext);

    var _this = _possibleConstructorReturn(this, (TickContext.__proto__ || Object.getPrototypeOf(TickContext)).call(this));

    _this.setAttribute('type', 'TickContext');
    _this.currentTick = new _fraction.Fraction(0, 1);
    _this.maxTicks = new _fraction.Fraction(0, 1);
    _this.minTicks = null;
    _this.padding = 3; // padding on each side (width += padding * 2)
    _this.x = 0;
    _this.tickables = []; // Notes, tabs, chords, lyrics.
    _this.notePx = 0; // width of widest note in this context
    _this.extraLeftPx = 0; // Extra left pixels for modifers & displace notes
    _this.extraRightPx = 0; // Extra right pixels for modifers & displace notes
    _this.tContexts = []; // Parent array of tick contexts
    return _this;
  }

  _createClass(TickContext, [{
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
    key: 'getWidth',
    value: function getWidth() {
      return this.width + this.padding * 2;
    }
  }, {
    key: 'setPadding',
    value: function setPadding(padding) {
      this.padding = padding;return this;
    }
  }, {
    key: 'getMaxTicks',
    value: function getMaxTicks() {
      return this.maxTicks;
    }
  }, {
    key: 'getMinTicks',
    value: function getMinTicks() {
      return this.minTicks;
    }
  }, {
    key: 'getTickables',
    value: function getTickables() {
      return this.tickables;
    }
  }, {
    key: 'getCenterAlignedTickables',
    value: function getCenterAlignedTickables() {
      return this.tickables.filter(function (tickable) {
        return tickable.isCenterAligned();
      });
    }

    // Get widths context, note and left/right modifiers for formatting

  }, {
    key: 'getMetrics',
    value: function getMetrics() {
      var width = this.width,
          notePx = this.notePx,
          extraLeftPx = this.extraLeftPx,
          extraRightPx = this.extraRightPx;

      return { width: width, notePx: notePx, extraLeftPx: extraLeftPx, extraRightPx: extraRightPx };
    }
  }, {
    key: 'getCurrentTick',
    value: function getCurrentTick() {
      return this.currentTick;
    }
  }, {
    key: 'setCurrentTick',
    value: function setCurrentTick(tick) {
      this.currentTick = tick;
      this.preFormatted = false;
    }

    // ### DEPRECATED ###
    // Get left & right pixels used for modifiers. THIS METHOD IS DEPRECATED. Use
    // the getMetrics() method instead!

  }, {
    key: 'getExtraPx',
    value: function getExtraPx() {
      var left_shift = 0;
      var right_shift = 0;
      var extraLeftPx = 0;
      var extraRightPx = 0;
      for (var i = 0; i < this.tickables.length; i++) {
        extraLeftPx = Math.max(this.tickables[i].extraLeftPx || 0, extraLeftPx);
        extraRightPx = Math.max(this.tickables[i].extraRightPx || 0, extraRightPx);
        var mContext = this.tickables[i].modifierContext;
        if (mContext && mContext != null) {
          left_shift = Math.max(left_shift, mContext.state.left_shift);
          right_shift = Math.max(right_shift, mContext.state.right_shift);
        }
      }
      return {
        left: left_shift,
        right: right_shift,
        extraLeft: extraLeftPx,
        extraRight: extraRightPx
      };
    }
  }, {
    key: 'addTickable',
    value: function addTickable(tickable) {
      if (!tickable) {
        throw new _vex.Vex.RERR('BadArgument', 'Invalid tickable added.');
      }

      if (!tickable.shouldIgnoreTicks()) {
        this.ignore_ticks = false;

        var ticks = tickable.getTicks();

        if (ticks.greaterThan(this.maxTicks)) {
          this.maxTicks = ticks.clone();
        }

        if (this.minTicks == null) {
          this.minTicks = ticks.clone();
        } else if (ticks.lessThan(this.minTicks)) {
          this.minTicks = ticks.clone();
        }
      }

      tickable.setTickContext(this);
      this.tickables.push(tickable);
      this.preFormatted = false;
      return this;
    }
  }, {
    key: 'preFormat',
    value: function preFormat() {
      if (this.preFormatted) return this;

      for (var i = 0; i < this.tickables.length; ++i) {
        var tickable = this.tickables[i];
        tickable.preFormat();
        var metrics = tickable.getMetrics();

        // Maintain max extra pixels from all tickables in the context
        this.extraLeftPx = Math.max(this.extraLeftPx, metrics.extraLeftPx + metrics.modLeftPx);
        this.extraRightPx = Math.max(this.extraRightPx, metrics.extraRightPx + metrics.modRightPx);

        // Maintain the widest note for all tickables in the context
        this.notePx = Math.max(this.notePx, metrics.noteWidth);

        // Recalculate the tick context total width
        this.width = this.notePx + this.extraLeftPx + this.extraRightPx;
      }

      return this;
    }
  }, {
    key: 'postFormat',
    value: function postFormat() {
      if (this.postFormatted) return this;
      this.postFormatted = true;
      return this;
    }
  }]);

  return TickContext;
}(_tickable.Tickable);