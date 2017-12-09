'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Articulation = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _tables = require('./tables');

var _modifier = require('./modifier');

var _glyph = require('./glyph');

var _stem = require('./stem');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// Author: Larry Kuhns.
//
// ## Description
//
// This file implements articulations and accents as modifiers that can be
// attached to notes. The complete list of articulations is available in
// `tables.js` under `Vex.Flow.articulationCodes`.
//
// See `tests/articulation_tests.js` for usage examples.

// To enable logging for this class. Set `Vex.Flow.Articulation.DEBUG` to `true`.
function L() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (Articulation.DEBUG) _vex.Vex.L('Vex.Flow.Articulation', args);
}

var _Modifier$Position = _modifier.Modifier.Position,
    ABOVE = _Modifier$Position.ABOVE,
    BELOW = _Modifier$Position.BELOW;


var roundToNearestHalf = function roundToNearestHalf(mathFn, value) {
  return mathFn(value / 0.5) * 0.5;
};

// This includes both staff and ledger lines
var isWithinLines = function isWithinLines(line, position) {
  return position === ABOVE ? line <= 5 : line >= 1;
};

var getRoundingFunction = function getRoundingFunction(line, position) {
  if (isWithinLines(line, position)) {
    if (position === ABOVE) {
      return Math.ceil;
    } else {
      return Math.floor;
    }
  } else {
    return Math.round;
  }
};

var snapLineToStaff = function snapLineToStaff(canSitBetweenLines, line, position, offsetDirection) {
  // Initially, snap to nearest staff line or space
  var snappedLine = roundToNearestHalf(getRoundingFunction(line, position), line);
  var canSnapToStaffSpace = canSitBetweenLines && isWithinLines(snappedLine, position);
  var onStaffLine = snappedLine % 1 === 0;

  if (canSnapToStaffSpace && onStaffLine) {
    var HALF_STAFF_SPACE = 0.5;
    return snappedLine + HALF_STAFF_SPACE * -offsetDirection;
  } else {
    return snappedLine;
  }
};

var getTopY = function getTopY(note, textLine) {
  var stave = note.getStave();
  var stemDirection = note.getStemDirection();

  var _note$getStemExtents = note.getStemExtents(),
      stemTipY = _note$getStemExtents.topY,
      stemBaseY = _note$getStemExtents.baseY;

  if (note.getCategory() === 'stavenotes') {
    if (note.hasStem()) {
      if (stemDirection === _stem.Stem.UP) {
        return stemTipY;
      } else {
        return stemBaseY;
      }
    } else {
      return Math.min.apply(Math, _toConsumableArray(note.getYs()));
    }
  } else if (note.getCategory() === 'tabnotes') {
    if (note.hasStem()) {
      if (stemDirection === _stem.Stem.UP) {
        return stemTipY;
      } else {
        return stave.getYForTopText(textLine);
      }
    } else {
      return stave.getYForTopText(textLine);
    }
  } else {
    throw new _vex.Vex.RERR('UnknownCategory', 'Only can get the top and bottom ys of stavenotes and tabnotes');
  }
};

var getBottomY = function getBottomY(note, textLine) {
  var stave = note.getStave();
  var stemDirection = note.getStemDirection();

  var _note$getStemExtents2 = note.getStemExtents(),
      stemTipY = _note$getStemExtents2.topY,
      stemBaseY = _note$getStemExtents2.baseY;

  if (note.getCategory() === 'stavenotes') {
    if (note.hasStem()) {
      if (stemDirection === _stem.Stem.UP) {
        return stemBaseY;
      } else {
        return stemTipY;
      }
    } else {
      return Math.max.apply(Math, _toConsumableArray(note.getYs()));
    }
  } else if (note.getCategory() === 'tabnotes') {
    if (note.hasStem()) {
      if (stemDirection === _stem.Stem.UP) {
        return stave.getYForBottomText(textLine);
      } else {
        return stemTipY;
      }
    } else {
      return stave.getYForBottomText(textLine);
    }
  } else {
    throw new _vex.Vex.RERR('UnknownCategory', 'Only can get the top and bottom ys of stavenotes and tabnotes');
  }
};

// Gets the initial offset of the articulation from the y value of the starting position.
// This is required because the top/bottom text positions already have spacing applied to
// provide a "visually pleasent" default position. However the y values provided from
// the stavenote's top/bottom do *not* have any pre-applied spacing. This function
// normalizes this asymmetry.
var getInitialOffset = function getInitialOffset(note, position) {
  var isOnStemTip = position === ABOVE && note.getStemDirection() === _stem.Stem.UP || position === BELOW && note.getStemDirection() === _stem.Stem.DOWN;

  if (note.getCategory() === 'stavenotes') {
    if (note.hasStem() && isOnStemTip) {
      return 0.5;
    } else {
      // this amount is larger than the stem-tip offset because we start from
      // the center of the notehead
      return 1;
    }
  } else {
    if (note.hasStem() && isOnStemTip) {
      return 1;
    } else {
      return 0;
    }
  }
};

var Articulation = exports.Articulation = function (_Modifier) {
  _inherits(Articulation, _Modifier);

  _createClass(Articulation, null, [{
    key: 'format',


    // FIXME:
    // Most of the complex formatting logic (ie: snapping to space) is
    // actually done in .render(). But that logic belongs in this method.
    //
    // Unfortunately, this isn't possible because, by this point, stem lengths
    // have not yet been finalized. Finalized stem lengths are required to determine the
    // initial position of any stem-side articulation.
    //
    // This indicates that all objects should have their stave set before being
    // formatted. It can't be an optional if you want accurate vertical positioning.
    // Consistently positioned articulations that play nice with other modifiers
    // won't be possible until we stop relying on render-time formatting.
    //
    // Ideally, when this function has completed, the vertical articulation positions
    // should be ready to render without further adjustment. But the current state
    // is far from this ideal.
    value: function format(articulations, state) {
      if (!articulations || articulations.length === 0) return false;

      var isAbove = function isAbove(artic) {
        return artic.getPosition() === ABOVE;
      };
      var isBelow = function isBelow(artic) {
        return artic.getPosition() === BELOW;
      };
      var margin = 0.5;
      var getIncrement = function getIncrement(articulation, line, position) {
        return roundToNearestHalf(getRoundingFunction(line, position), articulation.glyph.getMetrics().height / 10 + margin);
      };

      articulations.filter(isAbove).forEach(function (articulation) {
        articulation.setTextLine(state.top_text_line);
        state.top_text_line += getIncrement(articulation, state.top_text_line, ABOVE);
      });

      articulations.filter(isBelow).forEach(function (articulation) {
        articulation.setTextLine(state.text_line);
        state.text_line += getIncrement(articulation, state.text_line, BELOW);
      });

      var width = articulations.map(function (articulation) {
        return articulation.getWidth();
      }).reduce(function (maxWidth, articWidth) {
        return Math.max(articWidth, maxWidth);
      });

      state.left_shift += width / 2;
      state.right_shift += width / 2;
      return true;
    }
  }, {
    key: 'easyScoreHook',
    value: function easyScoreHook(_ref, note, builder) {
      var articulations = _ref.articulations;

      if (!articulations) return;

      var articNameToCode = {
        staccato: 'a.',
        tenuto: 'a-'
      };

      articulations.split(',').map(function (articString) {
        return articString.trim().split('.');
      }).map(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            name = _ref3[0],
            position = _ref3[1];

        var artic = { type: articNameToCode[name] };
        if (position) artic.position = _modifier.Modifier.PositionString[position];
        return builder.getFactory().Articulation(artic);
      }).map(function (artic) {
        return note.addModifier(0, artic);
      });
    }

    // Create a new articulation of type `type`, which is an entry in
    // `Vex.Flow.articulationCodes` in `tables.js`.

  }, {
    key: 'CATEGORY',
    get: function get() {
      return 'articulations';
    }
  }, {
    key: 'INITIAL_OFFSET',
    get: function get() {
      return -0.5;
    }
  }]);

  function Articulation(type) {
    _classCallCheck(this, Articulation);

    var _this = _possibleConstructorReturn(this, (Articulation.__proto__ || Object.getPrototypeOf(Articulation)).call(this));

    _this.setAttribute('type', 'Articulation');

    _this.note = null;
    _this.index = null;
    _this.type = type;
    _this.position = BELOW;
    _this.render_options = {
      font_scale: 38
    };

    _this.articulation = _tables.Flow.articulationCodes(_this.type);
    if (!_this.articulation) {
      throw new _vex.Vex.RERR('ArgumentError', 'Articulation not found: ' + _this.type);
    }

    _this.glyph = new _glyph.Glyph(_this.articulation.code, _this.render_options.font_scale);

    _this.setWidth(_this.glyph.getMetrics().width);
    return _this;
  }

  _createClass(Articulation, [{
    key: 'getCategory',
    value: function getCategory() {
      return Articulation.CATEGORY;
    }

    // Render articulation in position next to note.

  }, {
    key: 'draw',
    value: function draw() {
      var _ABOVE$BELOW$position;

      var note = this.note,
          index = this.index,
          position = this.position,
          glyph = this.glyph,
          canSitBetweenLines = this.articulation.between_lines,
          textLine = this.text_line,
          ctx = this.context;


      this.checkContext();

      if (!note || index == null) {
        throw new _vex.Vex.RERR('NoAttachedNote', "Can't draw Articulation without a note and index.");
      }

      this.setRendered();

      var stave = note.getStave();
      var staffSpace = stave.getSpacingBetweenLines();
      var isTab = note.getCategory() === 'tabnotes';

      // Articulations are centered over/under the note head.

      var _note$getModifierStar = note.getModifierStartXY(position, index),
          x = _note$getModifierStar.x;

      var shouldSitOutsideStaff = !canSitBetweenLines || isTab;

      var initialOffset = getInitialOffset(note, position);

      var y = (_ABOVE$BELOW$position = {}, _defineProperty(_ABOVE$BELOW$position, ABOVE, function () {
        glyph.setOrigin(0.5, 1);
        var y = getTopY(note, textLine) - (textLine + initialOffset) * staffSpace;
        return shouldSitOutsideStaff ? Math.min(stave.getYForTopText(Articulation.INITIAL_OFFSET), y) : y;
      }), _defineProperty(_ABOVE$BELOW$position, BELOW, function () {
        glyph.setOrigin(0.5, 0);
        var y = getBottomY(note, textLine) + (textLine + initialOffset) * staffSpace;
        return shouldSitOutsideStaff ? Math.max(stave.getYForBottomText(Articulation.INITIAL_OFFSET), y) : y;
      }), _ABOVE$BELOW$position)[position]();

      if (!isTab) {
        var offsetDirection = position === ABOVE ? -1 : +1;
        var noteLine = isTab ? note.positions[index].str : note.getKeyProps()[index].line;
        var distanceFromNote = (note.getYs()[index] - y) / staffSpace;
        var articLine = distanceFromNote + noteLine;
        var snappedLine = snapLineToStaff(canSitBetweenLines, articLine, position, offsetDirection);

        if (isWithinLines(snappedLine, position)) glyph.setOrigin(0.5, 0.5);

        y += Math.abs(snappedLine - articLine) * staffSpace * offsetDirection;
      }

      L('Rendering articulation at (x: ' + x + ', y: ' + y + ')');

      glyph.render(ctx, x, y);
    }
  }]);

  return Articulation;
}(_modifier.Modifier);