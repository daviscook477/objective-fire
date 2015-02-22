angular.module('objective-fire', ['firebase'])

.factory('ObjectFire', function($q, $injector, FireObject) {

  // this here is just kind of a wrapper for storing all the different types of objects

  function ObjectFire(rootRef) {
    if (!this instanceof ObjectFire) {
      return new ObjectiFire(rootRef);
    }
    this.rootRef = rootRef;
    this.objects = {};
  }

  ObjectFire.prototype = {
    // registers an object class
    registerObjectClass: function(schema) {
      this.objects[schema.name] = new FireObject(schema, this.rootRef, this);
      return this.objects[name];
    },
    // gets an object class that has previously been registered
    getObjectClass: function(name) {
      return this.objects[name];
    }
  };

  return ObjectFire;

});
