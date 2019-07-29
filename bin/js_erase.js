#!/usr/bin/env node

const glob = require('tiny-glob');
const fs = require('fs');

const walk = async match => {
  let files = await glob(match, {
    dot: false,
    filesOnly: true
  });
  files.forEach(file => {
    fs.writeFile(file, '', error => {});
  });
};

if (process.argv.length < 3) {
  console.log('use `js-erase glob-pattern` to erase js');
  console.log(' example:');
  console.log('   js-erase *.js');
} else {
  for (let i = 2; i < process.argv.length; i++) {
    walk(process.argv[i]);
  }
}
