# multiform

A simple system for writing modules that ship with multiple Babel builds, each optimised for a different V8 version.


## Why

This is a stopgap for people who want to write ES6-7 code today, using things like generators and async functions, and build it with [Babel](http://babeljs.io/) – but without simply compiling everything down to ES5.

Ideally you want your users to run real, native generators where supported (because they're faster, they're more debuggable, and they don't require a runtime library) while still providing an ES5-only build for users on older platforms.

Multiform helps organise this kind of setup.


## How

- You define your Babel configurations in `multiform.json`.
- The `multiform` command (installed as a devDependency, [multiform-build](https://github.com/callumlocke/multiform-build), and run on prepublish) builds your `src` folder into `dist-0`, `dist-1` etc. corresponding with your Babel configurations.
- Your main script automatically selects and loads the best dist for the current V8 version, like this: `module.exports = require('multiform').load();`

See [multiform-template](https://github.com/callumlocke/multiform-template) for an example setup.


## multiform.json reference

- `builds` – array of objects with these properties:
  - `version` (optional) – the minimum version of V8 that can run this build.
  - `options` – the [Babel options](http://babeljs.io/docs/usage/options/).
- `defaults` (optional) – base options shared by all your builds. (Each build config will be deep-merged into this.)

Example:

```json
{
  "builds": [
    {
      "version": "4.1.0.27",
      "options": {
        "blacklist": [
          "regenerator",
          "es6.forOf",
          "es6.templateLiterals",
          "es6.constants"
        ],
        "optional": [
          "bluebirdCoroutines"
        ]
      }
    },
    {
      "options": {
        "optional": [
          "runtime",
          "es7.asyncFunctions"
        ]
      }
    }
  ],

  "defaults": {
    "loose": true
  }
}
```
