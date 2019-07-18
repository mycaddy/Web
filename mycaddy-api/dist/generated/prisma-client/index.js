"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var prisma_lib_1 = require("prisma-client-lib");

var typeDefs = require("./prisma-schema").typeDefs;

var models = [{
  name: "User",
  embedded: false
}, {
  name: "Country",
  embedded: false
}, {
  name: "Club",
  embedded: false
}, {
  name: "Course",
  embedded: false
}, {
  name: "Hole",
  embedded: false
}, {
  name: "Geodata",
  embedded: false
}];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs: typeDefs,
  models: models,
  endpoint: "http://localhost:4466"
});
exports.prisma = new exports.Prisma();