"use strict";

var _prismaClient = require("../generated/prisma-client");

var _countriesIso = _interopRequireDefault(require("./countries.iso.json"));

var _countriesMycaddy = _interopRequireDefault(require("./countries.mycaddy.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/*
async function country_data_dump(data) {
  for (const country of data) {
    const newContry = await prisma.createCountry({
      iso_numeric: country.ISO3166_1_numeric,
      iso_alpha_2: country.ISO3166_1_Alpha_2,
      iso_alpha_3: country.ISO3166_1_Alpha_3,
      name_en: country.display_name,
      dial_number: country.Dial 
    })
   console.log(newContry)
   
   console.log(country.display_name)
  }
}
*/
function country_data_dump_mycaddy() {
  return _country_data_dump_mycaddy.apply(this, arguments);
}

function _country_data_dump_mycaddy() {
  _country_data_dump_mycaddy = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, country, newContry;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context2.prev = 3;
            _iterator = _countriesMycaddy["default"][Symbol.iterator]();

          case 5:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context2.next = 14;
              break;
            }

            country = _step.value;
            _context2.next = 9;
            return _prismaClient.prisma.createCountry({
              // iso_numeric: country.ISO3166_1_numeric,
              // iso_alpha_2: country.ISO3166_1_Alpha_2,
              // iso_alpha_3: country.ISO3166_1_Alpha_3,
              id_number: country.code,
              name_en: country.country
            });

          case 9:
            newContry = _context2.sent;
            console.log(newContry); // console.log(country.display_name)

          case 11:
            _iteratorNormalCompletion = true;
            _context2.next = 5;
            break;

          case 14:
            _context2.next = 20;
            break;

          case 16:
            _context2.prev = 16;
            _context2.t0 = _context2["catch"](3);
            _didIteratorError = true;
            _iteratorError = _context2.t0;

          case 20:
            _context2.prev = 20;
            _context2.prev = 21;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 23:
            _context2.prev = 23;

            if (!_didIteratorError) {
              _context2.next = 26;
              break;
            }

            throw _iteratorError;

          case 26:
            return _context2.finish(23);

          case 27:
            return _context2.finish(20);

          case 28:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[3, 16, 20, 28], [21,, 23, 27]]);
  }));
  return _country_data_dump_mycaddy.apply(this, arguments);
}

function country_data_update_with(_x) {
  return _country_data_update_with.apply(this, arguments);
}

function _country_data_update_with() {
  _country_data_update_with = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(data) {
    var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, country, result;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context3.prev = 3;
            _iterator2 = data[Symbol.iterator]();

          case 5:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context3.next = 20;
              break;
            }

            country = _step2.value;
            _context3.prev = 7;
            _context3.next = 10;
            return _prismaClient.prisma.updateCountry({
              data: {
                iso_numeric: country.ISO3166_1_numeric,
                iso_alpha_2: country.ISO3166_1_Alpha_2,
                iso_alpha_3: country.ISO3166_1_Alpha_3,
                dial_number: country.Dial
              },
              where: {
                name_en: country.display_name
              }
            });

          case 10:
            result = _context3.sent;
            console.log(result);
            _context3.next = 17;
            break;

          case 14:
            _context3.prev = 14;
            _context3.t0 = _context3["catch"](7);
            console.log(_context3.t0);

          case 17:
            _iteratorNormalCompletion2 = true;
            _context3.next = 5;
            break;

          case 20:
            _context3.next = 26;
            break;

          case 22:
            _context3.prev = 22;
            _context3.t1 = _context3["catch"](3);
            _didIteratorError2 = true;
            _iteratorError2 = _context3.t1;

          case 26:
            _context3.prev = 26;
            _context3.prev = 27;

            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }

          case 29:
            _context3.prev = 29;

            if (!_didIteratorError2) {
              _context3.next = 32;
              break;
            }

            throw _iteratorError2;

          case 32:
            return _context3.finish(29);

          case 33:
            return _context3.finish(26);

          case 34:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[3, 22, 26, 34], [7, 14], [27,, 29, 33]]);
  }));
  return _country_data_update_with.apply(this, arguments);
}

var batch_all =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return country_data_dump_mycaddy();

          case 2:
            _context.next = 4;
            return country_data_update_with(_countriesIso["default"]);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function batch_all() {
    return _ref.apply(this, arguments);
  };
}();

batch_all();