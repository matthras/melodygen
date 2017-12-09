'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Registry = exports.X = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// @author Mohit Cheppudira
//
// ## Description
//
// This file implements a registry for VexFlow elements. It allows users
// to track, query, and manage some subset of generated elements, and
// dynamically get and set attributes.
//
// There are two ways to regiser with a registry:
//
// 1) Explicitly call `element.register(registry)`, or,
// 2) Call `Registry.enableDefaultRegistry(registry)` when ready, and all future
//    elements will automatically register with it.
//
// Once an element is registered, selected attributes are tracked and indexed by
// the registry. This allows fast look up of elements by attributes like id, type,
// and class.

var _vex = require('./vex');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var X = exports.X = _vex.Vex.MakeException('RegistryError');

function setIndexValue(index, name, value, id, elem) {
  if (!index[name][value]) index[name][value] = {};
  index[name][value][id] = elem;
}

var Registry = exports.Registry = function () {
  _createClass(Registry, null, [{
    key: 'INDEXES',
    get: function get() {
      return ['type'];
    }
  }]);

  function Registry() {
    _classCallCheck(this, Registry);

    this.clear();
  }

  // If you call `enableDefaultRegistry`, any new elements will auto-register with
  // the provided registry as soon as they're constructed.


  _createClass(Registry, [{
    key: 'clear',
    value: function clear() {
      // Indexes are represented as maps of maps (of maps). This allows
      // for both multi-labeling (e.g., an element can have multiple classes)
      // and efficient lookup.
      this.index = {
        id: {},
        type: {},
        class: {}
      };
      return this;
    }

    // Updates the indexes for element 'id'. If an element's attribute changes
    // from A -> B, make sure to remove the element from A.

  }, {
    key: 'updateIndex',
    value: function updateIndex(_ref) {
      var id = _ref.id,
          name = _ref.name,
          value = _ref.value,
          oldValue = _ref.oldValue;

      var elem = this.getElementById(id);
      if (oldValue !== null && this.index[name][oldValue]) {
        delete this.index[name][oldValue][id];
      }
      if (value !== null) {
        setIndexValue(this.index, name, value, elem.getAttribute('id'), elem);
      }
    }

    // Register element `elem` with this registry. This adds the element to its index and watches
    // it for attribute changes.

  }, {
    key: 'register',
    value: function register(elem, id) {
      var _this = this;

      id = id || elem.getAttribute('id');

      if (!id) {
        throw new X('Can\'t add element without `id` attribute to registry', elem);
      }

      // Manually add id to index, then update other indexes.
      elem.setAttribute('id', id);
      setIndexValue(this.index, 'id', id, id, elem);
      Registry.INDEXES.forEach(function (name) {
        _this.updateIndex({ id: id, name: name, value: elem.getAttribute(name), oldValue: null });
      });
      elem.onRegister(this);
      return this;
    }
  }, {
    key: 'getElementById',
    value: function getElementById(id) {
      return this.index.id[id] ? this.index.id[id][id] : null;
    }
  }, {
    key: 'getElementsByAttribute',
    value: function getElementsByAttribute(attrName, value) {
      var index = this.index[attrName];
      if (index && index[value]) {
        return Object.keys(index[value]).map(function (i) {
          return index[value][i];
        });
      } else {
        return [];
      }
    }
  }, {
    key: 'getElementsByType',
    value: function getElementsByType(type) {
      return this.getElementsByAttribute('type', type);
    }
  }, {
    key: 'getElementsByClass',
    value: function getElementsByClass(className) {
      return this.getElementsByAttribute('class', className);
    }

    // This is called by the element when an attribute value changes. If an indexed
    // attribute changes, then update the local index.

  }, {
    key: 'onUpdate',
    value: function onUpdate(_ref2) {
      var id = _ref2.id,
          name = _ref2.name,
          value = _ref2.value,
          oldValue = _ref2.oldValue;

      function includes(array, value) {
        return array.filter(function (x) {
          return x === value;
        }).length > 0;
      }

      if (!includes(Registry.INDEXES.concat(['id', 'class']), name)) return this;
      this.updateIndex({ id: id, name: name, value: value, oldValue: oldValue });
      return this;
    }
  }], [{
    key: 'enableDefaultRegistry',
    value: function enableDefaultRegistry(registry) {
      Registry.defaultRegistry = registry;
    }
  }, {
    key: 'getDefaultRegistry',
    value: function getDefaultRegistry() {
      return Registry.defaultRegistry;
    }
  }, {
    key: 'disableDefaultRegistry',
    value: function disableDefaultRegistry() {
      Registry.defaultRegistry = null;
    }
  }]);

  return Registry;
}();

Registry.defaultRegistry = null;