const fs = require('fs');
const path = require('path');
const Module = require('module');
const vm = require('vm');

const originJSExt = Module._extensions['.js'];

const hasRequireResolvePaths = typeof require.resolve.paths === 'function';

const _jsc_loader = (filename, content) => {
  const len = content.slice(8, 12).reduce((sum, number, power) => {
    return (sum += number * Math.pow(256, power));
  });

  const dummyCode = ' '.repeat(len);

  const script = new vm.Script(dummyCode, {
    filename: filename,
    lineOffset: 0,
    displayErrors: true,
    cachedData: content
  });

  return script.runInThisContext({
    filename: filename,
    lineOffset: 0,
    columnOffset: 0,
    displayErrors: true
  });
};

const _jsc_warpper = (mod, content, filename) => {
  function require(id) {
    return mod.require(id);
  }

  function resolve(request, options) {
    return Module._resolveFilename(request, mod, false, options);
  }
  require.resolve = resolve;

  if (hasRequireResolvePaths) {
    resolve.paths = function paths(request) {
      return Module._resolveLookupPaths(request, mod, true);
    };
  }

  require.main = process.mainModule;

  require.extensions = Module._extensions;
  require.cache = Module._cache;

  const dirname = path.dirname(filename);

  const compiledWrapper = _jsc_loader(filename, content);

  const args = [mod.exports, require, mod, filename, dirname, process, global];
  return compiledWrapper.apply(mod.exports, args);
};

const _jsc_extension = (module, filename) => {
  const content = fs.readFileSync(filename);
  _jsc_warpper(module, content, filename);
};

const _js_extension_hook = (module, filename) => {
  const filePath = path.parse(filename);
  delete filePath.base;
  filePath.ext = '.jsc';
  const jscFileName = path.format(filePath);
  if (fs.existsSync(jscFileName)) {
    const content = fs.readFileSync(jscFileName);
    _jsc_warpper(module, content, filename);
  } else {
    originJSExt(module, filename);
  }
};

Module._extensions['.js'] = _js_extension_hook;
Module._extensions['.jsc'] = _jsc_extension;
