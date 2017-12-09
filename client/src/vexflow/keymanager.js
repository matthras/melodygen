'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KeyManager = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
//
// This class implements diatonic key management.

var _vex = require('./vex');

var _music = require('./music');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KeyManager = exports.KeyManager = function () {
  function KeyManager(key) {
    _classCallCheck(this, KeyManager);

    this.music = new _music.Music();
    this.setKey(key);
  }

  _createClass(KeyManager, [{
    key: 'setKey',
    value: function setKey(key) {
      this.key = key;
      this.reset();
      return this;
    }
  }, {
    key: 'getKey',
    value: function getKey() {
      return this.key;
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.keyParts = this.music.getKeyParts(this.key);

      this.keyString = this.keyParts.root;
      if (this.keyParts.accidental) this.keyString += this.keyParts.accidental;

      var is_supported_type = _music.Music.scaleTypes[this.keyParts.type];
      if (!is_supported_type) {
        throw new _vex.Vex.RERR('BadArguments', 'Unsupported key type: ' + this.key);
      }

      this.scale = this.music.getScaleTones(this.music.getNoteValue(this.keyString), _music.Music.scaleTypes[this.keyParts.type]);

      this.scaleMap = {};
      this.scaleMapByValue = {};
      this.originalScaleMapByValue = {};

      var noteLocation = _music.Music.root_indices[this.keyParts.root];

      for (var i = 0; i < _music.Music.roots.length; ++i) {
        var index = (noteLocation + i) % _music.Music.roots.length;
        var rootName = _music.Music.roots[index];

        var noteName = this.music.getRelativeNoteName(rootName, this.scale[i]);
        this.scaleMap[rootName] = noteName;
        this.scaleMapByValue[this.scale[i]] = noteName;
        this.originalScaleMapByValue[this.scale[i]] = noteName;
      }

      return this;
    }
  }, {
    key: 'getAccidental',
    value: function getAccidental(key) {
      var root = this.music.getKeyParts(key).root;
      var parts = this.music.getNoteParts(this.scaleMap[root]);

      return {
        note: this.scaleMap[root],
        accidental: parts.accidental
      };
    }
  }, {
    key: 'selectNote',
    value: function selectNote(note) {
      note = note.toLowerCase();
      var parts = this.music.getNoteParts(note);

      // First look for matching note in our altered scale
      var scaleNote = this.scaleMap[parts.root];
      var modparts = this.music.getNoteParts(scaleNote);

      if (scaleNote === note) {
        return {
          'note': scaleNote,
          'accidental': parts.accidental,
          'change': false
        };
      }

      // Then search for a note of equivalent value in our altered scale
      var valueNote = this.scaleMapByValue[this.music.getNoteValue(note)];
      if (valueNote != null) {
        return {
          'note': valueNote,
          'accidental': this.music.getNoteParts(valueNote).accidental,
          'change': false
        };
      }

      // Then search for a note of equivalent value in the original scale
      var originalValueNote = this.originalScaleMapByValue[this.music.getNoteValue(note)];
      if (originalValueNote != null) {
        this.scaleMap[modparts.root] = originalValueNote;
        delete this.scaleMapByValue[this.music.getNoteValue(scaleNote)];
        this.scaleMapByValue[this.music.getNoteValue(note)] = originalValueNote;
        return {
          'note': originalValueNote,
          'accidental': this.music.getNoteParts(originalValueNote).accidental,
          'change': true
        };
      }

      // Then try to unmodify a currently modified note.
      if (modparts.root === note) {
        delete this.scaleMapByValue[this.music.getNoteValue(this.scaleMap[parts.root])];
        this.scaleMapByValue[this.music.getNoteValue(modparts.root)] = modparts.root;
        this.scaleMap[modparts.root] = modparts.root;
        return {
          'note': modparts.root,
          'accidental': null,
          'change': true
        };
      }

      // Last resort -- shitshoot
      delete this.scaleMapByValue[this.music.getNoteValue(this.scaleMap[parts.root])];
      this.scaleMapByValue[this.music.getNoteValue(note)] = note;

      delete this.scaleMap[modparts.root];
      this.scaleMap[modparts.root] = note;

      return {
        note: note,
        'accidental': parts.accidental,
        'change': true
      };
    }
  }]);

  return KeyManager;
}();