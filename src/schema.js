angular.module('objective-fire')

/*
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

  console.log("Schema Factory: constructor being defined");

  function Schema(name, loc) {
    this.name = name;
    this.loc = loc;
    this.objectConstructor = null;
    this.properties = {
      normal: {},
      pointers: {
        data: {},
        list: {}
      }
    };
    console.log("creating schema for '" + name + "' with location in firebase of " + loc);
  }

  console.log("Schema Factory: prototype being defined");

  /*
   * All the methods that add something to the schema return the schema so they may be chained together
   */

  Schema.prototype = {
    setConstructor: function(objectConstructor) {
      console.log("setting constructor");
      this.objectConstructor = objectConstructor;
      return this;
    },
    getName: function() {
      return this.name;
    },
    getLocation: function() {
      return this.loc;
    },
    getConstructor: function() {
      return this.objectConstructor;
    },
    addDataProperty: function(name, dataType) {
      console.log("creating property: " + name + " of type: " + dataType);
      this.properties.normal[name] = dataType;
      return this;
    },
    addPointerDataProperty: function(name, objectClass) {
      console.log("creating pointer data property: " + name + " of class: " + objectClass);
      this.properties.pointers.data[name] = {
        type: "pointerData",
        object: objectClass
      };
      return this;
    },
    addPointerListProperty: function(name, objectClass) {
      console.log("creating pointer list property: " + name + " of class: " + objectClass);
      this.properties.pointers.list[name] = {
        type: "pointerList",
        object: objectClass
      };
      return this;
    },
    // removes all a property (regardless of if it is normal data or if it is a pointer)
    // returns true on success, false on failure
    removeProperty: function(name) {
      try { //TODO: this method totally doesn't work
        for (param in this.properties) {
          this.properties[param][name] = null;
        }
        return true;
      } catch(err) {
        return false;
      }
    },
    getProperties: function() {
      return this.properties;
    },
    getDataProperties: function() {
      return this.properties.normal;
    },
    getPointerDataProperties: function() {
      return this.properties.pointers.data;
    },
    getPointerListProperties: function() {
      return this.properties.pointers.list;
    }
  };

  console.log("Schema Factory: returning a reference to the constructor of Schema objects");

  return Schema;
})
