"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Vex Music Notation
// Mohit Muthanna <mohit@muthanna.com>
//
// Copyright Mohit Muthanna 2010

// Bounding boxes for interactive notation

var BoundingBox = exports.BoundingBox = function () {
  _createClass(BoundingBox, null, [{
    key: "copy",
    value: function copy(that) {
      return new BoundingBox(that.x, that.y, that.w, that.h);
    }
  }]);

  function BoundingBox(x, y, w, h) {
    _classCallCheck(this, BoundingBox);

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  _createClass(BoundingBox, [{
    key: "getX",
    value: function getX() {
      return this.x;
    }
  }, {
    key: "getY",
    value: function getY() {
      return this.y;
    }
  }, {
    key: "getW",
    value: function getW() {
      return this.w;
    }
  }, {
    key: "getH",
    value: function getH() {
      return this.h;
    }
  }, {
    key: "setX",
    value: function setX(x) {
      this.x = x;return this;
    }
  }, {
    key: "setY",
    value: function setY(y) {
      this.y = y;return this;
    }
  }, {
    key: "setW",
    value: function setW(w) {
      this.w = w;return this;
    }
  }, {
    key: "setH",
    value: function setH(h) {
      this.h = h;return this;
    }
  }, {
    key: "move",
    value: function move(x, y) {
      this.x += x;this.y += y;
    }
  }, {
    key: "clone",
    value: function clone() {
      return BoundingBox.copy(this);
    }

    // Merge my box with given box. Creates a bigger bounding box unless
    // the given box is contained in this one.

  }, {
    key: "mergeWith",
    value: function mergeWith(boundingBox, ctx) {
      var that = boundingBox;

      var new_x = this.x < that.x ? this.x : that.x;
      var new_y = this.y < that.y ? this.y : that.y;
      var new_w = Math.max(this.x + this.w, that.x + that.w) - new_x;
      var new_h = Math.max(this.y + this.h, that.y + that.h) - new_y;

      this.x = new_x;
      this.y = new_y;
      this.w = new_w;
      this.h = new_h;

      if (ctx) this.draw(ctx);
      return this;
    }
  }, {
    key: "draw",
    value: function draw(ctx, x, y) {
      if (!x) x = 0;
      if (!y) y = 0;
      ctx.rect(this.x + x, this.y + y, this.w, this.h);
      ctx.stroke();
    }
  }]);

  return BoundingBox;
}();