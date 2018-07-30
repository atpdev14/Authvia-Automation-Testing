'use strict';

const Global = require('the-global-object');

const AsyncFunction = require('./async-function');
const GeneratorFunction = require('./generator-function');
const Generator = require('./generator');

const addGlobals = () => Object.assign(Global, { AsyncFunction, GeneratorFunction, Generator });

Object.assign(addGlobals, {
  AsyncFunction, GeneratorFunction, Generator, addGlobals,
});

module.exports = addGlobals;
