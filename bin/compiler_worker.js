const path = require('path');
const fs = require('fs');
const vm = require('vm');
const Module = require('module');
const glob = require('tiny-glob');

//from node.js
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xfeff) {
    content = content.slice(1);
  }
  return content;
}

//from node.js
function stripShebang(content) {
  // Remove shebang
  if (content.charAt(0) === '#' && content.charAt(1) === '!') {
    // Find end of shebang line and slice it off
    let index = content.indexOf('\n', 2);
    if (index === -1) return '';
    if (content.charAt(index - 1) === '\r') index--;
    // Note that this actually includes the newline character(s) in the
    // new output. This duplicates the behavior of the regular expression
    // that was previously used to replace the shebang line.
    content = content.slice(index);
  }
  return content;
}

const jsc_compile = filename => {
  return new Promise((resolve, reject) => {
    console.log('compiling...', filename);
    fs.readFile(filename, 'utf8', (err, content) => {
      if (err) {
        return reject(err);
      }
      const wrapper = Module.wrap(stripShebang(stripBOM(content)));
      const script = new vm.Script(wrapper, {
        produceCachedData: true
      });
      script.runInThisContext({
        filename: filename,
        lineOffset: 0,
        columnOffset: 0,
        displayErrors: true
      });

      if (!script.cachedDataProduced) {
        return reject(new Error('cachedData not Produced'));
      }
      const compiled = script.cachedData;
      const filePath = path.parse(filename);
      delete filePath.base;
      filePath.ext = '.jsc';
      const jscFilename = path.format(filePath);
      fs.writeFile(jscFilename, compiled, error => {
        if (error) {
          return reject(error);
        }
        console.log('compiled', jscFilename);
        return resolve(compiled);
      });
    });
  });
};

const walk = async match => {
  let files = await glob(match, {
    dot: false,
    filesOnly: true
  });
  files.forEach(file => {
    jsc_compile(file);
  });
};

for (let i = 2; i < process.argv.length; i++) {
  walk(process.argv[i]);
}
