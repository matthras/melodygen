Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VoiceGroup = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.

var _vex = require('./vex');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** @constructor */
var VoiceGroup = exports.VoiceGroup = function () {
  function VoiceGroup() {
    _classCallCheck(this, VoiceGroup);

    this.voices = [];
    this.modifierContexts = [];
  }

  // Every tickable must be associated with a voiceGroup. This allows formatters
  // and preformatters to associate them with the right modifierContexts.


  _createClass(VoiceGroup, [{
    key: 'getVoices',
    value: function getVoices() {
      return this.voices;
    }
  }, {
    key: 'getModifierContexts',
    value: function getModifierContexts() {
      return this.modifierContexts;
    }
  }, {
    key: 'addVoice',
    value: function addVoice(voice) {
      if (!voice) throw new _vex.Vex.RERR('BadArguments', 'Voice cannot be null.');
      this.voices.push(voice);
      voice.setVoiceGroup(this);
    }
  }]);

  return VoiceGroup;
}();