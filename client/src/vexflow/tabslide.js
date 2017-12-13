Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TabSlide = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _tabtie = require('./tabtie');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
// This class implements varies types of ties between contiguous notes. The
// ties include: regular ties, hammer ons, pull offs, and slides.

var TabSlide = exports.TabSlide = function (_TabTie) {
  _inherits(TabSlide, _TabTie);

  _createClass(TabSlide, null, [{
    key: 'createSlideUp',
    value: function createSlideUp(notes) {
      return new TabSlide(notes, TabSlide.SLIDE_UP);
    }
  }, {
    key: 'createSlideDown',
    value: function createSlideDown(notes) {
      return new TabSlide(notes, TabSlide.SLIDE_DOWN);
    }
  }, {
    key: 'SLIDE_UP',
    get: function get() {
      return 1;
    }
  }, {
    key: 'SLIDE_DOWN',
    get: function get() {
      return -1;
    }
  }]);

  function TabSlide(notes, direction) {
    _classCallCheck(this, TabSlide);

    var _this = _possibleConstructorReturn(this, (TabSlide.__proto__ || Object.getPrototypeOf(TabSlide)).call(this, notes, 'sl.'));
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


    _this.setAttribute('type', 'TabSlide');

    if (!direction) {
      var first_fret = notes.first_note.getPositions()[0].fret;
      var last_fret = notes.last_note.getPositions()[0].fret;

      direction = parseInt(first_fret, 10) > parseInt(last_fret, 10) ? TabSlide.SLIDE_DOWN : TabSlide.SLIDE_UP;
    }

    _this.slide_direction = direction;
    _this.render_options.cp1 = 11;
    _this.render_options.cp2 = 14;
    _this.render_options.y_shift = 0.5;

    _this.setFont({ font: 'Times', size: 10, style: 'bold italic' });
    _this.setNotes(notes);
    return _this;
  }

  _createClass(TabSlide, [{
    key: 'renderTie',
    value: function renderTie(params) {
      if (params.first_ys.length === 0 || params.last_ys.length === 0) {
        throw new _vex.Vex.RERR('BadArguments', 'No Y-values to render');
      }

      var ctx = this.context;
      var first_x_px = params.first_x_px;
      var first_ys = params.first_ys;
      var last_x_px = params.last_x_px;

      var direction = this.slide_direction;
      if (direction !== TabSlide.SLIDE_UP && direction !== TabSlide.SLIDE_DOWN) {
        throw new _vex.Vex.RERR('BadSlide', 'Invalid slide direction');
      }

      for (var i = 0; i < this.first_indices.length; ++i) {
        var slide_y = first_ys[this.first_indices[i]] + this.render_options.y_shift;

        if (isNaN(slide_y)) {
          throw new _vex.Vex.RERR('BadArguments', 'Bad indices for slide rendering.');
        }

        ctx.beginPath();
        ctx.moveTo(first_x_px, slide_y + 3 * direction);
        ctx.lineTo(last_x_px, slide_y - 3 * direction);
        ctx.closePath();
        ctx.stroke();
      }

      this.setRendered();
    }
  }]);

  return TabSlide;
}(_tabtie.TabTie);