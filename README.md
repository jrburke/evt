# evt

An event library with "latest value support, mixin for objects to become event emitters.

Other notes about it:

 * the module itself is an event emitter. Useful for "global" pub/sub.
 * evt.mix can be used to mix in an event emitter into existing object.
 * notification of listeners is done in a try/catch, so all listeners
   are notified even if one fails.
 * Errors when notifying listeners in emit() are available via
   evt.emit('error'). If there are no error listeners for 'error', then
   console.error() is used to log the error with a stack trace.
 * new evt.Emitter() can be used to create a new instance of an
   event emitter.
 * Uses "this" internally, so always call object with the emitter args.
 * Allows passing Object, propertyName for listeners, to allow
   Object[propertyName].apply(Object, ...) listener calls.

## License

[Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0)
