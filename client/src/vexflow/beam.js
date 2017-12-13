Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Beam = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _tables = require('./tables');

var _element = require('./element');

var _fraction = require('./fraction');

var _tuplet = require('./tuplet');

var _stem = require('./stem');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
//
// This file implements `Beams` that span over a set of `StemmableNotes`.

function calculateStemDirection(notes) {
  var lineSum = 0;
  notes.forEach(function (note) {
    if (note.keyProps) {
      note.keyProps.forEach(function (keyProp) {
        lineSum += keyProp.line - 3;
      });
    }
  });

  if (lineSum >= 0) {
    return _stem.Stem.DOWN;
  }
  return _stem.Stem.UP;
}

var getStemSlope = function getStemSlope(firstNote, lastNote) {
  var firstStemTipY = firstNote.getStemExtents().topY;
  var firstStemX = firstNote.getStemX();
  var lastStemTipY = lastNote.getStemExtents().topY;
  var lastStemX = lastNote.getStemX();
  return (lastStemTipY - firstStemTipY) / (lastStemX - firstStemX);
};

var Beam = exports.Beam = function (_Element) {
  _inherits(Beam, _Element);

  _createClass(Beam, null, [{
    key: 'getDefaultBeamGroups',

    // Gets the default beam groups for a provided time signature.
    // Attempts to guess if the time signature is not found in table.
    // Currently this is fairly naive.
    value: function getDefaultBeamGroups(time_sig) {
      if (!time_sig || time_sig === 'c') {
        time_sig = '4/4';
      }

      var defaults = {
        '1/2': ['1/2'],
        '2/2': ['1/2'],
        '3/2': ['1/2'],
        '4/2': ['1/2'],

        '1/4': ['1/4'],
        '2/4': ['1/4'],
        '3/4': ['1/4'],
        '4/4': ['1/4'],

        '1/8': ['1/8'],
        '2/8': ['2/8'],
        '3/8': ['3/8'],
        '4/8': ['2/8'],

        '1/16': ['1/16'],
        '2/16': ['2/16'],
        '3/16': ['3/16'],
        '4/16': ['2/16']
      };

      var groups = defaults[time_sig];

      if (groups === undefined) {
        // If no beam groups found, naively determine
        // the beam groupings from the time signature
        var beatTotal = parseInt(time_sig.split('/')[0], 10);
        var beatValue = parseInt(time_sig.split('/')[1], 10);

        var tripleMeter = beatTotal % 3 === 0;

        if (tripleMeter) {
          return [new _fraction.Fraction(3, beatValue)];
        } else if (beatValue > 4) {
          return [new _fraction.Fraction(2, beatValue)];
        } else if (beatValue <= 4) {
          return [new _fraction.Fraction(1, beatValue)];
        }
      } else {
        return groups.map(function (group) {
          return new _fraction.Fraction().parse(group);
        });
      }

      return [new _fraction.Fraction(1, 4)];
    }

    // A helper function to automatically build basic beams for a voice. For more
    // complex auto-beaming use `Beam.generateBeams()`.
    //
    // Parameters:
    // * `voice` - The voice to generate the beams for
    // * `stem_direction` - A stem direction to apply to the entire voice
    // * `groups` - An array of `Fraction` representing beat groupings for the beam

  }, {
    key: 'applyAndGetBeams',
    value: function applyAndGetBeams(voice, stem_direction, groups) {
      return Beam.generateBeams(voice.getTickables(), {
        groups: groups,
        stem_direction: stem_direction
      });
    }

    // A helper function to autimatically build beams for a voice with
    // configuration options.
    //
    // Example configuration object:
    //
    // ```
    // config = {
    //   groups: [new Vex.Flow.Fraction(2, 8)],
    //   stem_direction: -1,
    //   beam_rests: true,
    //   beam_middle_only: true,
    //   show_stemlets: false
    // };
    // ```
    //
    // Parameters:
    // * `notes` - An array of notes to create the beams for
    // * `config` - The configuration object
    //    * `groups` - Array of `Fractions` that represent the beat structure to beam the notes
    //    * `stem_direction` - Set to apply the same direction to all notes
    //    * `beam_rests` - Set to `true` to include rests in the beams
    //    * `beam_middle_only` - Set to `true` to only beam rests in the middle of the beat
    //    * `show_stemlets` - Set to `true` to draw stemlets for rests
    //    * `maintain_stem_directions` - Set to `true` to not apply new stem directions
    //

  }, {
    key: 'generateBeams',
    value: function generateBeams(notes, config) {
      if (!config) config = {};

      if (!config.groups || !config.groups.length) {
        config.groups = [new _fraction.Fraction(2, 8)];
      }

      // Convert beam groups to tick amounts
      var tickGroups = config.groups.map(function (group) {
        if (!group.multiply) {
          throw new _vex.Vex.RuntimeError('InvalidBeamGroups', 'The beam groups must be an array of Vex.Flow.Fractions');
        }
        return group.clone().multiply(_tables.Flow.RESOLUTION, 1);
      });

      var unprocessedNotes = notes;
      var currentTickGroup = 0;
      var noteGroups = [];
      var currentGroup = [];

      function getTotalTicks(vf_notes) {
        return vf_notes.reduce(function (memo, note) {
          return note.getTicks().clone().add(memo);
        }, new _fraction.Fraction(0, 1));
      }

      function nextTickGroup() {
        if (tickGroups.length - 1 > currentTickGroup) {
          currentTickGroup += 1;
        } else {
          currentTickGroup = 0;
        }
      }

      function createGroups() {
        var nextGroup = [];

        unprocessedNotes.forEach(function (unprocessedNote) {
          nextGroup = [];
          if (unprocessedNote.shouldIgnoreTicks()) {
            noteGroups.push(currentGroup);
            currentGroup = nextGroup;
            return; // Ignore untickables (like bar notes)
          }

          currentGroup.push(unprocessedNote);
          var ticksPerGroup = tickGroups[currentTickGroup].clone();
          var totalTicks = getTotalTicks(currentGroup);

          // Double the amount of ticks in a group, if it's an unbeamable tuplet
          var unbeamable = _tables.Flow.durationToNumber(unprocessedNote.duration) < 8;
          if (unbeamable && unprocessedNote.tuplet) {
            ticksPerGroup.numerator *= 2;
          }

          // If the note that was just added overflows the group tick total
          if (totalTicks.greaterThan(ticksPerGroup)) {
            // If the overflow note can be beamed, start the next group
            // with it. Unbeamable notes leave the group overflowed.
            if (!unbeamable) {
              nextGroup.push(currentGroup.pop());
            }
            noteGroups.push(currentGroup);
            currentGroup = nextGroup;
            nextTickGroup();
          } else if (totalTicks.equals(ticksPerGroup)) {
            noteGroups.push(currentGroup);
            currentGroup = nextGroup;
            nextTickGroup();
          }
        });

        // Adds any remainder notes
        if (currentGroup.length > 0) {
          noteGroups.push(currentGroup);
        }
      }

      function getBeamGroups() {
        return noteGroups.filter(function (group) {
          if (group.length > 1) {
            var beamable = true;
            group.forEach(function (note) {
              if (note.getIntrinsicTicks() >= _tables.Flow.durationToTicks('4')) {
                beamable = false;
              }
            });
            return beamable;
          }
          return false;
        });
      }

      // Splits up groups by Rest
      function sanitizeGroups() {
        var sanitizedGroups = [];
        noteGroups.forEach(function (group) {
          var tempGroup = [];
          group.forEach(function (note, index, group) {
            var isFirstOrLast = index === 0 || index === group.length - 1;
            var prevNote = group[index - 1];

            var breaksOnEachRest = !config.beam_rests && note.isRest();
            var breaksOnFirstOrLastRest = config.beam_rests && config.beam_middle_only && note.isRest() && isFirstOrLast;

            var breakOnStemChange = false;
            if (config.maintain_stem_directions && prevNote && !note.isRest() && !prevNote.isRest()) {
              var prevDirection = prevNote.getStemDirection();
              var currentDirection = note.getStemDirection();
              breakOnStemChange = currentDirection !== prevDirection;
            }

            var isUnbeamableDuration = parseInt(note.duration, 10) < 8;

            // Determine if the group should be broken at this note
            var shouldBreak = breaksOnEachRest || breaksOnFirstOrLastRest || breakOnStemChange || isUnbeamableDuration;

            if (shouldBreak) {
              // Add current group
              if (tempGroup.length > 0) {
                sanitizedGroups.push(tempGroup);
              }

              // Start a new group. Include the current note if the group
              // was broken up by stem direction, as that note needs to start
              // the next group of notes
              tempGroup = breakOnStemChange ? [note] : [];
            } else {
              // Add note to group
              tempGroup.push(note);
            }
          });

          // If there is a remaining group, add it as well
          if (tempGroup.length > 0) {
            sanitizedGroups.push(tempGroup);
          }
        });

        noteGroups = sanitizedGroups;
      }

      function formatStems() {
        noteGroups.forEach(function (group) {
          var stemDirection = void 0;
          if (config.maintain_stem_directions) {
            var _note = findFirstNote(group);
            stemDirection = _note ? _note.getStemDirection() : _stem.Stem.UP;
          } else {
            if (config.stem_direction) {
              stemDirection = config.stem_direction;
            } else {
              stemDirection = calculateStemDirection(group);
            }
          }
          applyStemDirection(group, stemDirection);
        });
      }

      function findFirstNote(group) {
        for (var _i = 0; _i < group.length; _i++) {
          var _note2 = group[_i];
          if (!_note2.isRest()) {
            return _note2;
          }
        }

        return false;
      }

      function applyStemDirection(group, direction) {
        group.forEach(function (note) {
          note.setStemDirection(direction);
        });
      }

      // Get all of the tuplets in all of the note groups
      function getTuplets() {
        var uniqueTuplets = [];

        // Go through all of the note groups and inspect for tuplets
        noteGroups.forEach(function (group) {
          var tuplet = null;
          group.forEach(function (note) {
            if (note.tuplet && tuplet !== note.tuplet) {
              tuplet = note.tuplet;
              uniqueTuplets.push(tuplet);
            }
          });
        });
        return uniqueTuplets;
      }

      // Using closures to store the variables throughout the various functions
      // IMO Keeps it this process lot cleaner - but not super consistent with
      // the rest of the API's style - Silverwolf90 (Cyril)
      createGroups();
      sanitizeGroups();
      formatStems();

      // Get the notes to be beamed
      var beamedNoteGroups = getBeamGroups();

      // Get the tuplets in order to format them accurately
      var allTuplets = getTuplets();

      // Create a Vex.Flow.Beam from each group of notes to be beamed
      var beams = [];
      beamedNoteGroups.forEach(function (group) {
        var beam = new Beam(group);

        if (config.show_stemlets) {
          beam.render_options.show_stemlets = true;
        }
        if (config.secondary_breaks) {
          beam.render_options.secondary_break_ticks = _tables.Flow.durationToTicks(config.secondary_breaks);
        }
        if (config.flat_beams === true) {
          beam.render_options.flat_beams = true;
          beam.render_options.flat_beam_offset = config.flat_beam_offset;
        }
        beams.push(beam);
      });

      // Reformat tuplets
      allTuplets.forEach(function (tuplet) {
        // Set the tuplet location based on the stem direction
        var direction = tuplet.notes[0].stem_direction === _stem.Stem.DOWN ? _tuplet.Tuplet.LOCATION_BOTTOM : _tuplet.Tuplet.LOCATION_TOP;
        tuplet.setTupletLocation(direction);

        // If any of the notes in the tuplet are not beamed, draw a bracket.
        var bracketed = false;
        for (var _i2 = 0; _i2 < tuplet.notes.length; _i2++) {
          var _note3 = tuplet.notes[_i2];
          if (_note3.beam === null) {
            bracketed = true;
            break;
          }
        }
        tuplet.setBracketed(bracketed);
      });

      return beams;
    }
  }]);

  function Beam(notes, auto_stem) {
    _classCallCheck(this, Beam);

    var _this = _possibleConstructorReturn(this, (Beam.__proto__ || Object.getPrototypeOf(Beam)).call(this));

    _this.setAttribute('type', 'Beam');

    if (!notes || notes === []) {
      throw new _vex.Vex.RuntimeError('BadArguments', 'No notes provided for beam.');
    }

    if (notes.length === 1) {
      throw new _vex.Vex.RuntimeError('BadArguments', 'Too few notes for beam.');
    }

    // Validate beam line, direction and ticks.
    _this.ticks = notes[0].getIntrinsicTicks();

    if (_this.ticks >= _tables.Flow.durationToTicks('4')) {
      throw new _vex.Vex.RuntimeError('BadArguments', 'Beams can only be applied to notes shorter than a quarter note.');
    }

    var i = void 0; // shared iterator
    var note = void 0;

    _this.stem_direction = _stem.Stem.UP;

    for (i = 0; i < notes.length; ++i) {
      note = notes[i];
      if (note.hasStem()) {
        _this.stem_direction = note.getStemDirection();
        break;
      }
    }

    var stem_direction = _this.stem_direction;
    // Figure out optimal stem direction based on given notes
    if (auto_stem && notes[0].getCategory() === 'stavenotes') {
      stem_direction = calculateStemDirection(notes);
    } else if (auto_stem && notes[0].getCategory() === 'tabnotes') {
      // Auto Stem TabNotes
      var stem_weight = notes.reduce(function (memo, note) {
        return memo + note.stem_direction;
      }, 0);

      stem_direction = stem_weight > -1 ? _stem.Stem.UP : _stem.Stem.DOWN;
    }

    // Apply stem directions and attach beam to notes
    for (i = 0; i < notes.length; ++i) {
      note = notes[i];
      if (auto_stem) {
        note.setStemDirection(stem_direction);
        _this.stem_direction = stem_direction;
      }
      note.setBeam(_this);
    }

    _this.postFormatted = false;
    _this.notes = notes;
    _this.beam_count = _this.getBeamCount();
    _this.break_on_indices = [];
    _this.render_options = {
      beam_width: 5,
      max_slope: 0.25,
      min_slope: -0.25,
      slope_iterations: 20,
      slope_cost: 100,
      show_stemlets: false,
      stemlet_extension: 7,
      partial_beam_length: 10,
      flat_beams: false,
      min_flat_beam_offset: 15
    };
    return _this;
  }

  // Get the notes in this beam


  _createClass(Beam, [{
    key: 'getNotes',
    value: function getNotes() {
      return this.notes;
    }

    // Get the max number of beams in the set of notes

  }, {
    key: 'getBeamCount',
    value: function getBeamCount() {
      var beamCounts = this.notes.map(function (note) {
        return note.getGlyph().beam_count;
      });

      var maxBeamCount = beamCounts.reduce(function (max, beamCount) {
        return beamCount > max ? beamCount : max;
      });

      return maxBeamCount;
    }

    // Set which note `indices` to break the secondary beam at

  }, {
    key: 'breakSecondaryAt',
    value: function breakSecondaryAt(indices) {
      this.break_on_indices = indices;
      return this;
    }

    // Return the y coordinate for linear function

  }, {
    key: 'getSlopeY',
    value: function getSlopeY(x, first_x_px, first_y_px, slope) {
      return first_y_px + (x - first_x_px) * slope;
    }

    // Calculate the best possible slope for the provided notes

  }, {
    key: 'calculateSlope',
    value: function calculateSlope() {
      var notes = this.notes,
          stemDirection = this.stem_direction,
          _render_options = this.render_options,
          max_slope = _render_options.max_slope,
          min_slope = _render_options.min_slope,
          slope_iterations = _render_options.slope_iterations,
          slope_cost = _render_options.slope_cost;


      var firstNote = notes[0];
      var initialSlope = getStemSlope(firstNote, notes[notes.length - 1]);
      var increment = (max_slope - min_slope) / slope_iterations;
      var minCost = Number.MAX_VALUE;
      var bestSlope = 0;
      var yShift = 0;

      // iterate through slope values to find best weighted fit
      for (var slope = min_slope; slope <= max_slope; slope += increment) {
        var totalStemExtension = 0;
        var yShiftTemp = 0;

        // iterate through notes, calculating y shift and stem extension
        for (var _i3 = 1; _i3 < notes.length; ++_i3) {
          var _note4 = notes[_i3];
          var adjustedStemTipY = this.getSlopeY(_note4.getStemX(), firstNote.getStemX(), firstNote.getStemExtents().topY, slope) + yShiftTemp;

          var stemTipY = _note4.getStemExtents().topY;
          // beam needs to be shifted up to accommodate note
          if (stemTipY * stemDirection < adjustedStemTipY * stemDirection) {
            var diff = Math.abs(stemTipY - adjustedStemTipY);
            yShiftTemp += diff * -stemDirection;
            totalStemExtension += diff * _i3;
          } else {
            // beam overshoots note, account for the difference
            totalStemExtension += (stemTipY - adjustedStemTipY) * stemDirection;
          }
        }

        // most engraving books suggest aiming for a slope about half the angle of the
        // difference between the first and last notes' stem length;
        var idealSlope = initialSlope / 2;
        var distanceFromIdeal = Math.abs(idealSlope - slope);

        // This tries to align most beams to something closer to the idealSlope, but
        // doesn't go crazy. To disable, set this.render_options.slope_cost = 0
        var cost = slope_cost * distanceFromIdeal + Math.abs(totalStemExtension);

        // update state when a more ideal slope is found
        if (cost < minCost) {
          minCost = cost;
          bestSlope = slope;
          yShift = yShiftTemp;
        }
      }

      this.slope = bestSlope;
      this.y_shift = yShift;
    }

    // Calculate a slope and y-shift for flat beams

  }, {
    key: 'calculateFlatSlope',
    value: function calculateFlatSlope() {
      var notes = this.notes,
          stem_direction = this.stem_direction,
          _render_options2 = this.render_options,
          beam_width = _render_options2.beam_width,
          min_flat_beam_offset = _render_options2.min_flat_beam_offset,
          flat_beam_offset = _render_options2.flat_beam_offset;

      // If a flat beam offset has not yet been supplied or calculated,
      // generate one based on the notes in this particular note group

      var total = 0;
      var extremeY = 0; // Store the highest or lowest note here
      var extremeBeamCount = 0; // The beam count of the extreme note
      var currentExtreme = 0;
      for (var _i4 = 0; _i4 < notes.length; _i4++) {
        // Total up all of the offsets so we can average them out later
        var _note5 = notes[_i4];
        var stemTipY = _note5.getStemExtents().topY;
        total += stemTipY;

        // Store the highest (stems-up) or lowest (stems-down) note so the
        //  offset can be adjusted in case the average isn't enough
        if (stem_direction === _stem.Stem.DOWN && currentExtreme < stemTipY) {
          currentExtreme = stemTipY;
          extremeY = Math.max.apply(Math, _toConsumableArray(_note5.getYs()));
          extremeBeamCount = _note5.getBeamCount();
        } else if (stem_direction === _stem.Stem.UP && (currentExtreme === 0 || currentExtreme > stemTipY)) {
          currentExtreme = stemTipY;
          extremeY = Math.min.apply(Math, _toConsumableArray(_note5.getYs()));
          extremeBeamCount = _note5.getBeamCount();
        }
      }

      // Average the offsets to try and come up with a reasonable one that
      //  works for all of the notes in the beam group.
      var offset = total / notes.length;

      // In case the average isn't long enough, add or subtract some more
      //  based on the highest or lowest note (again, based on the stem
      //  direction). This also takes into account the added height due to
      //  the width of the beams.
      var beamWidth = beam_width * 1.5;
      var extremeTest = min_flat_beam_offset + extremeBeamCount * beamWidth;
      var newOffset = extremeY + extremeTest * -stem_direction;
      if (stem_direction === _stem.Stem.DOWN && offset < newOffset) {
        offset = extremeY + extremeTest;
      } else if (stem_direction === _stem.Stem.UP && offset > newOffset) {
        offset = extremeY - extremeTest;
      }

      if (!flat_beam_offset) {
        // Set the offset for the group based on the calculations above.
        this.render_options.flat_beam_offset = offset;
      } else if (stem_direction === _stem.Stem.DOWN && offset > flat_beam_offset) {
        this.render_options.flat_beam_offset = offset;
      } else if (stem_direction === _stem.Stem.UP && offset < flat_beam_offset) {
        this.render_options.flat_beam_offset = offset;
      }

      // for flat beams, the slope and y_shift are simply 0
      this.slope = 0;
      this.y_shift = 0;
    }

    // Create new stems for the notes in the beam, so that each stem
    // extends into the beams.

  }, {
    key: 'applyStemExtensions',
    value: function applyStemExtensions() {
      var notes = this.notes,
          slope = this.slope,
          y_shift = this.y_shift,
          stem_direction = this.stem_direction,
          beam_count = this.beam_count,
          _render_options3 = this.render_options,
          show_stemlets = _render_options3.show_stemlets,
          flat_beam_offset = _render_options3.flat_beam_offset,
          flat_beams = _render_options3.flat_beams,
          stemlet_extension = _render_options3.stemlet_extension,
          beam_width = _render_options3.beam_width;


      var firstNote = notes[0];
      var firstStemTipY = firstNote.getStemExtents().topY;

      // If rendering flat beams, and an offset exists, set the y-coordinat`e to
      //  the offset so the stems all end at the beam offset.
      if (flat_beams && flat_beam_offset) {
        firstStemTipY = flat_beam_offset;
      }
      var firstStemX = firstNote.getStemX();

      for (var _i5 = 0; _i5 < notes.length; ++_i5) {
        var _note6 = notes[_i5];
        var stemX = _note6.getStemX();

        var _note6$getStemExtents = _note6.getStemExtents(),
            stemTipY = _note6$getStemExtents.topY;

        var beamedStemTipY = this.getSlopeY(stemX, firstStemX, firstStemTipY, slope) + y_shift;
        var preBeamExtension = _note6.getStem().getExtension();
        var beamExtension = stem_direction === _stem.Stem.UP ? stemTipY - beamedStemTipY : beamedStemTipY - stemTipY;

        _note6.stem.setExtension(preBeamExtension + beamExtension);
        _note6.stem.renderHeightAdjustment = -_stem.Stem.WIDTH / 2;

        if (_note6.isRest() && show_stemlets) {
          var beamWidth = beam_width;
          var totalBeamWidth = (beam_count - 1) * beamWidth * 1.5 + beamWidth;
          _note6.stem.setVisibility(true).setStemlet(true, totalBeamWidth + stemlet_extension);
        }
      }
    }

    // Get the x coordinates for the beam lines of specific `duration`

  }, {
    key: 'getBeamLines',
    value: function getBeamLines(duration) {
      var beam_lines = [];
      var beam_started = false;
      var current_beam = null;
      var partial_beam_length = this.render_options.partial_beam_length;
      var previous_should_break = false;
      var tick_tally = 0;
      for (var _i6 = 0; _i6 < this.notes.length; ++_i6) {
        var _note7 = this.notes[_i6];

        // See if we need to break secondary beams on this note.
        var ticks = _note7.ticks.value();
        tick_tally += ticks;
        var should_break = false;

        // 8th note beams are always drawn.
        if (parseInt(duration, 10) >= 8) {
          // First, check to see if any indices were set up through breakSecondaryAt()
          should_break = this.break_on_indices.indexOf(_i6) !== -1;

          // If the secondary breaks were auto-configured in the render options,
          //  handle that as well.
          if (this.render_options.secondary_break_ticks && tick_tally >= this.render_options.secondary_break_ticks) {
            tick_tally = 0;
            should_break = true;
          }
        }
        var note_gets_beam = _note7.getIntrinsicTicks() < _tables.Flow.durationToTicks(duration);

        var stem_x = _note7.getStemX() - _stem.Stem.WIDTH / 2;

        // Check to see if the next note in the group will get a beam at this
        //  level. This will help to inform the partial beam logic below.
        var next_note = this.notes[_i6 + 1];
        var beam_next = next_note && next_note.getIntrinsicTicks() < _tables.Flow.durationToTicks(duration);
        if (note_gets_beam) {
          // This note gets a beam at the current level
          if (beam_started) {
            // We're currently in the middle of a beam. Just continue it on to
            //  the stem X of the current note.
            current_beam = beam_lines[beam_lines.length - 1];
            current_beam.end = stem_x;

            // If a secondary beam break is set up, end the beam right now.
            if (should_break) {
              beam_started = false;
              if (next_note && !beam_next && current_beam.end === null) {
                // This note gets a beam,.but the next one does not. This means
                //  we need a partial pointing right.
                current_beam.end = current_beam.start - partial_beam_length;
              }
            }
          } else {
            // No beam started yet. Start a new one.
            current_beam = { start: stem_x, end: null };
            beam_started = true;
            if (!beam_next) {
              // The next note doesn't get a beam. Draw a partial.
              if ((previous_should_break || _i6 === 0) && next_note) {
                // This is the first note (but not the last one), or it is
                //  following a secondary break. Draw a partial to the right.
                current_beam.end = current_beam.start + partial_beam_length;
              } else {
                // By default, draw a partial to the left.
                current_beam.end = current_beam.start - partial_beam_length;
              }
            } else if (should_break) {
              // This note should have a secondary break after it. Even though
              //  we just started a beam, it needs to end immediately.
              current_beam.end = current_beam.start - partial_beam_length;
              beam_started = false;
            }
            beam_lines.push(current_beam);
          }
        } else {
          // The current note does not get a beam.
          beam_started = false;
        }

        // Store the secondary break flag to inform the partial beam logic in
        //  the next iteration of the loop.
        previous_should_break = should_break;
      }

      // Add a partial beam pointing left if this is the last note in the group
      var last_beam = beam_lines[beam_lines.length - 1];
      if (last_beam && last_beam.end === null) {
        last_beam.end = last_beam.start - partial_beam_length;
      }
      return beam_lines;
    }

    // Render the stems for each notes

  }, {
    key: 'drawStems',
    value: function drawStems() {
      var _this2 = this;

      this.notes.forEach(function (note) {
        if (note.getStem()) {
          note.getStem().setContext(_this2.context).draw();
        }
      }, this);
    }

    // Render the beam lines

  }, {
    key: 'drawBeamLines',
    value: function drawBeamLines() {
      this.checkContext();

      var valid_beam_durations = ['4', '8', '16', '32', '64'];

      var firstNote = this.notes[0];

      var firstStemTipY = firstNote.getStemExtents().topY;
      var beamY = firstStemTipY;

      // For flat beams, set the first and last Y to the offset, rather than
      //  using the note's stem extents.
      if (this.render_options.flat_beams && this.render_options.flat_beam_offset) {
        beamY = this.render_options.flat_beam_offset;
      }

      var firstStemX = firstNote.getStemX();
      var beamThickness = this.render_options.beam_width * this.stem_direction;

      // Draw the beams.
      for (var _i7 = 0; _i7 < valid_beam_durations.length; ++_i7) {
        var duration = valid_beam_durations[_i7];
        var beamLines = this.getBeamLines(duration);

        for (var j = 0; j < beamLines.length; ++j) {
          var beam_line = beamLines[j];
          var startBeamX = beam_line.start;

          var startBeamY = this.getSlopeY(startBeamX, firstStemX, beamY, this.slope);
          var lastBeamX = beam_line.end;
          var lastBeamY = this.getSlopeY(lastBeamX, firstStemX, beamY, this.slope);

          this.context.beginPath();
          this.context.moveTo(startBeamX, startBeamY);
          this.context.lineTo(startBeamX, startBeamY + beamThickness);
          this.context.lineTo(lastBeamX + 1, lastBeamY + beamThickness);
          this.context.lineTo(lastBeamX + 1, lastBeamY);
          this.context.closePath();
          this.context.fill();
        }

        beamY += beamThickness * 1.5;
      }
    }

    // Pre-format the beam

  }, {
    key: 'preFormat',
    value: function preFormat() {
      return this;
    }

    // Post-format the beam. This can only be called after
    // the notes in the beam have both `x` and `y` values. ie: they've
    // been formatted and have staves

  }, {
    key: 'postFormat',
    value: function postFormat() {
      if (this.postFormatted) return;

      // Calculate a smart slope if we're not forcing the beams to be flat.
      if (this.notes[0].getCategory() === 'tabnotes' || this.render_options.flat_beams) {
        this.calculateFlatSlope();
      } else {
        this.calculateSlope();
      }
      this.applyStemExtensions();

      this.postFormatted = true;
    }

    // Render the beam to the canvas context

  }, {
    key: 'draw',
    value: function draw() {
      this.checkContext();
      this.setRendered();
      if (this.unbeamable) return;

      if (!this.postFormatted) {
        this.postFormat();
      }

      this.drawStems();
      this.applyStyle();
      this.drawBeamLines();
      this.restoreStyle();
    }
  }]);

  return Beam;
}(_element.Element);