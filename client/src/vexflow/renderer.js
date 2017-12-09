'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Renderer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
// Support for different rendering contexts: Canvas, Raphael

/* global document: false */

var _canvascontext = require('./canvascontext');

var _raphaelcontext = require('./raphaelcontext');

var _svgcontext = require('./svgcontext');

var _vex = require('./vex');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var lastContext = null;

var Renderer = exports.Renderer = function () {
  _createClass(Renderer, null, [{
    key: 'buildContext',
    value: function buildContext(elementId, backend, width, height, background) {
      var renderer = new Renderer(elementId, backend);
      if (width && height) {
        renderer.resize(width, height);
      }

      if (!background) background = '#FFF';
      var ctx = renderer.getContext();
      ctx.setBackgroundFillStyle(background);
      Renderer.lastContext = ctx;
      return ctx;
    }
  }, {
    key: 'getCanvasContext',
    value: function getCanvasContext(elementId, width, height, background) {
      return Renderer.buildContext(elementId, Renderer.Backends.CANVAS, width, height, background);
    }
  }, {
    key: 'getRaphaelContext',
    value: function getRaphaelContext(elementId, width, height, background) {
      return Renderer.buildContext(elementId, Renderer.Backends.RAPHAEL, width, height, background);
    }
  }, {
    key: 'getSVGContext',
    value: function getSVGContext(elementId, width, height, background) {
      return Renderer.buildContext(elementId, Renderer.Backends.SVG, width, height, background);
    }
  }, {
    key: 'bolsterCanvasContext',
    value: function bolsterCanvasContext(ctx) {
      if (Renderer.USE_CANVAS_PROXY) {
        return new _canvascontext.CanvasContext(ctx);
      }

      var methodNames = ['clear', 'setFont', 'setRawFont', 'setFillStyle', 'setBackgroundFillStyle', 'setStrokeStyle', 'setShadowColor', 'setShadowBlur', 'setLineWidth', 'setLineCap', 'setLineDash', 'openGroup', 'closeGroup', 'getGroup'];

      ctx.vexFlowCanvasContext = ctx;

      methodNames.forEach(function (methodName) {
        ctx[methodName] = ctx[methodName] || _canvascontext.CanvasContext.prototype[methodName];
      });

      return ctx;
    }

    // Draw a dashed line (horizontal, vertical or diagonal
    // dashPattern = [3,3] draws a 3 pixel dash followed by a three pixel space.
    // setting the second number to 0 draws a solid line.

  }, {
    key: 'drawDashedLine',
    value: function drawDashedLine(context, fromX, fromY, toX, toY, dashPattern) {
      context.beginPath();

      var dx = toX - fromX;
      var dy = toY - fromY;
      var angle = Math.atan2(dy, dx);
      var x = fromX;
      var y = fromY;
      context.moveTo(fromX, fromY);
      var idx = 0;
      var draw = true;
      while (!((dx < 0 ? x <= toX : x >= toX) && (dy < 0 ? y <= toY : y >= toY))) {
        var dashLength = dashPattern[idx++ % dashPattern.length];
        var nx = x + Math.cos(angle) * dashLength;
        x = dx < 0 ? Math.max(toX, nx) : Math.min(toX, nx);
        var ny = y + Math.sin(angle) * dashLength;
        y = dy < 0 ? Math.max(toY, ny) : Math.min(toY, ny);
        if (draw) {
          context.lineTo(x, y);
        } else {
          context.moveTo(x, y);
        }
        draw = !draw;
      }

      context.closePath();
      context.stroke();
    }
  }, {
    key: 'Backends',
    get: function get() {
      return {
        CANVAS: 1,
        RAPHAEL: 2,
        SVG: 3,
        VML: 4
      };
    }

    // End of line types

  }, {
    key: 'LineEndType',
    get: function get() {
      return {
        NONE: 1, // No leg
        UP: 2, // Upward leg
        DOWN: 3 // Downward leg
      };
    }

    // Set this to true if you're using VexFlow inside a runtime
    // that does not allow modifiying canvas objects. There is a small
    // performance degradation due to the extra indirection.

  }, {
    key: 'USE_CANVAS_PROXY',
    get: function get() {
      return false;
    }
  }, {
    key: 'lastContext',
    get: function get() {
      return lastContext;
    },
    set: function set(ctx) {
      lastContext = ctx;
    }
  }]);

  function Renderer(elementId, backend) {
    _classCallCheck(this, Renderer);

    this.elementId = elementId;
    if (!this.elementId) {
      throw new _vex.Vex.RERR('BadArgument', 'Invalid id for renderer.');
    }

    this.element = document.getElementById(elementId);
    if (!this.element) this.element = elementId;

    // Verify backend and create context
    this.ctx = null;
    this.paper = null;
    this.backend = backend;
    if (this.backend === Renderer.Backends.CANVAS) {
      // Create context.
      if (!this.element.getContext) {
        throw new _vex.Vex.RERR('BadElement', 'Can\'t get canvas context from element: ' + elementId);
      }
      this.ctx = Renderer.bolsterCanvasContext(this.element.getContext('2d'));
    } else if (this.backend === Renderer.Backends.RAPHAEL) {
      this.ctx = new _raphaelcontext.RaphaelContext(this.element);
    } else if (this.backend === Renderer.Backends.SVG) {
      this.ctx = new _svgcontext.SVGContext(this.element);
    } else {
      throw new _vex.Vex.RERR('InvalidBackend', 'No support for backend: ' + this.backend);
    }
  }

  _createClass(Renderer, [{
    key: 'resize',
    value: function resize(width, height) {
      if (this.backend === Renderer.Backends.CANVAS) {
        if (!this.element.getContext) {
          throw new _vex.Vex.RERR('BadElement', 'Can\'t get canvas context from element: ' + this.elementId);
        }

        var devicePixelRatio = window.devicePixelRatio || 1;

        this.element.width = width * devicePixelRatio;
        this.element.height = height * devicePixelRatio;
        this.element.style.width = width + 'px';
        this.element.style.height = height + 'px';

        this.ctx = Renderer.bolsterCanvasContext(this.element.getContext('2d'));
        this.ctx.scale(devicePixelRatio, devicePixelRatio);
      } else {
        this.ctx.resize(width, height);
      }

      return this;
    }
  }, {
    key: 'getContext',
    value: function getContext() {
      return this.ctx;
    }
  }]);

  return Renderer;
}();