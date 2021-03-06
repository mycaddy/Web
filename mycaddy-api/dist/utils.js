"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserId = getUserId;
exports.APP_SECRET = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var APP_SECRET = 'mycaddy-react-apollo-prisma';
exports.APP_SECRET = APP_SECRET;

function getUserId(context) {
  var Authorization = context.request.get('Authorization');

  if (Authorization) {
    var token = Authorization.replace('Bearer ', '');

    var _jwt$verify = _jsonwebtoken["default"].verify(token, APP_SECRET),
        userId = _jwt$verify.userId;

    return userId;
  }

  throw new Error('Not authenticated');
}