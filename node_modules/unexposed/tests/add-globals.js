const tap = require('tap');

const { AsyncFunction: AF, GeneratorFunction: GF, Generator: G, addGlobals } = require('..');

tap.test('addGlobals tests', (t) => {
  t.plan(9);

  t.equal(typeof AsyncFunction, 'undefined', 'AsyncFunction should not be defined');
  t.equal(typeof GeneratorFunction, 'undefined', 'GeneratorFunction should not be defined');
  t.equal(typeof Generator, 'undefined', 'Generator should not be defined');

  addGlobals();

  t.ok(AsyncFunction, 'AsyncFunction should be defined');
  t.ok(GeneratorFunction, 'GeneratorFunction should be defined');
  t.ok(Generator, 'Generator should be defined');

  t.equal(AsyncFunction, AF, 'AsyncFunction should be equal to the exported object');
  t.equal(GeneratorFunction, GF, 'GeneratorFunction should be equal to the exported object');
  t.equal(Generator, G, 'Generator should be equal to the exported object');
});
