'use strict';

var path = require('path');

var engineVersion = process.versions.v8.split('.');
while (engineVersion.length < 4) engineVersion.push('0');

var moduleRoot = path.dirname(module.parent.filename);
delete require.cache[__filename];

var multiform = {
  /**
   * Parses the calling module's `.multiformrc` and returns the build directory
   * of the first build config that is suitable for the current platform.
   */
  select: function select(filename) {
    var i, l, build;
    var config = require(path.join(moduleRoot, 'multiform.json'));

    for (i = 0, l = config.builds.length; i < l; i++) {
      build = config.builds[i];

      if (multiform.compatible(build.version)) {
        var lib = path.resolve(moduleRoot, build.lib || 'lib-' + i);
        if (filename) lib = path.join(lib, filename);
        return lib;
      }
    }

    throw new Error('Multiform: Could not find a build suitable for this platform.');
  },


  /**
   * Selects, requires and returns the correct build for the current platform.
   */
  load: function load(filename) {
    return require(multiform.select(filename));
  },


  /**
   * Checks if the current V8 is >= the given version.
   */
  compatible: function passes(version) {
    if (version) {
      var difference;
      var targetVersion = version.split('.');
      while (engineVersion.length < 4) engineVersion.push('0');

      for (var i = 0; i < 4; i++) {
        difference = (+targetVersion[i]) - (+engineVersion[i]);

        if (difference > 0) return false;
        if (difference < 0) return true;
      }

      return true;
    }

    return true;
  },


  /**
   * Changes the module root. For when you need to require multiform from some
   * file that is for some reason not in the project root where the builds are.
   */
  setModuleRoot: function setModuleRoot(root) {
    moduleRoot = root;
  },
};


module.exports = multiform;
