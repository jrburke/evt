/*jshint node: true */
/*global describe, it */
'use strict';

var assert = require('assert'),
    evt = require('../evt');

describe('evt', function() {
  describe('input type checks', function() {

    function isFnError(e) {
      return e.toString().indexOf('fn is not a string or function') !== -1;
    }

    function isMethodError(e) {
      return e.toString().indexOf('Not a method name') !== -1;
    }

    it('throws on bad input', function() {
      var count = 0;

      try {
        evt.on('testOn', 4);
      } catch (e) {
        count += 1;
        assert.equal(true, isFnError(e));
      }

      try {
        evt.once('testOn', null);
      } catch (e) {
        count += 1;
        assert.equal(true, isFnError(e));
      }

      try {
        evt.latest('testOn');
      } catch (e) {
        count += 1;
        assert.equal(true, isFnError(e));
      }

      try {
        evt.latest('testOn', 'testOn');
      } catch (e) {
        count += 1;
        assert.equal(true,
          e.toString()
           .indexOf('Cannot read property \'testOn\' of undefined') !== -1);
      }

      try {
        evt.removeListener('testOn', {});
      } catch (e) {
        count += 1;
        assert.equal(true, isFnError(e));
      }

      try {
        evt.latestOnce('testOn', {}, 'doesNotExist');
      } catch (e) {
        count += 1;
        assert.equal(true, isMethodError(e));
      }

      try {
        evt.latestOnce('testOn', {}, 42);
      } catch (e) {
        count += 1;
        assert.equal(true, isFnError(e));
      }

      assert.equal(count, 7);
    });
  });

});
