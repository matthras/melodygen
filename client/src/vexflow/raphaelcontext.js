'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
// A rendering context for the Raphael backend.
//
// ## Warning: Deprecated for SVGContext
// Except in instances where SVG support for IE < 9.0 is
// needed, SVGContext is recommended.

var RaphaelContext = exports.RaphaelContext = function () {
  function RaphaelContext(element) {
    _classCallCheck(this, RaphaelContext);

    this.element = element;
    this.paper = Raphael(element); // eslint-disable-line
    this.path = '';
    this.pen = { x: 0, y: 0 };
    this.lineWidth = 1.0;
    this.state = {
      scale: { x: 1, y: 1 },
      font_family: 'Arial',
      font_size: 8,
      font_weight: 800
    };

    this.attributes = {
      'stroke-width': 0.3,
      'fill': 'black',
      'stroke': 'black',
      'font': '10pt Arial'
    };

    this.background_attributes = {
      'stroke-width': 0,
      'fill': 'white',
      'stroke': 'white',
      'font': '10pt Arial'
    };

    this.shadow_attributes = {
      width: 0,
      color: 'black'
    };

    this.state_stack = [];
  }

  // Containers not implemented


  _createClass(RaphaelContext, [{
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
      this.state.font_family = family;
      this.state.font_size = size;
      this.state.font_weight = weight;
      this.attributes.font = (this.state.font_weight || '') + ' ' + this.state.font_size * this.state.scale.x + 'pt ' + this.state.font_family;
      return this;
    }
  }, {
    key: 'setRawFont',
    value: function setRawFont(font) {
      this.attributes.font = font;
      return this;
    }
  }, {
    key: 'setFillStyle',
    value: function setFillStyle(style) {
      this.attributes.fill = style;
      return this;
    }
  }, {
    key: 'setBackgroundFillStyle',
    value: function setBackgroundFillStyle(style) {
      this.background_attributes.fill = style;
      this.background_attributes.stroke = style;
      return this;
    }
  }, {
    key: 'setStrokeStyle',
    value: function setStrokeStyle(style) {
      this.attributes.stroke = style;
      return this;
    }
  }, {
    key: 'setShadowColor',
    value: function setShadowColor(style) {
      this.shadow_attributes.color = style;
      return this;
    }
  }, {
    key: 'setShadowBlur',
    value: function setShadowBlur(blur) {
      this.shadow_attributes.width = blur;
      return this;
    }
  }, {
    key: 'setLineWidth',
    value: function setLineWidth(width) {
      this.attributes['stroke-width'] = width;
      this.lineWidth = width;
    }

    // Empty because there is no equivalent in SVG

  }, {
    key: 'setLineDash',
    value: function setLineDash() {
      return this;
    }
  }, {
    key: 'setLineCap',
    value: function setLineCap() {
      return this;
    }
  }, {
    key: 'scale',
    value: function scale(x, y) {
      this.state.scale = { x: x, y: y };
      // The scale() method is deprecated as of Raphael.JS 2.0, and
      // can no longer be used as an option in an Element.attr() call.
      // It is preserved here for users running earlier versions of
      // Raphael.JS, though it has no effect on the SVG output in
      // Raphael 2 and higher.
      this.attributes.transform = 'S' + x + ',' + y + ',0,0';
      this.attributes.scale = x + ',' + y + ',0,0';
      this.attributes.font = this.state.font_size * this.state.scale.x + 'pt ' + this.state.font_family;
      this.background_attributes.transform = 'S' + x + ',' + y + ',0,0';
      this.background_attributes.font = this.state.font_size * this.state.scale.x + 'pt ' + this.state.font_family;
      return this;
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.paper.clear();
    }
  }, {
    key: 'resize',
    value: function resize(width, height) {
      this.element.style.width = width;
      this.paper.setSize(width, height);
      return this;
    }

    // Sets the SVG `viewBox` property, which results in auto scaling images when its container
    // is resized.
    //
    // Usage: `ctx.setViewBox("0 0 600 400")`

  }, {
    key: 'setViewBox',
    value: function setViewBox(viewBox) {
      this.paper.canvas.setAttribute('viewBox', viewBox);
    }
  }, {
    key: 'rect',
    value: function rect(x, y, width, height) {
      if (height < 0) {
        y += height;
        height = -height;
      }

      this.paper.rect(x, y, width - 0.5, height - 0.5).attr(this.attributes).attr('fill', 'none').attr('stroke-width', this.lineWidth);
      return this;
    }
  }, {
    key: 'fillRect',
    value: function fillRect(x, y, width, height) {
      if (height < 0) {
        y += height;
        height = -height;
      }

      this.paper.rect(x, y, width - 0.5, height - 0.5).attr(this.attributes);
      return this;
    }
  }, {
    key: 'clearRect',
    value: function clearRect(x, y, width, height) {
      if (height < 0) {
        y += height;
        height = -height;
      }

      this.paper.rect(x, y, width - 0.5, height - 0.5).attr(this.background_attributes);
      return this;
    }
  }, {
    key: 'beginPath',
    value: function beginPath() {
      this.path = '';
      this.pen.x = 0;
      this.pen.y = 0;
      return this;
    }
  }, {
    key: 'moveTo',
    value: function moveTo(x, y) {
      this.path += 'M' + x + ',' + y;
      this.pen.x = x;
      this.pen.y = y;
      return this;
    }
  }, {
    key: 'lineTo',
    value: function lineTo(x, y) {
      this.path += 'L' + x + ',' + y;
      this.pen.x = x;
      this.pen.y = y;
      return this;
    }
  }, {
    key: 'bezierCurveTo',
    value: function bezierCurveTo(x1, y1, x2, y2, x, y) {
      this.path += 'C' + x1 + ',' + y1 + ',' + x2 + ',' + y2 + ',' + x + ',' + y;
      this.pen.x = x;
      this.pen.y = y;
      return this;
    }
  }, {
    key: 'quadraticCurveTo',
    value: function quadraticCurveTo(x1, y1, x, y) {
      this.path += 'Q' + x1 + ',' + y1 + ',' + x + ',' + y;
      this.pen.x = x;
      this.pen.y = y;
      return this;
    }

    // This is an attempt (hack) to simulate the HTML5 canvas
    // arc method.

  }, {
    key: 'arc',
    value: function arc(x, y, radius, startAngle, endAngle, antiClockwise) {
      function normalizeAngle(angle) {
        while (angle < 0) {
          angle += Math.PI * 2;
        }

        while (angle > Math.PI * 2) {
          angle -= Math.PI * 2;
        }
        return angle;
      }

      startAngle = normalizeAngle(startAngle);
      endAngle = normalizeAngle(endAngle);

      if (startAngle > endAngle) {
        var tmp = startAngle;
        startAngle = endAngle;
        endAngle = tmp;
        antiClockwise = !antiClockwise;
      }

      var delta = endAngle - startAngle;

      if (delta > Math.PI) {
        this.arcHelper(x, y, radius, startAngle, startAngle + delta / 2, antiClockwise);
        this.arcHelper(x, y, radius, startAngle + delta / 2, endAngle, antiClockwise);
      } else {
        this.arcHelper(x, y, radius, startAngle, endAngle, antiClockwise);
      }
      return this;
    }
  }, {
    key: 'arcHelper',
    value: function arcHelper(x, y, radius, startAngle, endAngle, antiClockwise) {
      var x1 = x + radius * Math.cos(startAngle);
      var y1 = y + radius * Math.sin(startAngle);

      var x2 = x + radius * Math.cos(endAngle);
      var y2 = y + radius * Math.sin(endAngle);

      var largeArcFlag = 0;
      var sweepFlag = 0;
      if (antiClockwise) {
        sweepFlag = 1;
        if (endAngle - startAngle < Math.PI) {
          largeArcFlag = 1;
        }
      } else if (endAngle - startAngle > Math.PI) {
        largeArcFlag = 1;
      }

      this.path += 'M' + x1 + ',' + y1 + ',A' + radius + ',' + radius + ',0,' + largeArcFlag + ',' + sweepFlag + ',' + x2 + ',' + y2 + 'M' + this.pen.x + ',' + this.pen.y;
    }

    // Adapted from the source for Raphael's Element.glow

  }, {
    key: 'glow',
    value: function glow() {
      var out = this.paper.set();
      if (this.shadow_attributes.width > 0) {
        var sa = this.shadow_attributes;
        var num_paths = sa.width / 2;
        for (var i = 1; i <= num_paths; i++) {
          out.push(this.paper.path(this.path).attr({
            stroke: sa.color,
            'stroke-linejoin': 'round',
            'stroke-linecap': 'round',
            'stroke-width': +(sa.width / num_paths * i).toFixed(3),
            opacity: +((sa.opacity || 0.3) / num_paths).toFixed(3),
            // See note in this.scale(): In Raphael the scale() method
            // is deprecated and removed as of Raphael 2.0 and replaced
            // by the transform() method.  It is preserved here for
            // users with earlier versions of Raphael, but has no effect
            // on the output SVG in Raphael 2.0+.
            transform: this.attributes.transform,
            scale: this.attributes.scale
          }));
        }
      }
      return out;
    }
  }, {
    key: 'fill',
    value: function fill() {
      var elem = this.paper.path(this.path).attr(this.attributes).attr('stroke-width', 0);
      this.glow(elem);
      return this;
    }
  }, {
    key: 'stroke',
    value: function stroke() {
      // The first line of code below is, unfortunately, a bit of a hack:
      // Raphael's transform() scaling does not scale the stroke-width, so
      // in order to scale a stroke, we have to manually scale the
      // stroke-width.
      //
      // This works well so long as the X & Y states for this.scale() are
      // relatively similar.  However, if they are very different, we
      // would expect horizontal and vertical lines to have different
      // stroke-widths.
      //
      // In the future, if we want to support very divergent values for
      // horizontal and vertical scaling, we may want to consider
      // implementing SVG scaling with properties of the SVG viewBox &
      // viewPort and removing it entirely from the Element.attr() calls.
      // This would more closely parallel the approach taken in
      // canvascontext.js as well.

      var strokeWidth = this.lineWidth * (this.state.scale.x + this.state.scale.y) / 2;
      var elem = this.paper.path(this.path).attr(this.attributes).attr('fill', 'none').attr('stroke-width', strokeWidth);
      this.glow(elem);
      return this;
    }
  }, {
    key: 'closePath',
    value: function closePath() {
      this.path += 'Z';
      return this;
    }
  }, {
    key: 'measureText',
    value: function measureText(text) {
      var txt = this.paper.text(0, 0, text).attr(this.attributes).attr('fill', 'none').attr('stroke', 'none');
      var bounds = txt.getBBox();
      txt.remove();

      return {
        width: bounds.width,
        height: bounds.height
      };
    }
  }, {
    key: 'fillText',
    value: function fillText(text, x, y) {
      this.paper.text(x + this.measureText(text).width / 2, y - this.state.font_size / (2.25 * this.state.scale.y), text).attr(this.attributes);

      return this;
    }
  }, {
    key: 'save',
    value: function save() {
      // TODO(mmuthanna): State needs to be deep-copied.
      this.state_stack.push({
        state: {
          font_family: this.state.font_family
        },
        attributes: {
          font: this.attributes.font,
          fill: this.attributes.fill,
          stroke: this.attributes.stroke,
          'stroke-width': this.attributes['stroke-width']
        },
        shadow_attributes: {
          width: this.shadow_attributes.width,
          color: this.shadow_attributes.color
        }
      });
      return this;
    }
  }, {
    key: 'restore',
    value: function restore() {
      // TODO(0xfe): State needs to be deep-restored.
      var state = this.state_stack.pop();
      this.state.font_family = state.state.font_family;
      this.attributes.font = state.attributes.font;
      this.attributes.fill = state.attributes.fill;
      this.attributes.stroke = state.attributes.stroke;
      this.attributes['stroke-width'] = state.attributes['stroke-width'];
      this.shadow_attributes.width = state.shadow_attributes.width;
      this.shadow_attributes.color = state.shadow_attributes.color;
      return this;
    }
  }]);

  return RaphaelContext;
}();