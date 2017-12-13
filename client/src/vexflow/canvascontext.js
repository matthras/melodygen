Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// Mohit Muthanna <mohit@muthanna.com>
//
// A rendering context for the Raphael backend.
//
// Copyright Mohit Cheppudira 2010

/** @constructor */
var CanvasContext = exports.CanvasContext = function () {
  _createClass(CanvasContext, null, [{
    key: 'WIDTH',
    get: function get() {
      return 600;
    }
  }, {
    key: 'HEIGHT',
    get: function get() {
      return 400;
    }
  }]);

  function CanvasContext(context) {
    _classCallCheck(this, CanvasContext);

    // Use a name that is unlikely to clash with a canvas context
    // property
    this.vexFlowCanvasContext = context;
    if (!context.canvas) {
      this.canvas = {
        width: CanvasContext.WIDTH,
        height: CanvasContext.HEIGHT
      };
    } else {
      this.canvas = context.canvas;
    }
  }

  _createClass(CanvasContext, [{
    key: 'clear',
    value: function clear() {
      this.vexFlowCanvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Containers not implemented

  }, {
    key: 'openGroup',
    value: function openGroup() {}
  }, {
    key: 'closeGroup',
    value: function closeGroup() {}
  }, {
    key: 'add',
    value: function add() {}
  }, {
    key: 'setFont',
    value: function setFont(family, size, weight) {
      this.vexFlowCanvasContext.font = (weight || '') + ' ' + size + 'pt ' + family;
      return this;
    }
  }, {
    key: 'setRawFont',
    value: function setRawFont(font) {
      this.vexFlowCanvasContext.font = font;
      return this;
    }
  }, {
    key: 'setFillStyle',
    value: function setFillStyle(style) {
      this.vexFlowCanvasContext.fillStyle = style;
      return this;
    }
  }, {
    key: 'setBackgroundFillStyle',
    value: function setBackgroundFillStyle(style) {
      this.background_fillStyle = style;
      return this;
    }
  }, {
    key: 'setStrokeStyle',
    value: function setStrokeStyle(style) {
      this.vexFlowCanvasContext.strokeStyle = style;
      return this;
    }
  }, {
    key: 'setShadowColor',
    value: function setShadowColor(style) {
      this.vexFlowCanvasContext.shadowColor = style;
      return this;
    }
  }, {
    key: 'setShadowBlur',
    value: function setShadowBlur(blur) {
      this.vexFlowCanvasContext.shadowBlur = blur;
      return this;
    }
  }, {
    key: 'setLineWidth',
    value: function setLineWidth(width) {
      this.vexFlowCanvasContext.lineWidth = width;
      return this;
    }
  }, {
    key: 'setLineCap',
    value: function setLineCap(cap_type) {
      this.vexFlowCanvasContext.lineCap = cap_type;
      return this;
    }

    // setLineDash: is the one native method in a canvas context
    // that begins with set, therefore we don't bolster the method
    // if it already exists (see renderer.bolsterCanvasContext).
    // If it doesn't exist, we bolster it and assume it's looking for
    // a ctx.lineDash method, as previous versions of VexFlow
    // expected.

  }, {
    key: 'setLineDash',
    value: function setLineDash(dash) {
      this.vexFlowCanvasContext.lineDash = dash;
      return this;
    }
  }, {
    key: 'scale',
    value: function scale(x, y) {
      return this.vexFlowCanvasContext.scale(parseFloat(x), parseFloat(y));
    }
  }, {
    key: 'resize',
    value: function resize(width, height) {
      return this.vexFlowCanvasContext.resize(parseInt(width, 10), parseInt(height, 10));
    }
  }, {
    key: 'rect',
    value: function rect(x, y, width, height) {
      return this.vexFlowCanvasContext.rect(x, y, width, height);
    }
  }, {
    key: 'fillRect',
    value: function fillRect(x, y, width, height) {
      return this.vexFlowCanvasContext.fillRect(x, y, width, height);
    }
  }, {
    key: 'clearRect',
    value: function clearRect(x, y, width, height) {
      return this.vexFlowCanvasContext.clearRect(x, y, width, height);
    }
  }, {
    key: 'beginPath',
    value: function beginPath() {
      return this.vexFlowCanvasContext.beginPath();
    }
  }, {
    key: 'moveTo',
    value: function moveTo(x, y) {
      return this.vexFlowCanvasContext.moveTo(x, y);
    }
  }, {
    key: 'lineTo',
    value: function lineTo(x, y) {
      return this.vexFlowCanvasContext.lineTo(x, y);
    }
  }, {
    key: 'bezierCurveTo',
    value: function bezierCurveTo(x1, y1, x2, y2, x, y) {
      return this.vexFlowCanvasContext.bezierCurveTo(x1, y1, x2, y2, x, y);
    }
  }, {
    key: 'quadraticCurveTo',
    value: function quadraticCurveTo(x1, y1, x, y) {
      return this.vexFlowCanvasContext.quadraticCurveTo(x1, y1, x, y);
    }

    // This is an attempt (hack) to simulate the HTML5 canvas
    // arc method.

  }, {
    key: 'arc',
    value: function arc(x, y, radius, startAngle, endAngle, antiClockwise) {
      return this.vexFlowCanvasContext.arc(x, y, radius, startAngle, endAngle, antiClockwise);
    }

    // Adapted from the source for Raphael's Element.glow

  }, {
    key: 'glow',
    value: function glow() {
      return this.vexFlowCanvasContext.glow();
    }
  }, {
    key: 'fill',
    value: function fill() {
      return this.vexFlowCanvasContext.fill();
    }
  }, {
    key: 'stroke',
    value: function stroke() {
      return this.vexFlowCanvasContext.stroke();
    }
  }, {
    key: 'closePath',
    value: function closePath() {
      return this.vexFlowCanvasContext.closePath();
    }
  }, {
    key: 'measureText',
    value: function measureText(text) {
      return this.vexFlowCanvasContext.measureText(text);
    }
  }, {
    key: 'fillText',
    value: function fillText(text, x, y) {
      return this.vexFlowCanvasContext.fillText(text, x, y);
    }
  }, {
    key: 'save',
    value: function save() {
      return this.vexFlowCanvasContext.save();
    }
  }, {
    key: 'restore',
    value: function restore() {
      return this.vexFlowCanvasContext.restore();
    }
  }]);

  return CanvasContext;
}();