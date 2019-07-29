'use strict';

const expect = require('chai').expect;

describe('simple test', () => {
  it('simple1', done => {
    require('../lib/jsc_loader.js');
    const { a, b, path } = require('./10.js');
    expect(a).equal(10);
    expect(b).equal(20);
    expect(typeof path).equal('string');
    done();
  });
  it('simple2', done => {
    require('../lib/jsc_loader.js');
    const { a, b, path } = require('./10.jsc');
    expect(a).equal(10);
    expect(b).equal(20);
    expect(typeof path).equal('string');
    done();
  });
});
