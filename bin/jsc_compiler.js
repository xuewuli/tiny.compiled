#!/usr/bin/env node

const { spawn } = require('child_process');

if (process.argv.length < 3) {
  console.log('use `jsc glob-pattern` to compile js to jsc');
  console.log(' example:');
  console.log('   jsc *.js');
} else {
  const ls = spawn('node', [
    '--nolazy',
    `${__dirname}/compiler_worker.js`,
    ...process.argv.slice(2)
  ]);
  ls.stdout.pipe(process.stdout);
  ls.stderr.pipe(process.stderr);
}
