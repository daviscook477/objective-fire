angular.module('objective-fire')
.factory('ObjectClass', function() {
  /**
  Class of objects in the database
  @class ObjectClass
  @constructor
  @param name {String} The name by which this class will be referenced throughout ObjectiveFire.
  @param objectConstructor {Function} The constructor that will be used to create instances of this class
  @param objectMethods {Object with Function} The methods that will be available on objects of this class. They are provided on an object in which the name of the function on that object will be the name of the function on the instances of the class
  @param properties {Properties} The properties that objects of this class will have
  */
  function ObjectClass(name, objectConstructor, objectMethods, properties) {
    if (!this instanceof ObjectClass) { // failsafe for accidental function call instead of constructor call
      return new ObjectClass(name, objectConstructor, objectMethods, properties);
    }
    if(typeof name !== "string") {
      throw "name must be of type string";
    }
    if (typeof objectConstructor !== "function" && objectConstructor !== null) {
      throw "objectConstructor must be of type function or null";
    }
    if (typeof objectMethods !== "object" && objectMethods !== null) {
      throw "objectMethods must be of type object or null";
    }
    if (typeof properties !== "object" && properties !== null) {
      throw "properties must be of type object or null";
    }
    /**
    @property name
    @type String
    */
    this.name = name;
    /**
    @property objectConstructor
    @type Function
    */
    this.objectConstructor = objectConstructor;
    /**
    @property objectMethods
    @type Object with Function
    */
    this.objectMethods = objectMethods;
    /**
    @property properties
    @type Properties
    */
    this.properties = properties;
  }
  return ObjectClass;
});
