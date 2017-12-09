'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Formatter = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
//
// This file implements the formatting and layout algorithms that are used
// to position notes in a voice. The algorithm can align multiple voices both
// within a stave, and across multiple staves.
//
// To do this, the formatter breaks up voices into a grid of rational-valued
// `ticks`, to which each note is assigned. Then, minimum widths are assigned
// to each tick based on the widths of the notes and modifiers in that tick. This
// establishes the smallest amount of space required for each tick.
//
// Finally, the formatter distributes the left over space proportionally to
// all the ticks, setting the `x` values of the notes in each tick.
//
// See `tests/formatter_tests.js` for usage examples. The helper functions included
// here (`FormatAndDraw`, `FormatAndDrawTab`) also serve as useful usage examples.

var _vex = require('./vex');

var _beam = require('./beam');

var _tables = require('./tables');

var _fraction = require('./fraction');

var _voice = require('./voice');

var _staveconnector = require('./staveconnector');

var _stavenote = require('./stavenote');

var _note = require('./note');

var _modifiercontext = require('./modifiercontext');

var _tickcontext = require('./tickcontext');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// To enable logging for this class. Set `Vex.Flow.Formatter.DEBUG` to `true`.
function L() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (Formatter.DEBUG) _vex.Vex.L('Vex.Flow.Formatter', args);
}

// Helper function to locate the next non-rest note(s).
function lookAhead(notes, restLine, i, compare) {
  // If no valid next note group, nextRestLine is same as current.
  var nextRestLine = restLine;

  // Get the rest line for next valid non-rest note group.
  for (i += 1; i < notes.length; i += 1) {
    var note = notes[i];
    if (!note.isRest() && !note.shouldIgnoreTicks()) {
      nextRestLine = note.getLineForRest();
      break;
    }
  }

  // Locate the mid point between two lines.
  if (compare && restLine !== nextRestLine) {
    var top = Math.max(restLine, nextRestLine);
    var bot = Math.min(restLine, nextRestLine);
    nextRestLine = _vex.Vex.MidLine(top, bot);
  }
  return nextRestLine;
}

// Take an array of `voices` and place aligned tickables in the same context. Returns
// a mapping from `tick` to `ContextType`, a list of `tick`s, and the resolution
// multiplier.
//
// Params:
// * `voices`: Array of `Voice` instances.
// * `ContextType`: A context class (e.g., `ModifierContext`, `TickContext`)
// * `addToContext`: Function to add tickable to context.
function createContexts(voices, ContextType, addToContext) {
  if (!voices || !voices.length) {
    throw new _vex.Vex.RERR('BadArgument', 'No voices to format');
  }

  // Find out highest common multiple of resolution multipliers.
  // The purpose of this is to find out a common denominator
  // for all fractional tick values in all tickables of all voices,
  // so that the values can be expanded and the numerator used
  // as an integer tick value.
  var totalTicks = voices[0].getTotalTicks();
  var resolutionMultiplier = voices.reduce(function (resolutionMultiplier, voice) {
    if (!voice.getTotalTicks().equals(totalTicks)) {
      throw new _vex.Vex.RERR('TickMismatch', 'Voices should have same total note duration in ticks.');
    }

    if (voice.getMode() === _voice.Voice.Mode.STRICT && !voice.isComplete()) {
      throw new _vex.Vex.RERR('IncompleteVoice', 'Voice does not have enough notes.');
    }

    return Math.max(resolutionMultiplier, _fraction.Fraction.LCM(resolutionMultiplier, voice.getResolutionMultiplier()));
  }, 1);

  // Initialize tick maps.
  var tickToContextMap = {};
  var tickList = [];
  var contexts = [];

  // For each voice, extract notes and create a context for every
  // new tick that hasn't been seen before.
  voices.forEach(function (voice) {
    // Use resolution multiplier as denominator to expand ticks
    // to suitable integer values, so that no additional expansion
    // of fractional tick values is needed.
    var ticksUsed = new _fraction.Fraction(0, resolutionMultiplier);

    voice.getTickables().forEach(function (tickable) {
      var integerTicks = ticksUsed.numerator;

      // If we have no tick context for this tick, create one.
      if (!tickToContextMap[integerTicks]) {
        var newContext = new ContextType();
        contexts.push(newContext);
        tickToContextMap[integerTicks] = newContext;
      }

      // Add this tickable to the TickContext.
      addToContext(tickable, tickToContextMap[integerTicks]);

      // Maintain a sorted list of tick contexts.
      tickList.push(integerTicks);
      ticksUsed.add(tickable.getTicks());
    });
  });

  return {
    map: tickToContextMap,
    array: contexts,
    list: _vex.Vex.SortAndUnique(tickList, function (a, b) {
      return a - b;
    }, function (a, b) {
      return a === b;
    }),
    resolutionMultiplier: resolutionMultiplier
  };
}

var Formatter = exports.Formatter = function () {
  _createClass(Formatter, null, [{
    key: 'SimpleFormat',

    // Helper function to layout "notes" one after the other without
    // regard for proportions. Useful for tests and debugging.
    value: function SimpleFormat(notes) {
      var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          _ref$paddingBetween = _ref.paddingBetween,
          paddingBetween = _ref$paddingBetween === undefined ? 10 : _ref$paddingBetween;

      notes.reduce(function (x, note) {
        note.addToModifierContext(new _modifiercontext.ModifierContext());
        var tick = new _tickcontext.TickContext().addTickable(note).preFormat();
        var extra = tick.getExtraPx();
        tick.setX(x + extra.left);

        return x + tick.getWidth() + extra.right + paddingBetween;
      }, x);
    }

    // Helper function to plot formatter debug info.

  }, {
    key: 'plotDebugging',
    value: function plotDebugging(ctx, formatter, xPos, y1, y2) {
      var x = xPos + _note.Note.STAVEPADDING;
      var contextGaps = formatter.contextGaps;
      function stroke(x1, x2, color) {
        ctx.beginPath();
        ctx.setStrokeStyle(color);
        ctx.setFillStyle(color);
        ctx.setLineWidth(1);
        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
      }

      ctx.save();
      ctx.setFont('Arial', 8, '');

      contextGaps.gaps.forEach(function (gap) {
        stroke(x + gap.x1, x + gap.x2, '#aaa');
        // Vex.drawDot(ctx, xPos + gap.x1, yPos, 'blue');
        ctx.fillText(Math.round(gap.x2 - gap.x1), x + gap.x1, y2 + 12);
      });

      ctx.fillText(Math.round(contextGaps.total) + 'px', x - 20, y2 + 12);
      ctx.setFillStyle('red');

      ctx.fillText('Loss: ' + formatter.lossHistory.map(function (loss) {
        return Math.round(loss);
      }), x - 20, y2 + 22);
      ctx.restore();
    }

    // Helper function to format and draw a single voice. Returns a bounding
    // box for the notation.
    //
    // Parameters:
    // * `ctx` - The rendering context
    // * `stave` - The stave to which to draw (`Stave` or `TabStave`)
    // * `notes` - Array of `Note` instances (`StaveNote`, `TextNote`, `TabNote`, etc.)
    // * `params` - One of below:
    //    * Setting `autobeam` only `(context, stave, notes, true)` or
    //      `(ctx, stave, notes, {autobeam: true})`
    //    * Setting `align_rests` a struct is needed `(context, stave, notes, {align_rests: true})`
    //    * Setting both a struct is needed `(context, stave, notes, {
    //      autobeam: true, align_rests: true})`
    //
    // `autobeam` automatically generates beams for the notes.
    // `align_rests` aligns rests with nearby notes.

  }, {
    key: 'FormatAndDraw',
    value: function FormatAndDraw(ctx, stave, notes, params) {
      var options = {
        auto_beam: false,
        align_rests: false
      };

      if ((typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object') {
        _vex.Vex.Merge(options, params);
      } else if (typeof params === 'boolean') {
        options.auto_beam = params;
      }

      // Start by creating a voice and adding all the notes to it.
      var voice = new _voice.Voice(_tables.Flow.TIME4_4).setMode(_voice.Voice.Mode.SOFT).addTickables(notes);

      // Then create beams, if requested.
      var beams = options.auto_beam ? _beam.Beam.applyAndGetBeams(voice) : [];

      // Instantiate a `Formatter` and format the notes.
      new Formatter().joinVoices([voice], { align_rests: options.align_rests }).formatToStave([voice], stave, { align_rests: options.align_rests, stave: stave });

      // Render the voice and beams to the stave.
      voice.setStave(stave).draw(ctx, stave);
      beams.forEach(function (beam) {
        return beam.setContext(ctx).draw();
      });

      // Return the bounding box of the voice.
      return voice.getBoundingBox();
    }

    // Helper function to format and draw aligned tab and stave notes in two
    // separate staves.
    //
    // Parameters:
    // * `ctx` - The rendering context
    // * `tabstave` - A `TabStave` instance on which to render `TabNote`s.
    // * `stave` - A `Stave` instance on which to render `Note`s.
    // * `notes` - Array of `Note` instances for the stave (`StaveNote`, `BarNote`, etc.)
    // * `tabnotes` - Array of `Note` instances for the tab stave (`TabNote`, `BarNote`, etc.)
    // * `autobeam` - Automatically generate beams.
    // * `params` - A configuration object:
    //    * `autobeam` automatically generates beams for the notes.
    //    * `align_rests` aligns rests with nearby notes.

  }, {
    key: 'FormatAndDrawTab',
    value: function FormatAndDrawTab(ctx, tabstave, stave, tabnotes, notes, autobeam, params) {
      var opts = {
        auto_beam: autobeam,
        align_rests: false
      };

      if ((typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object') {
        _vex.Vex.Merge(opts, params);
      } else if (typeof params === 'boolean') {
        opts.auto_beam = params;
      }

      // Create a `4/4` voice for `notes`.
      var notevoice = new _voice.Voice(_tables.Flow.TIME4_4).setMode(_voice.Voice.Mode.SOFT).addTickables(notes);

      // Create a `4/4` voice for `tabnotes`.
      var tabvoice = new _voice.Voice(_tables.Flow.TIME4_4).setMode(_voice.Voice.Mode.SOFT).addTickables(tabnotes);

      // Then create beams, if requested.
      var beams = opts.auto_beam ? _beam.Beam.applyAndGetBeams(notevoice) : [];

      // Instantiate a `Formatter` and align tab and stave notes.
      new Formatter().joinVoices([notevoice], { align_rests: opts.align_rests }).joinVoices([tabvoice]).formatToStave([notevoice, tabvoice], stave, { align_rests: opts.align_rests });

      // Render voices and beams to staves.
      notevoice.draw(ctx, stave);
      tabvoice.draw(ctx, tabstave);
      beams.forEach(function (beam) {
        return beam.setContext(ctx).draw();
      });

      // Draw a connector between tab and note staves.
      new _staveconnector.StaveConnector(stave, tabstave).setContext(ctx).draw();
    }

    // Auto position rests based on previous/next note positions.
    //
    // Params:
    // * `notes`: An array of notes.
    // * `alignAllNotes`: If set to false, only aligns non-beamed notes.
    // * `alignTuplets`: If set to false, ignores tuplets.

  }, {
    key: 'AlignRestsToNotes',
    value: function AlignRestsToNotes(notes, alignAllNotes, alignTuplets) {
      notes.forEach(function (note, index) {
        if (note instanceof _stavenote.StaveNote && note.isRest()) {
          if (note.tuplet && !alignTuplets) return;

          // If activated rests not on default can be rendered as specified.
          var position = note.getGlyph().position.toUpperCase();
          if (position !== 'R/4' && position !== 'B/4') return;

          if (alignAllNotes || note.beam != null) {
            // Align rests with previous/next notes.
            var props = note.getKeyProps()[0];
            if (index === 0) {
              props.line = lookAhead(notes, props.line, index, false);
              note.setKeyLine(0, props.line);
            } else if (index > 0 && index < notes.length) {
              // If previous note is a rest, use its line number.
              var restLine = void 0;
              if (notes[index - 1].isRest()) {
                restLine = notes[index - 1].getKeyProps()[0].line;
                props.line = restLine;
              } else {
                restLine = notes[index - 1].getLineForRest();
                // Get the rest line for next valid non-rest note group.
                props.line = lookAhead(notes, restLine, index, true);
              }
              note.setKeyLine(0, props.line);
            }
          }
        }
      });

      return this;
    }
  }]);

  function Formatter() {
    _classCallCheck(this, Formatter);

    // Minimum width required to render all the notes in the voices.
    this.minTotalWidth = 0;

    // This is set to `true` after `minTotalWidth` is calculated.
    this.hasMinTotalWidth = false;

    // Total number of ticks in the voice.
    this.totalTicks = new _fraction.Fraction(0, 1);

    // Arrays of tick and modifier contexts.
    this.tickContexts = null;
    this.modiferContexts = null;

    // Gaps between contexts, for free movement of notes post
    // formatting.
    this.contextGaps = {
      total: 0,
      gaps: []
    };

    this.voices = [];
  }

  // Find all the rests in each of the `voices` and align them
  // to neighboring notes. If `alignAllNotes` is `false`, then only
  // align non-beamed notes.


  _createClass(Formatter, [{
    key: 'alignRests',
    value: function alignRests(voices, alignAllNotes) {
      if (!voices || !voices.length) {
        throw new _vex.Vex.RERR('BadArgument', 'No voices to format rests');
      }

      voices.forEach(function (voice) {
        return Formatter.AlignRestsToNotes(voice.getTickables(), alignAllNotes);
      });
    }

    // Calculate the minimum width required to align and format `voices`.

  }, {
    key: 'preCalculateMinTotalWidth',
    value: function preCalculateMinTotalWidth(voices) {
      // Cache results.
      if (this.hasMinTotalWidth) return this.minTotalWidth;

      // Create tick contexts if not already created.
      if (!this.tickContexts) {
        if (!voices) {
          throw new _vex.Vex.RERR('BadArgument', "'voices' required to run preCalculateMinTotalWidth");
        }

        this.createTickContexts(voices);
      }

      var _tickContexts = this.tickContexts,
          contextList = _tickContexts.list,
          contextMap = _tickContexts.map;

      // Go through each tick context and calculate total width.

      this.minTotalWidth = contextList.map(function (tick) {
        var context = contextMap[tick];
        context.preFormat();
        return context.getWidth();
      }).reduce(function (a, b) {
        return a + b;
      }, 0);

      this.hasMinTotalWidth = true;

      return this.minTotalWidth;
    }

    // Get minimum width required to render all voices. Either `format` or
    // `preCalculateMinTotalWidth` must be called before this method.

  }, {
    key: 'getMinTotalWidth',
    value: function getMinTotalWidth() {
      if (!this.hasMinTotalWidth) {
        throw new _vex.Vex.RERR('NoMinTotalWidth', "Call 'preCalculateMinTotalWidth' or 'preFormat' before calling 'getMinTotalWidth'");
      }

      return this.minTotalWidth;
    }

    // Create `ModifierContext`s for each tick in `voices`.

  }, {
    key: 'createModifierContexts',
    value: function createModifierContexts(voices) {
      var contexts = createContexts(voices, _modifiercontext.ModifierContext, function (tickable, context) {
        return tickable.addToModifierContext(context);
      });

      this.modiferContexts = contexts;
      return contexts;
    }

    // Create `TickContext`s for each tick in `voices`. Also calculate the
    // total number of ticks in voices.

  }, {
    key: 'createTickContexts',
    value: function createTickContexts(voices) {
      var contexts = createContexts(voices, _tickcontext.TickContext, function (tickable, context) {
        return context.addTickable(tickable);
      });

      contexts.array.forEach(function (context) {
        context.tContexts = contexts.array;
      });

      this.totalTicks = voices[0].getTicksUsed().clone();
      this.tickContexts = contexts;
      return contexts;
    }

    // This is the core formatter logic. Format voices and justify them
    // to `justifyWidth` pixels. `renderingContext` is required to justify elements
    // that can't retreive widths without a canvas. This method sets the `x` positions
    // of all the tickables/notes in the formatter.

  }, {
    key: 'preFormat',
    value: function preFormat() {
      var justifyWidth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var renderingContext = arguments[1];

      var _this = this;

      var voices = arguments[2];
      var stave = arguments[3];

      // Initialize context maps.
      var contexts = this.tickContexts;
      var contextList = contexts.list,
          contextMap = contexts.map,
          resolutionMultiplier = contexts.resolutionMultiplier;

      // If voices and a stave were provided, set the Stave for each voice
      // and preFormat to apply Y values to the notes;

      if (voices && stave) {
        voices.forEach(function (voice) {
          return voice.setStave(stave).preFormat();
        });
      }

      // Now distribute the ticks to each tick context, and assign them their
      // own X positions.
      var x = 0;
      var shift = 0;
      var centerX = justifyWidth / 2;
      this.minTotalWidth = 0;

      // Pass 1: Give each note maximum width requested by context.
      contextList.forEach(function (tick) {
        var context = contextMap[tick];
        if (renderingContext) context.setContext(renderingContext);

        // Make sure that all tickables in this context have calculated their
        // space requirements.
        context.preFormat();

        var width = context.getWidth();
        _this.minTotalWidth += width;

        var metrics = context.getMetrics();
        x = x + shift + metrics.extraLeftPx;
        context.setX(x);

        // Calculate shift for the next tick.
        shift = width - metrics.extraLeftPx;
      });

      this.minTotalWidth = x + shift;
      this.hasMinTotalWidth = true;

      // No justification needed. End formatting.
      if (justifyWidth <= 0) return;

      // Pass 2: Take leftover width, and distribute it to proportionately to
      // all notes.
      var remainingX = justifyWidth - this.minTotalWidth;
      var leftoverPxPerTick = remainingX / (this.totalTicks.value() * resolutionMultiplier);
      var spaceAccum = 0;

      contextList.forEach(function (tick, index) {
        var prevTick = contextList[index - 1] || 0;
        var context = contextMap[tick];
        var tickSpace = (tick - prevTick) * leftoverPxPerTick;

        spaceAccum += tickSpace;
        context.setX(context.getX() + spaceAccum);

        // Move center aligned tickables to middle
        context.getCenterAlignedTickables().forEach(function (tickable) {
          // eslint-disable-line
          tickable.center_x_shift = centerX - context.getX();
        });
      });

      // Just one context. Done formatting.
      if (contextList.length === 1) return;

      this.justifyWidth = justifyWidth;
      this.lossHistory = [];
      this.evaluate();
    }

    // Calculate the total cost of this formatting decision.

  }, {
    key: 'evaluate',
    value: function evaluate() {
      var _this2 = this;

      var justifyWidth = this.justifyWidth;
      // Calculate available slack per tick context. This works out how much freedom
      // to move a context has in either direction, without affecting other notes.
      this.contextGaps = { total: 0, gaps: [] };
      this.tickContexts.list.forEach(function (tick, index) {
        if (index === 0) return;
        var prevTick = _this2.tickContexts.list[index - 1];
        var prevContext = _this2.tickContexts.map[prevTick];
        var context = _this2.tickContexts.map[tick];
        var prevMetrics = prevContext.getMetrics();

        var insideRightEdge = prevContext.getX() + prevMetrics.width;
        var insideLeftEdge = context.getX();
        var gap = insideLeftEdge - insideRightEdge;
        _this2.contextGaps.total += gap;
        _this2.contextGaps.gaps.push({ x1: insideRightEdge, x2: insideLeftEdge });

        // Tell the tick contexts how much they can reposition themselves.
        context.getFormatterMetrics().freedom.left = gap;
        prevContext.getFormatterMetrics().freedom.right = gap;
      });

      // Calculate mean distance in each voice for each duration type, then calculate
      // how far each note is from the mean.
      var durationStats = this.durationStats = {};

      function updateStats(duration, space) {
        var stats = durationStats[duration];
        if (stats === undefined) {
          durationStats[duration] = { mean: space, count: 1 };
        } else {
          stats.count += 1;
          stats.mean = (stats.mean + space) / 2;
        }
      }

      this.voices.forEach(function (voice) {
        voice.getTickables().forEach(function (note, i, notes) {
          var duration = note.getTicks().clone().simplify().toString();
          var metrics = note.getMetrics();
          var formatterMetrics = note.getFormatterMetrics();
          var leftNoteEdge = note.getX() + metrics.noteWidth + metrics.modRightPx + metrics.extraRightPx;
          var space = 0;

          if (i < notes.length - 1) {
            var rightNote = notes[i + 1];
            var rightMetrics = rightNote.getMetrics();
            var rightNoteEdge = rightNote.getX() - rightMetrics.modLeftPx - rightMetrics.extraLeftPx;

            space = rightNoteEdge - leftNoteEdge;
            formatterMetrics.space.used = rightNote.getX() - note.getX();
            rightNote.getFormatterMetrics().freedom.left = space;
          } else {
            space = justifyWidth - leftNoteEdge;
            formatterMetrics.space.used = justifyWidth - note.getX();
          }

          formatterMetrics.freedom.right = space;
          updateStats(duration, formatterMetrics.space.used);
        });
      });

      // Calculate how much each note deviates from the mean. Loss function is square
      // root of the sum of squared deviations.
      var totalDeviation = 0;
      this.voices.forEach(function (voice) {
        voice.getTickables().forEach(function (note) {
          var duration = note.getTicks().clone().simplify().toString();
          var metrics = note.getFormatterMetrics();
          metrics.iterations += 1;
          metrics.space.deviation = metrics.space.used - durationStats[duration].mean;
          metrics.duration = duration;
          metrics.space.mean = durationStats[duration].mean;

          totalDeviation += Math.pow(durationStats[duration].mean, 2);
        });
      });

      this.totalCost = Math.sqrt(totalDeviation);
      this.lossHistory.push(this.totalCost);
      return this;
    }

    // Run a single iteration of rejustification. At a high level, this method calculates
    // the overall "loss" (or cost) of this layout, and repositions tickcontexts in an
    // attempt to reduce the cost. You can call this method multiple times until it finds
    // and oscillates around a global minimum.

  }, {
    key: 'tune',
    value: function tune() {
      var _this3 = this;

      var sum = function sum(means) {
        return means.reduce(function (a, b) {
          return a + b;
        });
      };

      // Move `current` tickcontext by `shift` pixels, and adjust the freedom
      // on adjacent tickcontexts.
      function move(current, prev, next, shift) {
        current.setX(current.getX() + shift);
        current.getFormatterMetrics().freedom.left += shift;
        current.getFormatterMetrics().freedom.right -= shift;

        if (prev) prev.getFormatterMetrics().freedom.right += shift;
        if (next) next.getFormatterMetrics().freedom.left -= shift;
      }

      var shift = 0;
      this.tickContexts.list.forEach(function (tick, index, list) {
        var context = _this3.tickContexts.map[tick];
        var prevContext = index > 0 ? _this3.tickContexts.map[list[index - 1]] : null;
        var nextContext = index < list.length - 1 ? _this3.tickContexts.map[list[index + 1]] : null;

        move(context, prevContext, nextContext, shift);

        var cost = -sum(context.getTickables().map(function (t) {
          return t.getFormatterMetrics().space.deviation;
        }));

        if (cost > 0) {
          shift = -Math.min(context.getFormatterMetrics().freedom.right, Math.abs(cost));
        } else if (cost < 0) {
          if (nextContext) {
            shift = Math.min(nextContext.getFormatterMetrics().freedom.right, Math.abs(cost));
          } else {
            shift = 0;
          }
        }

        var minShift = Math.min(5, Math.abs(shift));
        shift = shift > 0 ? minShift : -minShift;
      });

      return this.evaluate();
    }

    // This is the top-level call for all formatting logic completed
    // after `x` *and* `y` values have been computed for the notes
    // in the voices.

  }, {
    key: 'postFormat',
    value: function postFormat() {
      var postFormatContexts = function postFormatContexts(contexts) {
        return contexts.list.forEach(function (tick) {
          return contexts.map[tick].postFormat();
        });
      };

      postFormatContexts(this.modiferContexts);
      postFormatContexts(this.tickContexts);

      return this;
    }

    // Take all `voices` and create `ModifierContext`s out of them. This tells
    // the formatters that the voices belong on a single stave.

  }, {
    key: 'joinVoices',
    value: function joinVoices(voices) {
      this.createModifierContexts(voices);
      this.hasMinTotalWidth = false;
      return this;
    }

    // Align rests in voices, justify the contexts, and position the notes
    // so voices are aligned and ready to render onto the stave. This method
    // mutates the `x` positions of all tickables in `voices`.
    //
    // Voices are full justified to fit in `justifyWidth` pixels.
    //
    // Set `options.context` to the rendering context. Set `options.align_rests`
    // to true to enable rest alignment.

  }, {
    key: 'format',
    value: function format(voices, justifyWidth, options) {
      var opts = {
        align_rests: false,
        context: null,
        stave: null
      };

      _vex.Vex.Merge(opts, options);
      this.voices = voices;
      this.alignRests(voices, opts.align_rests);
      this.createTickContexts(voices);
      this.preFormat(justifyWidth, opts.context, voices, opts.stave);

      // Only postFormat if a stave was supplied for y value formatting
      if (opts.stave) this.postFormat();

      return this;
    }

    // This method is just like `format` except that the `justifyWidth` is inferred
    // from the `stave`.

  }, {
    key: 'formatToStave',
    value: function formatToStave(voices, stave, options) {
      var justifyWidth = stave.getNoteEndX() - stave.getNoteStartX() - 10;
      L('Formatting voices to width: ', justifyWidth);
      var opts = { context: stave.getContext() };
      _vex.Vex.Merge(opts, options);
      return this.format(voices, justifyWidth, opts);
    }
  }]);

  return Formatter;
}();