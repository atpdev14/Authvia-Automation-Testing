'use strict';

const tap = require('tap');

const { AsyncFunction } = require('..');

tap.test('AsyncFunction tests', (t) => {
  t.plan(6);

  t.ok(AsyncFunction, 'AsyncFunction should be defined');
  t.equal(typeof AsyncFunction, 'function', 'AsyncFunction should be a function');
  t.notEqual(AsyncFunction, Function, 'AsyncFunction should not be Function');
  t.ok(AsyncFunction instanceof Function, 'AsyncFunction should be an instance of Function');
  t.ok(async function () {} instanceof AsyncFunction, 'An async function should be an instance of AsyncFunction');
  t.equal((async function () {}).constructor, AsyncFunction, 'An async function should have a constructor of AsyncFunction');
});
