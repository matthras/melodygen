Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Voice = undefined;

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
//
// This file implements the main Voice class. It's mainly a container
// object to group `Tickables` for formatting.

var Voice = exports.Voice = function (_Element) {
  _inherits(Voice, _Element);

  _createClass(Voice, null, [{
    key: 'Mode',

    // Modes allow the addition of ticks in three different ways:
    //
    // STRICT: This is the default. Ticks must fill the voice.
    // SOFT:   Ticks can be added without restrictions.
    // FULL:   Ticks do not need to fill the voice, but can't exceed the maximum
    //         tick length.
    get: function get() {
      return {
        STRICT: 1,
        SOFT: 2,
        FULL: 3
      };
    }
  }]);

  function Voice(time) {
    _classCallCheck(this, Voice);

    var _this = _possibleConstructorReturn(this, (Voice.__proto__ || Object.getPrototypeOf(Voice)).call(this));

    _this.setAttribute('type', 'Voice');

    // Time signature shortcut: "4/4", "3/8", etc.
    if (typeof time === 'string') {
      var match = time.match(/(\d+)\/(\d+)/);
      if (match) {
        time = {
          num_beats: match[1],
          beat_value: match[2],
          resolution: _tables.Flow.RESOLUTION
        };
      }
    }

    // Default time sig is 4/4
    _this.time = _vex.Vex.Merge({
      num_beats: 4,
      beat_value: 4,
      resolution: _tables.Flow.RESOLUTION
    }, time);

    // Recalculate total ticks.
    _this.totalTicks = new _fraction.Fraction(_this.time.num_beats * (_this.time.resolution / _this.time.beat_value), 1);

    _this.resolutionMultiplier = 1;

    // Set defaults
    _this.tickables = [];
    _this.ticksUsed = new _fraction.Fraction(0, 1);
    _this.smallestTickCount = _this.totalTicks.clone();
    _this.largestTickWidth = 0;
    _this.stave = null;
    // Do we care about strictly timed notes
    _this.mode = Voice.Mode.STRICT;

    // This must belong to a VoiceGroup
    _this.voiceGroup = null;
    return _this;
  }

  // Get the total ticks in the voice


  _createClass(Voice, [{
    key: 'getTotalTicks',
    value: function getTotalTicks() {
      return this.totalTicks;
    }

    // Get the total ticks used in the voice by all the tickables

  }, {
    key: 'getTicksUsed',
    value: function getTicksUsed() {
      return this.ticksUsed;
    }

    // Get the largest width of all the tickables

  }, {
    key: 'getLargestTickWidth',
    value: function getLargestTickWidth() {
      return this.largestTickWidth;
    }

    // Get the tick count for the shortest tickable

  }, {
    key: 'getSmallestTickCount',
    value: function getSmallestTickCount() {
      return this.smallestTickCount;
    }

    // Get the tickables in the voice

  }, {
    key: 'getTickables',
    value: function getTickables() {
      return this.tickables;
    }

    // Get/set the voice mode, use a value from `Voice.Mode`

  }, {
    key: 'getMode',
    value: function getMode() {
      return this.mode;
    }
  }, {
    key: 'setMode',
    value: function setMode(mode) {
      this.mode = mode;return this;
    }

    // Get the resolution multiplier for the voice

  }, {
    key: 'getResolutionMultiplier',
    value: function getResolutionMultiplier() {
      return this.resolutionMultiplier;
    }

    // Get the actual tick resolution for the voice

  }, {
    key: 'getActualResolution',
    value: function getActualResolution() {
      return this.resolutionMultiplier * this.time.resolution;
    }

    // Set the voice's stave

  }, {
    key: 'setStave',
    value: function setStave(stave) {
      this.stave = stave;
      this.boundingBox = null; // Reset bounding box so we can reformat
      return this;
    }

    // Get the bounding box for the voice

  }, {
    key: 'getBoundingBox',
    value: function getBoundingBox() {
      var stave = void 0;
      var boundingBox = void 0;
      var bb = void 0;
      var i = void 0;

      if (!this.boundingBox) {
        if (!this.stave) throw new _vex.Vex.RERR('NoStave', "Can't get bounding box without stave.");
        stave = this.stave;
        boundingBox = null;

        for (i = 0; i < this.tickables.length; ++i) {
          this.tickables[i].setStave(stave);

          bb = this.tickables[i].getBoundingBox();
          if (!bb) continue;

          boundingBox = boundingBox ? boundingBox.mergeWith(bb) : bb;
        }

        this.boundingBox = boundingBox;
      }
      return this.boundingBox;
    }

    // Every tickable must be associated with a voiceGroup. This allows formatters
    // and preformatters to associate them with the right modifierContexts.

  }, {
    key: 'getVoiceGroup',
    value: function getVoiceGroup() {
      if (!this.voiceGroup) {
        throw new _vex.Vex.RERR('NoVoiceGroup', 'No voice group for voice.');
      }

      return this.voiceGroup;
    }

    // Set the voice group

  }, {
    key: 'setVoiceGroup',
    value: function setVoiceGroup(g) {
      this.voiceGroup = g;return this;
    }

    // Set the voice mode to strict or soft

  }, {
    key: 'setStrict',
    value: function setStrict(strict) {
      this.mode = strict ? Voice.Mode.STRICT : Voice.Mode.SOFT;
      return this;
    }

    // Determine if the voice is complete according to the voice mode

  }, {
    key: 'isComplete',
    value: function isComplete() {
      if (this.mode === Voice.Mode.STRICT || this.mode === Voice.Mode.FULL) {
        return this.ticksUsed.equals(this.totalTicks);
      } else {
        return true;
      }
    }

    // Add a tickable to the voice

  }, {
    key: 'addTickable',
    value: function addTickable(tickable) {
      if (!tickable.shouldIgnoreTicks()) {
        var ticks = tickable.getTicks();

        // Update the total ticks for this line.
        this.ticksUsed.add(ticks);

        if ((this.mode === Voice.Mode.STRICT || this.mode === Voice.Mode.FULL) && this.ticksUsed.greaterThan(this.totalTicks)) {
          this.totalTicks.subtract(ticks);
          throw new _vex.Vex.RERR('BadArgument', 'Too many ticks.');
        }

        // Track the smallest tickable for formatting.
        if (ticks.lessThan(this.smallestTickCount)) {
          this.smallestTickCount = ticks.clone();
        }

        this.resolutionMultiplier = this.ticksUsed.denominator;

        // Expand total ticks using denominator from ticks used.
        this.totalTicks.add(0, this.ticksUsed.denominator);
      }

      // Add the tickable to the line.
      this.tickables.push(tickable);
      tickable.setVoice(this);
      return this;
    }

    // Add an array of tickables to the voice.

  }, {
    key: 'addTickables',
    value: function addTickables(tickables) {
      for (var i = 0; i < tickables.length; ++i) {
        this.addTickable(tickables[i]);
      }

      return this;
    }

    // Preformats the voice by applying the voice's stave to each note.

  }, {
    key: 'preFormat',
    value: function preFormat() {
      var _this2 = this;

      if (this.preFormatted) return this;

      this.tickables.forEach(function (tickable) {
        if (!tickable.getStave()) {
          tickable.setStave(_this2.stave);
        }
      });

      this.preFormatted = true;
      return this;
    }

    // Render the voice onto the canvas `context` and an optional `stave`.
    // If `stave` is omitted, it is expected that the notes have staves
    // already set.

  }, {
    key: 'draw',
    value: function draw() {
      var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.context;
      var stave = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.stave;

      this.setRendered();
      var boundingBox = null;
      for (var i = 0; i < this.tickables.length; ++i) {
        var tickable = this.tickables[i];

        // Set the stave if provided
        if (stave) tickable.setStave(stave);

        if (!tickable.getStave()) {
          throw new _vex.Vex.RuntimeError('MissingStave', 'The voice cannot draw tickables without staves.');
        }

        if (i === 0) boundingBox = tickable.getBoundingBox();

        if (i > 0 && boundingBox) {
          var tickable_bb = tickable.getBoundingBox();
          if (tickable_bb) boundingBox.mergeWith(tickable_bb);
        }

        tickable.setContext(context);
        tickable.draw();
      }

      this.boundingBox = boundingBox;
    }
  }]);

  return Voice;
}(_element.Element);