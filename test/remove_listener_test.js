/*jshint node: true */
/*global describe, it */
'use strict';

var assert = require('assert'),
    evt = require('../evt');

describe('removeListener', function() {

  it('remove-before-emit-complete', function() {
    var countOne = 0,
        countTwo = 0;

    function incrementOne() {
      countOne += 1;
      evt.removeListener('increment', incrementOne);
    }

    function incrementTwo() {
      countTwo += 1;
    }

    evt.on('increment', incrementOne);
    evt.on('increment', incrementTwo);

    evt.emit('increment');

    assert.equal(countOne, 1);
    assert.equal(countTwo, 1);
  });
});
