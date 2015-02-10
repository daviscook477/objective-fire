angular.module('objective-fire')

/*
 * FireObject is an object that contains all the things needed to describe an object in the firebase
 * It does not construct the instances - the constructors for the instances are provided on the prototype of FireObject
 */

// we need $firebase for the constructors
// the FactoryExtender will be used to create the angularfire factory
.factory('FireObject', function($firebase, FactoryExtender) {

  function FireObject(schema, rootRef, ObjectFire) {
    // these properties are technically accessable but only the stuff in the prototype is needed
    this.schema = schema;
    this.rootRef = rootRef;
    this.objFireRef = ObjectFire; // here we obtain the object fire - we need this is order to reference other classes of objects later

    // create the angularfire factory
    this.factory = FactoryExtender.createFactory(this.schema, this.rootRef, this.objFireRef); // this process is handed off to a separate module

    var self = this; // preserve this for some things

    // set the constructor that creates an already existing object of this class in the firebase
    this.existConstructor = function(id) {
      // obtain the angularfire object
      var ref = self.rootRef.child(schema.loc).child(id); // rootRef here refers to the rootRef of the FireObject
      var sync = $firebase(ref, { objectFactory: self.factory });
      var obj = sync.$asObject();

      // do constructor stuff
      obj._doLoad = {}; // this is private property that determines if a specific pointer should be loaded
      obj.pointers = {}; // set its pointers to an empty object

      // return the constructed object
      return obj;
    };

    // set the constructor that creates a new object of this class in the firebase
    this.newConstructor = function() {
      // obtain the angularfire object
      var ref = self.rootRef.child(schema.loc).push(); // create a new location for the object we are making
      var sync = $firebase(ref, { objectFactory: self.factory });
      var obj = sync.$asObject();

      // do constructor stuff
      obj._doLoad = {}; // this is private property that determines if a specific pointer should be loaded
      obj.pointers = {};
      if (self.schema.objectConstructor != null) {
        // call the constructor for new objects
        self.schema.objectConstructor.apply(obj, arguments);
      }
      obj.$save(); // save the new constructed object

      //return the constructed object
      return obj;
    };

  }

  // edit the prototype
  FireObject.prototype = {
    // gets the constructor for an existing object in the firebase
    getExistConstructor: function() {
      return this.existConstructor;
    },
    // gets the constructor for a new object
    getNewConstructor: function() {
      return this.newConstructor;
    }
  };

  // return the constructor
  return FireObject;
})
