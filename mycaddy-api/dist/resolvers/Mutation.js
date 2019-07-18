"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { if (i % 2) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else { Object.defineProperties(target, Object.getOwnPropertyDescriptors(arguments[i])); } } return target; }

var _require = require('../utils'),
    APP_SECRET = _require.APP_SECRET,
    getUserId = _require.getUserId;

function signUp(_x, _x2, _x3) {
  return _signUp.apply(this, arguments);
}

function _signUp() {
  _signUp = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(parent, args, context) {
    var password, user, token;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _bcryptjs["default"].hash(args.password, 10);

          case 2:
            password = _context.sent;
            _context.next = 5;
            return context.prisma.createUser(_objectSpread({}, args, {
              password: password
            }));

          case 5:
            user = _context.sent;
            token = _jsonwebtoken["default"].sign({
              userId: user.id
            }, APP_SECRET);
            return _context.abrupt("return", {
              token: token,
              user: user
            });

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _signUp.apply(this, arguments);
}

function signIn(_x4, _x5, _x6) {
  return _signIn.apply(this, arguments);
}

function _signIn() {
  _signIn = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(parent, args, context) {
    var user, valid;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return context.prisma.user({
              email: args.email
            });

          case 2:
            user = _context2.sent;

            if (user) {
              _context2.next = 5;
              break;
            }

            throw new Error('No such user found');

          case 5:
            _context2.next = 7;
            return _bcryptjs["default"].compare(args.password, user.password);

          case 7:
            valid = _context2.sent;

            if (valid) {
              _context2.next = 10;
              break;
            }

            throw new Error('Invalid password');

          case 10:
            return _context2.abrupt("return", {
              token: _jsonwebtoken["default"].sign({
                userId: user.id
              }, APP_SECRET),
              user: user
            });

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _signIn.apply(this, arguments);
}

function createCountry(parent, args, context) {
  return context.prisma.createCountry(args.data);
}

function updateCountry(parent, args, context) {
  return context.prisma.updateCountry({
    where: {
      id: args.id
    },
    data: args.data
  });
}

function deleteCountry(parent, args, context) {
  return context.prisma.deleteCountry({
    id: args.id
  });
}

var _default = {
  signUp: signUp,
  signIn: signIn,
  createCountry: createCountry,
  updateCountry: updateCountry,
  deleteCountry: deleteCountry
};
exports["default"] = _default;