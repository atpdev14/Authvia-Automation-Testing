'use strict';

const tap = require('tap');

const { GeneratorFunction } = require('..');

tap.test('GeneratorFunction tests', (t) => {
  t.plan(6);

  t.ok(GeneratorFunction, 'GeneratorFunction should be defined');
  t.equal(typeof GeneratorFunction, 'function', 'GeneratorFunction should be a function');
  t.notEqual(GeneratorFunction, Function, 'GeneratorFunction should not be Function');
  t.ok(GeneratorFunction instanceof Function, 'GeneratorFunction should be an instance of Function');
  t.ok(function* () {} instanceof GeneratorFunction, 'A generator function should be an instance of GeneratorFunction');
  t.equal((function* () {}).constructor, GeneratorFunction, 'A generator function should have a constructor of GeneratorFunction');
});
