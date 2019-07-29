const { b } = require('./20.js');

const path = require.resolve('./20.js');

require.resolve.paths('.');

module.exports = {
  a: 10,
  b,
  path
};
