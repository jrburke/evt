/*jshint node: true */
/*global describe, it */
'use strict';

var assert = require('assert'),
    evt = require('../evt');

describe('evt', function() {
  describe('#error listener', function() {

    it('top level use', function() {
      var err,
          count = 0;

      function onError(e) {
        err = e;
      }

      evt.on('error', onError);

      evt.on('testOn', function() {
        throw new Error('oops');
      });

      evt.on('testOn', function() {
        count += 1;
      });

      evt.emit('testOn');

      assert.equal(count, 1);
      assert.equal(true, !!err);

      evt.removeListener('error', onError);
    });


    it('instance level use', function() {
      var err,
          count = 0;

      function onError(e) {
        err = e;
      }

      evt.on('error', onError);

      var thing = evt.mix({});


      thing.on('testOn', function() {
        throw new Error('oops');
      });

      thing.on('testOn', function() {
        count += 1;
      });

      thing.emit('testOn');

      assert.equal(count, 1);
      assert.equal(true, !!err);

      evt.removeListener('error', onError);
    });
  });

});
