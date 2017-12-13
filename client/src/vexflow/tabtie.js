Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TabTie = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stavetie = require('./stavetie');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // / [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
// This class implements varies types of ties between contiguous notes. The
// ties include: regular ties, hammer ons, pull offs, and slides.

var TabTie = exports.TabTie = function (_StaveTie) {
  _inherits(TabTie, _StaveTie);

  _createClass(TabTie, null, [{
    key: 'createHammeron',
    value: function createHammeron(notes) {
      return new TabTie(notes, 'H');
    }
  }, {
    key: 'createPulloff',
    value: function createPulloff(notes) {
      return new TabTie(notes, 'P');
    }
  }]);

  function TabTie(notes, text) {
    _classCallCheck(this, TabTie);

    var _this = _possibleConstructorReturn(this, (TabTie.__proto__ || Object.getPrototypeOf(TabTie)).call(this, notes, text));
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


    _this.setAttribute('type', 'TabTie');

    _this.render_options.cp1 = 9;
    _this.render_options.cp2 = 11;
    _this.render_options.y_shift = 3;

    _this.setNotes(notes);
    return _this;
  }

  _createClass(TabTie, [{
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

      if (first_note) {
        first_x_px = first_note.getTieRightX() + this.render_options.tie_spacing;
        first_ys = first_note.getYs();
      } else {
        first_x_px = last_note.getStave().getTieStartX();
        first_ys = last_note.getYs();
        this.first_indices = this.last_indices;
      }

      if (last_note) {
        last_x_px = last_note.getTieLeftX() + this.render_options.tie_spacing;
        last_ys = last_note.getYs();
      } else {
        last_x_px = first_note.getStave().getTieEndX();
        last_ys = first_note.getYs();
        this.last_indices = this.first_indices;
      }

      this.renderTie({
        first_x_px: first_x_px,
        last_x_px: last_x_px,
        first_ys: first_ys,
        last_ys: last_ys,
        direction: -1 // Tab tie's are always face up.
      });

      this.renderText(first_x_px, last_x_px);
      return true;
    }
  }]);

  return TabTie;
}(_stavetie.StaveTie);