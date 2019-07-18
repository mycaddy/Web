"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function countries(_x, _x2, _x3) {
  return _countries.apply(this, arguments);
}

function _countries() {
  _countries = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(parent, args, context) {
    var count, data;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return context.prisma.countriesConnection({
              where: {
                OR: [{
                  name_en_contains: args.filter
                }, {
                  name_kr_contains: args.filter
                }, {
                  iso_alpha_3_contains: args.filter
                }, {
                  iso_alpha_2_contains: args.filter
                }]
              }
            }).aggregate().count();

          case 2:
            count = _context.sent;
            _context.next = 5;
            return context.prisma.countries({
              where: {
                OR: [{
                  name_en_contains: args.filter
                }, {
                  name_kr_contains: args.filter
                }, {
                  iso_alpha_3_contains: args.filter
                }, {
                  iso_alpha_2_contains: args.filter
                }]
              },
              skip: args.skip,
              first: args.first,
              orderBy: args.orderBy
            });

          case 5:
            data = _context.sent;
            return _context.abrupt("return", {
              count: count,
              data: data
            });

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _countries.apply(this, arguments);
}

var _default = {
  countries: countries
};
exports["default"] = _default;