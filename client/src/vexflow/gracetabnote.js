Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GraceTabNote = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _tabnote = require('./tabnote');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// @author Balazs Forian-Szabo
//
// ## Description
//
// A basic implementation of grace notes
// to be rendered on a tab stave.
//
// See `tests/gracetabnote_tests.js` for usage examples.

var GraceTabNote = exports.GraceTabNote = function (_TabNote) {
  _inherits(GraceTabNote, _TabNote);

  _createClass(GraceTabNote, null, [{
    key: 'CATEGORY',
    get: function get() {
      return 'gracetabnotes';
    }
  }]);

  function GraceTabNote(note_struct) {
    _classCallCheck(this, GraceTabNote);

    var _this = _possibleConstructorReturn(this, (GraceTabNote.__proto__ || Object.getPrototypeOf(GraceTabNote)).call(this, note_struct, false));

    _this.setAttribute('type', 'GraceTabNote');

    _vex.Vex.Merge(_this.render_options, {
      // vertical shift from stave line
      y_shift: 0.3,
      // grace glyph scale
      scale: 0.6,
      // grace tablature font
      font: '7.5pt Arial'
    });

    _this.updateWidth();
    return _this;
  }

  _createClass(GraceTabNote, [{
    key: 'getCategory',
    value: function getCategory() {
      return GraceTabNote.CATEGORY;
    }
  }, {
    key: 'draw',
    value: function draw() {
      _get(GraceTabNote.prototype.__proto__ || Object.getPrototypeOf(GraceTabNote.prototype), 'draw', this).call(this);
      this.setRendered();
    }
  }]);

  return GraceTabNote;
}(_tabnote.TabNote);