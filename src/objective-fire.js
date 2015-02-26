angular.module('objective-fire', ['firebase'])
.factory('ObjectiveFire', function(FireObject) {
  /**
  TODO: Define the ObjectiveFire Object
  @class ObjectiveFire
  @constructor
  @param ref {Firebase} Firebase object at the URL that is your Firebase
  */
  function ObjectiveFire(ref) {
    if (!this instanceof ObjectiveFire) {
      return new ObjectiveFire(ref);
    }
    /**
    Firebase object at the URL that is your Firebase
    @property ref
    @type Firebase
    */
    this.ref = ref;
    /**
    Object that contains all registered classes
    @property objects
    @type Object
    */
    this.objects = {};
  }
  ObjectiveFire.prototype = {
    /**
    Registers a class
    @method registerObjectClass
    @param objectClass {ObjectClass} The class to register
    @return this
    @chainable
    */
    registerObjectClass: function(objectClass) {
      this.objects[objectClass.name] = new FireObject(objetClass, this.ref, this);
      return this;
    },
    /**
    Gets the class stored in this ObjectiveFire for the specified name
    @method getObjectClass
    @param name {String} The name of the class
    @return the class for the specified name
    */
    getObjectClass: function(name) {
      return this.objects[name];
    }
  };
  return ObjectiveFire;
});
