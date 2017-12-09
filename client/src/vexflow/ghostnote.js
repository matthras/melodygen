'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GhostNote = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _vex = require('./vex');

var _stemmablenote = require('./stemmablenote');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description

var GhostNote = exports.GhostNote = function (_StemmableNote) {
  _inherits(GhostNote, _StemmableNote);

  /** @constructor */
  function GhostNote(parameter) {
    _classCallCheck(this, GhostNote);

    // Sanity check
    if (!parameter) {
      throw new _vex.Vex.RuntimeError('BadArguments', 'Ghost note must have valid initialization data to identify ' + 'duration.');
    }

    var note_struct = void 0;

    // Preserve backwards-compatibility
    if (typeof parameter === 'string') {
      note_struct = { duration: parameter };
    } else if ((typeof parameter === 'undefined' ? 'undefined' : _typeof(parameter)) === 'object') {
      note_struct = parameter;
    } else {
      throw new _vex.Vex.RuntimeError('BadArguments', 'Ghost note must have valid initialization data to identify ' + 'duration.');
    }

    var _this = _possibleConstructorReturn(this, (GhostNote.__proto__ || Object.getPrototypeOf(GhostNote)).call(this, note_struct));

    _this.setAttribute('type', 'GhostNote');

    // Note properties
    _this.setWidth(0);
    return _this;
  }

  _createClass(GhostNote, [{
    key: 'isRest',
    value: function isRest() {
      return true;
    }
  }, {
    key: 'setStave',
    value: function setStave(stave) {
      _get(GhostNote.prototype.__proto__ || Object.getPrototypeOf(GhostNote.prototype), 'setStave', this).call(this, stave);
    }
  }, {
    key: 'addToModifierContext',
    value: function addToModifierContext() {
      /* intentionally overridden */return this;
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

      // Draw the modifiers
      this.setRendered();
      for (var i = 0; i < this.modifiers.length; ++i) {
        var modifier = this.modifiers[i];
        modifier.setContext(this.context);
        modifier.draw();
      }
    }
  }]);

  return GhostNote;
}(_stemmablenote.StemmableNote);