unexposed
=
[![npm install][install-img]][npm-url]
<br>
[![Travis Build Status][travis-shield]][travis-url]
[![CircleCI Build Status][circle-shield]][circle-url]
[![Build Status][travis-img]][travis-url]
[![CircleCI][circle-img]][circle-url]
[![Dependencies Status][david-img]][david-url]
[![Known Vulnerabilities][snyk-img]][snyk-url]
[![Downloads][downloads-img]][stats-url]
[![License][license-img]][license-url]

**This module exposes the unexposed**: `AsyncFunction`, `GeneratorFunction`, `Generator`

TL;DR
-
Before:
```js
> x = function () {};
[Function: x]
> x instanceof Function;
true
> x = async function () {};
[AsyncFunction: x]
> x instanceof AsyncFunction;
ReferenceError: AsyncFunction is not defined
```

After:
```js
> x = function () {};
[Function: x]
> x instanceof Function;
true
> x = async function () {};
[AsyncFunction: x]
> x instanceof AsyncFunction;
true
```

Intro
-
JavaScript has some global objects that are not really exposed as global objects.
I call them **unexposed objects**:

```js
> x = function () {};
[Function: x]
> x instanceof Function;
true
> x = async function () {};
[AsyncFunction: x]
> x instanceof AsyncFunction;
ReferenceError: AsyncFunction is not defined
```

The purpose of this module is to expose the unexposed.
What you do with them is up to you.

The question whether it is smart to use them or they should remain unexposed for eternity
is beyond the scope of this documentation.

Installation
-
To install in a project:
```sh
npm install unexposed
```

Usage
-
Using local variables:
```js
const { AsyncFunction } = require('unexposed');
```

Adding global variables:
```js
require('unexposed').addGlobals();
```
or:
```js
require('unexposed')();
```

Note that it may not be a good idea to add global variables in production code
but it may be useful in REPL or for some experiments.

Returned Objects
-
Currently this modules exposes:

- `AsyncFunction`
- `GeneratorFunction`
- `Generator`

Rationale
-
JavaScript has some global objects that are not really exposed as global objects.
They are usually documented under "global objects" in documentation like MDN, anyway,
because it's hard to classify them otherwise.

For example, we have `Function` in JS Reference / Global Objects:

- https://developer.mozilla.org/JavaScript/Reference/Global_Objects/Function

that explains what `new Function()` does.

We also have `AsyncFunction` in the same JS Reference / Global Objects:

- https://developer.mozilla.org/JavaScript/Reference/Global_Objects/AsyncFunction

that explains what `new AsyncFunction()` does, but it also contains an interesting note:

> "Note that AsyncFunction is not a global object."

In the Node REPL we can create a function and inspect it:

```js
> x = function () {};
[Function: x]
> Function
[Function: Function]
```

but it we do the same with an async function then we get a strange error:

```js
> x = async function () {};
[AsyncFunction: x]
> AsyncFunction
ReferenceError: AsyncFunction is not defined
```

We can easily instantiate `Function` with:

```js
x = new Function();
```

But how can we use `new AsyncFunction()` syntax that is explained in the documentation if `AsyncFunction` is not defined? We need to use hacks like this:

```js
x = new (Object.getPrototypeOf(async function () {}).constructor)();
```

which is unreadable and error prone.

Generators
-
For some context, see:

- https://www.ecma-international.org/ecma-262/6.0/#sec-generator-objects

Especially Figure 2 — Generator Objects Relationships:

[![Figure 2 — Generator Objects Relationships](https://www.ecma-international.org/ecma-262/6.0/figure-2.png)](https://www.ecma-international.org/ecma-262/6.0/#sec-generator-objects)

Both of those hold true:
```js
(function* () {}).constructor.prototype === (function* () {} ()).constructor;
Object.getPrototypeOf(function* () {}).constructor.prototype === Object.getPrototypeOf(function* () {} ()).constructor;
```

And also:
```js
(function* () {}).constructor === Object.getPrototypeOf(function* () {}).constructor;
(function* () {} ()).constructor === Object.getPrototypeOf(function* () {} ()).constructor;
```

But at the same time:
```js
typeof (function* () {}).constructor === 'function';
typeof (function* () {} ()).constructor === 'object';
```
which means that the constructor of a generator is not a function and unlike the constructor of a generator function, you cannot really use this constructor as a constructor!

This is fine:
```js
> new (function* () {}).constructor();
[GeneratorFunction: anonymous]
```
but this is an error:
```js
> new (function* () {} ()).constructor();
TypeError: (intermediate value)(...).constructor is not a constructor
```

Yes, **constructor is not a constructor**.

Issues
------
For any bug reports or feature requests please
[post an issue on GitHub][issues-url].

Author
------
[**Rafał Pocztarski**](https://pocztarski.com/)
<br/>
[![Follow on GitHub][github-follow-img]][github-follow-url]
[![Follow on Twitter][twitter-follow-img]][twitter-follow-url]
<br/>
[![Follow on Stack Exchange][stackexchange-img]][stackoverflow-url]

License
-------
MIT License (Expat). See [LICENSE.md](LICENSE.md) for details.

[npm-url]: https://www.npmjs.com/package/unexposed
[github-url]: https://github.com/rsp/node-unexposed
[readme-url]: https://github.com/rsp/node-unexposed#readme
[issues-url]: https://github.com/rsp/node-unexposed/issues
[license-url]: https://github.com/rsp/node-unexposed/blob/master/LICENSE.md
[travis-url]: https://travis-ci.org/rsp/node-unexposed
[travis-img]: https://travis-ci.org/rsp/node-unexposed.svg?branch=master
[travis-shield]: https://img.shields.io/travis/rsp/node-unexposed.svg?label=Travis+CI
[circle-url]: https://circleci.com/gh/rsp/node-unexposed
[circle-img]: https://circleci.com/gh/rsp/node-unexposed.svg
[circle-shield]: https://img.shields.io/circleci/project/github/rsp/node-unexposed.svg?label=Circle+CI
[snyk-url]: https://snyk.io/test/github/rsp/node-unexposed
[snyk-img]: https://snyk.io/test/github/rsp/node-unexposed/badge.svg
[david-url]: https://david-dm.org/rsp/node-unexposed
[david-img]: https://david-dm.org/rsp/node-unexposed/status.svg
[install-img]: https://nodei.co/npm/unexposed.png?compact=true
[downloads-img]: https://img.shields.io/npm/dt/unexposed.svg
[license-img]: https://img.shields.io/npm/l/unexposed.svg
[stats-url]: http://npm-stat.com/charts.html?package=unexposed
[github-follow-url]: https://github.com/rsp
[github-follow-img]: https://img.shields.io/github/followers/rsp.svg?style=social&label=Follow
[twitter-follow-url]: https://twitter.com/intent/follow?screen_name=pocztarski
[twitter-follow-img]: https://img.shields.io/twitter/follow/pocztarski.svg?style=social&label=Follow
[stackoverflow-url]: https://stackoverflow.com/users/613198/rsp
[stackexchange-url]: https://stackexchange.com/users/303952/rsp
[stackexchange-img]: https://stackexchange.com/users/flair/303952.png
