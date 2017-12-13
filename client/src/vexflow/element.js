Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Element = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// @author Mohit Cheppudira
//
// ## Description
//
// This file implements a generic base class for VexFlow, with implementations
// of general functions and properties that can be inherited by all VexFlow elements.

var _vex = require('./vex');

var _registry = require('./registry');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Element = exports.Element = function () {
  _createClass(Element, null, [{
    key: 'newID',
    value: function newID() {
      return 'auto' + Element.ID++;
    }
  }]);

  function Element() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        type = _ref.type;

    _classCallCheck(this, Element);

    this.attrs = {
      id: Element.newID(),
      el: null,
      type: type || 'Base',
      classes: {}
    };

    this.boundingBox = null;
    this.context = null;
    this.rendered = false;

    // If a default registry exist, then register with it right away.
    if (_registry.Registry.getDefaultRegistry()) {
      _registry.Registry.getDefaultRegistry().register(this);
    }
  }

  // set the draw style of a stemmable note:


  _createClass(Element, [{
    key: 'setStyle',
    value: function setStyle(style) {
      this.style = style;return this;
    }
  }, {
    key: 'getStyle',
    value: function getStyle() {
      return this.style;
    }

    // Apply current style to Canvas `context`

  }, {
    key: 'applyStyle',
    value: function applyStyle() {
      var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.context;
      var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.getStyle();

      if (!style) return this;

      context.save();
      if (style.shadowColor) context.setShadowColor(style.shadowColor);
      if (style.shadowBlur) context.setShadowBlur(style.shadowBlur);
      if (style.fillStyle) context.setFillStyle(style.fillStyle);
      if (style.strokeStyle) context.setStrokeStyle(style.strokeStyle);
      if (style.lineWidth) context.setLineWidth(style.lineWidth);
      return this;
    }
  }, {
    key: 'restoreStyle',
    value: function restoreStyle() {
      var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.context;
      var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.getStyle();

      if (!style) return this;
      context.restore();
      return this;
    }

    // An element can have multiple class labels.

  }, {
    key: 'hasClass',
    value: function hasClass(className) {
      return this.attrs.classes[className] === true;
    }
  }, {
    key: 'addClass',
    value: function addClass(className) {
      this.attrs.classes[className] = true;
      if (this.registry) {
        this.registry.onUpdate({
          id: this.getAttribute('id'),
          name: 'class',
          value: className,
          oldValue: null
        });
      }
      return this;
    }
  }, {
    key: 'removeClass',
    value: function removeClass(className) {
      delete this.attrs.classes[className];
      if (this.registry) {
        this.registry.onUpdate({
          id: this.getAttribute('id'),
          name: 'class',
          value: null,
          oldValue: className
        });
      }
      return this;
    }

    // This is called by the registry after the element is registered.

  }, {
    key: 'onRegister',
    value: function onRegister(registry) {
      this.registry = registry;return this;
    }
  }, {
    key: 'isRendered',
    value: function isRendered() {
      return this.rendered;
    }
  }, {
    key: 'setRendered',
    value: function setRendered() {
      var rendered = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.rendered = rendered;return this;
    }
  }, {
    key: 'getAttributes',
    value: function getAttributes() {
      return this.attrs;
    }
  }, {
    key: 'getAttribute',
    value: function getAttribute(name) {
      return this.attrs[name];
    }
  }, {
    key: 'setAttribute',
    value: function setAttribute(name, value) {
      var id = this.attrs.id;
      var oldValue = this.attrs[name];
      this.attrs[name] = value;
      if (this.registry) {
        // Register with old id to support id changes.
        this.registry.onUpdate({ id: id, name: name, value: value, oldValue: oldValue });
      }
      return this;
    }
  }, {
    key: 'getContext',
    value: function getContext() {
      return this.context;
    }
  }, {
    key: 'setContext',
    value: function setContext(context) {
      this.context = context;return this;
    }
  }, {
    key: 'getBoundingBox',
    value: function getBoundingBox() {
      return this.boundingBox;
    }

    // Validators

  }, {
    key: 'checkContext',
    value: function checkContext() {
      if (!this.context) {
        throw new _vex.Vex.RERR('NoContext', 'No rendering context attached to instance');
      }
      return this.context;
    }
  }]);

  return Element;
}();

Element.ID = 1000;