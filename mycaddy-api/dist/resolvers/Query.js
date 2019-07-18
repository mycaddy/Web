"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function countries(_x, _x2, _x3) {
  return _countries.apply(this, arguments);
}

function _countries() {
  _countries = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(parent, args, context) {
    var count, data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
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