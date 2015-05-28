/*jshint node: true */
/*global describe, it */
'use strict';

var assert = require('assert'),
    evt = require('../evt');

describe('object listening', function() {

  it('basic', function() {

    var obj = {
      shakeCount: 0,
      rattleCount: 0,
      shake: function() {
        this.shakeCount += 1;
      },

      rattle: function() {
        this.rattleCount += 1;
      }
    };

    evt.on('shake', obj, 'shake');
    evt.on('rattle', obj, 'rattle');

    evt.emit('shake');
    evt.emit('rattle');
    evt.emit('shake');

    evt.removeObjectListener(obj);

    evt.emit('shake');
    evt.emit('rattle');
    evt.emit('shake');
    evt.emit('rattle');

    assert.equal(2, obj.shakeCount);
    assert.equal(1, obj.rattleCount);
  });

  it('once, with object context', function() {

    var obj = {
      rollCount: 0,
      roll: function() {
        this.rollCount += 1;
      }
    };

    evt.once('roll', obj, 'roll');
    evt.emit('roll');
    evt.emit('roll');

    assert.equal(1, obj.rollCount);
  });

  it('once, but removed in removeObjectListener', function() {

    var obj = {
      shakeCount: 0,
      shake: function() {
        this.shakeCount += 1;
      }
    };

    evt.once('shake', obj, 'shake');
    evt.removeObjectListener(obj);
    evt.emit('shake');
    evt.emit('shake');

    assert.equal(0, obj.shakeCount);
  });

  it('latest with object context', function() {
    // Target of listening.
    var data = {
      setToken: function(value) {
        this.token = value;
        this.emitWhenListener('token', this.token);
      },
      token: null
    };
    evt.mix(data);

    // Object doing the listening.
    var obj = {
      tokenValue: null,
      onToken: function(token) {
        this.tokenValue = token;
      }
    };

    data.setToken('yummy');
    data.latest('token', obj, 'onToken');

    assert.equal('yummy', obj.tokenValue);
  });

  it('removeObjectListener on evt mixin', function() {
    // Target of listening.
    function Person(name) {
      evt.Emitter.call(this);
      this.name = name;
    }
    Person.prototype = evt.mix({
      getName: function() {
        return this.name;
      }
    });

    // Object doing the listening.
    var obj = {
      jumpName: null,
      counter: 0,
      onJump: function(jumpName) {
        this.counter += 1;
        this.jumpName = jumpName;
      }
    };

    var oscar = new Person('oscar');
    oscar.on('jump', obj, 'onJump');

    oscar.emit('jump', oscar.getName());
    oscar.removeObjectListener(obj);
    oscar.emit('jump', oscar.getName());

    assert.equal('oscar', obj.jumpName);
    assert.equal(1, obj.counter);
  });
});
