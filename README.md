# evt

An event library with "latest value support, mixin for objects to become event emitters.

Other notes about it:

* The module itself is an event emitter. Useful for "global" pub/sub.
* evt.mix can be used to mix in an event emitter into existing object.
* Notification of listeners is done in a try/catch, so all listeners are notified even if one fails. Errors are thrown async via setTimeout so that all the listeners can be notified without escaping from the code via a throw within the listener group notification.
* New evt.Emitter() can be used to create a new instance of an event emitter.
* Uses "this" internally, so always call object with the emitter args.

## License

[Mozilla Public License, v. 2.0](http://mozilla.org/MPL/2.0/)
