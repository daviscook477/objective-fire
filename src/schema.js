angular.module('objective-fire')

/*
 * THIS IS PROBABLY NO LONGER VALID
 * A schema object represents a class of object in the firebase
 * The schema is created with 2 properties: name and location
 *   name is the name of the class (that is what this class of object will be referenced by)
 *   location is the location in the firebase that these objects will be stored at
 * Properties are added to the schema to represent what data it stores
 * TODO: the admin portion of this library should be able to update the firebase rules with the schemas
 * Normal properties simply define the name of the property in the object and what type of data it can store (string, number, etc...)
 * Pointers are special: they allow objects to store literal pointers to other objects in the firebase
 * When told to, objective fire will automatically evaluate the objects referenced by those pointers and add them to the properties of the object
 */

.factory('Schema', function() {

  // constructor

  function Schema(name, fbLoc, objectConstructor, objectMethods, properties) {
    if (!this instanceof Schema) { // failsafe for accidental function call instead of constructor call
      return new Schema(name, fbLoc, objectConstructor, objectMethods, properties);
    }
    this.name = name;
    this.fbLoc = fbLoc;
    this.objectConstructor = objectConstructor;
    this.objectMethods = objectMethods;
    this.properties = properties;
  }

  /*
   * All the methods that add something to the schema return the schema so they may be chained together
   */

  Schema.prototype = {
    getName: function() {
      return this.name;
    },
    getFBLoc: function() {
      return this.fbLoc;
    },
    getConstructor: function() {
      return this.objectConstructor;
    },
    getMethods: function() {
      return this.objectMethods;
    },
    getProperties: function() {
      return this.properties;
    }
  };
  return Schema;
})
