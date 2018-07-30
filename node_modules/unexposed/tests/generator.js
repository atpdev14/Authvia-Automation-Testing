'use strict';

const tap = require('tap');

const { Generator, GeneratorFunction } = require('..');

tap.test('Generator tests', (t) => {
  t.plan(21);

  t.ok(Generator, 'Generator should be defined');
  t.equal(typeof Generator, 'object', 'Generator should be an object');
  t.notEqual(Generator, GeneratorFunction, 'Generator should not be GeneratorFunction');
  t.ok(Generator instanceof Function, 'Generator should be an instance of Function');
  t.notOk(function* () {} () instanceof Generator, 'A generator should not be an instance of Generator');
  t.equal((function* () {} ()).constructor, Generator, 'A generator should have a constructor of Generator');
  t.ok((function* () {} ()).next, 'A generator should have a property next');
  t.ok((function* () {} ()).return, 'A generator should have a property return');
  t.ok((function* () {} ()).throw, 'A generator should have a property throw');
  t.notOk((function* () {} ()).hasOwnProperty('next'), 'A generator should not have own property next');
  t.notOk((function* () {} ()).hasOwnProperty('return'), 'A generator should not have own property return');
  t.notOk((function* () {} ()).hasOwnProperty('throw'), 'A generator should not have own property throw');
  t.ok(Generator.prototype.hasOwnProperty('next'), 'Generator.prototype should have own property next');
  t.ok(Generator.prototype.hasOwnProperty('return'), 'Generator.prototype should have own property return');
  t.ok(Generator.prototype.hasOwnProperty('throw'), 'Generator.prototype should have own property throw');
  t.equal(typeof Generator.prototype.next, 'function', 'Generator.prototype.next should be a function');
  t.equal(typeof Generator.prototype.return, 'function', 'Generator.prototype.return should be a function');
  t.equal(typeof Generator.prototype.throw, 'function', 'Generator.prototype.throw should be a function');
  t.equal((function* () {} ()).next, Generator.prototype.next, 'A generator should have a property next from Generator.prototype');
  t.equal((function* () {} ()).return, Generator.prototype.return, 'A generator should have a property return from Generator.prototype');
  t.equal((function* () {} ()).throw, Generator.prototype.throw, 'A generator should have a property throw from Generator.prototype');
});
