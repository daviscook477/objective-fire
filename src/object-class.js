angular.module('objective-fire')
.factory('ObjectClass', function() {
  /**
  Class of objects in the database
  @class ObjectClass
  @constructor
  @param name {String} The name by which this class will be referenced throughout ObjectiveFire.
  @param objectConstructor {Function} The constructor that will be used to create instances of this class
  @param objectMethods {Array of Function} The methods that will be available on objects of this class
  @param properties {Properties} The properties that objects of this class will have
  */
  function ObjectClass(name, objectConstructor, objectMethods, properties) {
    if (!this instanceof ObjectClass) { // failsafe for accidental function call instead of constructor call
      return new ObjectClass(name, objectConstructor, objectMethods, properties);
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
    @type Array of Function
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
