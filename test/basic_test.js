/*jshint node: true */
/*global describe, beforeEach, it */
'use strict';

var assert = require('assert'),
    evt = require('../evt');

describe('evt', function() {
  describe('#on', function() {

    it('basic use', function() {
      var count = 0;

      evt.on('testOn', function() {
        count += 1;
      });
      evt.emit('testOn');
      evt.emit('testOn');

      //evt calls listeners synchronously, so should be complete now.
      assert.equal(count, 2);
    });

    it('multiple args', function() {
      var count = 0;

      evt.on('testOn', function(first, second) {
        count += 1;
        if (count === 1) {
          assert.equal(first, 'one');
          assert.equal(second, 'two');
        } else if (count === 2) {
          assert.equal(first, 'three');
          assert.equal(second, 'four');
        }
      });
      evt.emit('testOn', 'one', 'two');
      evt.emit('testOn', 'three', 'four');
    });

    it('only catch second emit', function() {
      var count = 0;

      evt.emit('testOn2');

      evt.on('testOn2', function() {
        count += 1;
      });

      evt.emit('testOn2');

      assert.equal(count, 1);
    });

  });

  describe('#once', function() {

    it('basic use', function() {
      var count = 0;

      evt.once('testOnce', function() {
        count += 1;
      });
      evt.emit('testOnce');
      evt.emit('testOnce');
      assert.equal(count, 1);
    });

  });

  describe('#removeListener', function() {

    it('basic use', function() {
      var count = 0;

      function onEvent() {
        count += 1;
        evt.removeListener('testRemoveListener', onEvent);
      }

      evt.on('testRemoveListener', onEvent);
      assert.equal(evt._events.hasOwnProperty('testRemoveListener'), true);

      evt.emit('testRemoveListener');
      evt.emit('testRemoveListener');

      assert.equal(count, 1);
      assert.equal(evt._events.hasOwnProperty('testRemoveListener'), false);
    });

  });


  describe('#emitWhenListener', function() {

    it('basic use', function() {
      var count = 0;

      evt.emitWhenListener('testEmitWhenListener');

      evt.on('testEmitWhenListener', function() {
        count += 1;
      });

      evt.emit('testEmitWhenListener');
      assert.equal(count, 2);
    });
  });

  describe('#latest', function() {
    var data;

    // Executed for each test() below
    beforeEach(function() {
      data = {
        setToken: function(value) {
          this.token = value;
          this.emitWhenListener('token', this.token);
        },
        token: null
      };
      evt.mix(data);
    });

    it('delayed value', function() {
      var count = 0;

      data.latest('token', function(token) {
        count += 1;

        if (count === 1) {
          assert.equal(token, 'one');
        } else if (count === 2) {
          assert.equal(token, 'two');
        }
      });

      data.setToken('one');
      data.setToken('two');

      assert.equal(count, 2);
    });

    it('immediate value', function() {
      var count = 0;

      data.setToken('one');

      data.latest('token', function(token) {
        count += 1;

        if (count === 1) {
          assert.equal(token, 'one');
        } else if (count === 2) {
          assert.equal(token, 'two');
        }
      });

      assert.equal(count, 1);

      data.setToken('two');

      assert.equal(count, 2);
    });

    it('immediate value, after first listener', function() {
      var count = 0;

      data.setToken('one');

      data.latest('token', function(token) {
        count += 1;

        assert.equal(token, 'one');

        // Second latest, which should trigger the callback
        // even though there is no pending emit.
        data.latest('token', function(token) {
          count += 1;

          assert.equal(token, 'one');
          assert.equal(count, 2);
        });
      });

      assert.equal(count, 2);
    });

  });

  describe('#latestOnce', function() {
    var data;

    // Executed for each test() below
    beforeEach(function() {
      data = {
        setToken: function(value) {
          this.token = value;
          this.emitWhenListener('token', this.token);
        },
        token: null
      };
      evt.mix(data);
    });


    it('double latestOnce listeners', function() {
      var count = 0;

      function onLatest(token) {
        count += 1;

        assert.equal(token, 'one');
      }

      data.latestOnce('token', onLatest);
      data.latestOnce('token', onLatest);

      data.setToken('one');
      assert.equal(count, 2);
    });

    it('delayed value', function() {
      var count = 0;

      data.latestOnce('token', function(token) {
        count += 1;

        assert.equal(token, 'one');
      });

      data.setToken('one');
      data.setToken('two');
      assert.equal(count, 1);
    });

    it('immediate value', function() {
      var count = 0;

      data.setToken('one');

      data.latestOnce('token', function(token) {
        count += 1;

        assert.equal(token, 'one');
      });

      assert.equal(count, 1);
      data.setToken('two');
      assert.equal(count, 1);
    });

    it('immediate value, after first listener', function() {
      var count = 0;

      data.setToken('one');

      data.latestOnce('token', function(token) {
        count += 1;

        assert.equal(token, 'one');

        // Second latestOnce, which should trigger the callback
        // even though there is no pending emit.
        data.latestOnce('token', function(token) {
          count += 1;
          assert.equal(token, 'one');
        });
      });

      assert.equal(count, 2);
    });

  });

});
