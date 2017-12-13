Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Fraction = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
// Fraction class that represents a rational number
//
// @author zz85
// @author incompleteopus (modifications)

/* eslint-disable no-underscore-dangle */

var _vex = require('./vex');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Fraction = function () {
  _createClass(Fraction, null, [{
    key: 'GCD',


    /**
     * GCD: Find greatest common divisor using Euclidean algorithm
     */
    value: function GCD(a, b) {
      if (typeof a !== 'number' || typeof b !== 'number') {
        throw new _vex.Vex.RERR('BadArgument', 'Invalid numbers: ' + a + ', ' + b);
      }

      var t = void 0;

      while (b !== 0) {
        t = b;
        b = a % b;
        a = t;
      }

      return a;
    }

    /**
     * LCM: Lowest common multiple
     */

  }, {
    key: 'LCM',
    value: function LCM(a, b) {
      return a * b / Fraction.GCD(a, b);
    }

    /**
     * LCMM: Lowest common multiple for more than two numbers
     */

  }, {
    key: 'LCMM',
    value: function LCMM(args) {
      if (args.length === 0) {
        return 0;
      } else if (args.length === 1) {
        return args[0];
      } else if (args.length === 2) {
        return Fraction.LCM(args[0], args[1]);
      } else {
        var arg0 = args[0];
        args.shift();
        return Fraction.LCM(arg0, Fraction.LCMM(args));
      }
    }
  }]);

  function Fraction(numerator, denominator) {
    _classCallCheck(this, Fraction);

    this.set(numerator, denominator);
  }

  _createClass(Fraction, [{
    key: 'set',
    value: function set(numerator, denominator) {
      this.numerator = numerator === undefined ? 1 : numerator;
      this.denominator = denominator === undefined ? 1 : denominator;
      return this;
    }
  }, {
    key: 'value',
    value: function value() {
      return this.numerator / this.denominator;
    }
  }, {
    key: 'simplify',
    value: function simplify() {
      var u = this.numerator;
      var d = this.denominator;

      var gcd = Fraction.GCD(u, d);
      u /= gcd;
      d /= gcd;

      if (d < 0) {
        d = -d;
        u = -u;
      }
      return this.set(u, d);
    }
  }, {
    key: 'add',
    value: function add(param1, param2) {
      var otherNumerator = void 0;
      var otherDenominator = void 0;

      if (param1 instanceof Fraction) {
        otherNumerator = param1.numerator;
        otherDenominator = param1.denominator;
      } else {
        if (param1 !== undefined) {
          otherNumerator = param1;
        } else {
          otherNumerator = 0;
        }

        if (param2 !== undefined) {
          otherDenominator = param2;
        } else {
          otherDenominator = 1;
        }
      }

      var lcm = Fraction.LCM(this.denominator, otherDenominator);
      var a = lcm / this.denominator;
      var b = lcm / otherDenominator;

      var u = this.numerator * a + otherNumerator * b;
      return this.set(u, lcm);
    }
  }, {
    key: 'subtract',
    value: function subtract(param1, param2) {
      var otherNumerator = void 0;
      var otherDenominator = void 0;

      if (param1 instanceof Fraction) {
        otherNumerator = param1.numerator;
        otherDenominator = param1.denominator;
      } else {
        if (param1 !== undefined) {
          otherNumerator = param1;
        } else {
          otherNumerator = 0;
        }

        if (param2 !== undefined) {
          otherDenominator = param2;
        } else {
          otherDenominator = 1;
        }
      }

      var lcm = Fraction.LCM(this.denominator, otherDenominator);
      var a = lcm / this.denominator;
      var b = lcm / otherDenominator;

      var u = this.numerator * a - otherNumerator * b;
      return this.set(u, lcm);
    }
  }, {
    key: 'multiply',
    value: function multiply(param1, param2) {
      var otherNumerator = void 0;
      var otherDenominator = void 0;

      if (param1 instanceof Fraction) {
        otherNumerator = param1.numerator;
        otherDenominator = param1.denominator;
      } else {
        if (param1 !== undefined) {
          otherNumerator = param1;
        } else {
          otherNumerator = 1;
        }

        if (param2 !== undefined) {
          otherDenominator = param2;
        } else {
          otherDenominator = 1;
        }
      }

      return this.set(this.numerator * otherNumerator, this.denominator * otherDenominator);
    }
  }, {
    key: 'divide',
    value: function divide(param1, param2) {
      var otherNumerator = void 0;
      var otherDenominator = void 0;

      if (param1 instanceof Fraction) {
        otherNumerator = param1.numerator;
        otherDenominator = param1.denominator;
      } else {
        if (param1 !== undefined) {
          otherNumerator = param1;
        } else {
          otherNumerator = 1;
        }

        if (param2 !== undefined) {
          otherDenominator = param2;
        } else {
          otherDenominator = 1;
        }
      }

      return this.set(this.numerator * otherDenominator, this.denominator * otherNumerator);
    }

    // Simplifies both sides and checks if they are equal.

  }, {
    key: 'equals',
    value: function equals(compare) {
      var a = Fraction.__compareA.copy(compare).simplify();
      var b = Fraction.__compareB.copy(this).simplify();

      return a.numerator === b.numerator && a.denominator === b.denominator;
    }

    // Greater than operator.

  }, {
    key: 'greaterThan',
    value: function greaterThan(compare) {
      var a = Fraction.__compareB.copy(this);
      a.subtract(compare);
      return a.numerator > 0;
    }

    // Greater than or equals operator.

  }, {
    key: 'greaterThanEquals',
    value: function greaterThanEquals(compare) {
      var a = Fraction.__compareB.copy(this);
      a.subtract(compare);
      return a.numerator >= 0;
    }

    // Less than operator.

  }, {
    key: 'lessThan',
    value: function lessThan(compare) {
      return !this.greaterThanEquals(compare);
    }

    // Less than or equals operator.

  }, {
    key: 'lessThanEquals',
    value: function lessThanEquals(compare) {
      return !this.greaterThan(compare);
    }

    // Creates a new copy with this current values.

  }, {
    key: 'clone',
    value: function clone() {
      return new Fraction(this.numerator, this.denominator);
    }

    // Copies value of another Fraction into itself.

  }, {
    key: 'copy',
    value: function copy(_copy) {
      return this.set(_copy.numerator, _copy.denominator);
    }

    // Returns the integer component eg. (4/2) == 2

  }, {
    key: 'quotient',
    value: function quotient() {
      return Math.floor(this.numerator / this.denominator);
    }

    // Returns the fraction component when reduced to a mixed number

  }, {
    key: 'fraction',
    value: function fraction() {
      return this.numerator % this.denominator;
    }

    // Returns the absolute value

  }, {
    key: 'abs',
    value: function abs() {
      this.denominator = Math.abs(this.denominator);
      this.numerator = Math.abs(this.numerator);
      return this;
    }

    // Returns a raw string representation

  }, {
    key: 'toString',
    value: function toString() {
      return this.numerator + '/' + this.denominator;
    }

    // Returns a simplified string respresentation

  }, {
    key: 'toSimplifiedString',
    value: function toSimplifiedString() {
      return Fraction.__tmp.copy(this).simplify().toString();
    }

    // Returns string representation in mixed form

  }, {
    key: 'toMixedString',
    value: function toMixedString() {
      var s = '';
      var q = this.quotient();
      var f = Fraction.__tmp.copy(this);

      if (q < 0) {
        f.abs().fraction();
      } else {
        f.fraction();
      }

      if (q !== 0) {
        s += q;

        if (f.numerator !== 0) {
          s += ' ' + f.toSimplifiedString();
        }
      } else {
        if (f.numerator === 0) {
          s = '0';
        } else {
          s = f.toSimplifiedString();
        }
      }

      return s;
    }

    // Parses a fraction string

  }, {
    key: 'parse',
    value: function parse(str) {
      var i = str.split('/');
      var n = parseInt(i[0], 10);
      var d = i[1] ? parseInt(i[1], 10) : 1;

      return this.set(n, d);
    }
  }]);

  return Fraction;
}();

// Temporary cached objects


exports.Fraction = Fraction;
Fraction.__compareA = new Fraction();
Fraction.__compareB = new Fraction();
Fraction.__tmp = new Fraction();