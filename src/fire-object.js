angular.module('objective-fire')

/*
 * FireObject is an object that contains all the things needed to describe an object in the firebase
 * It does not construct the instances - the constructors for the instances are provided on the prototype of FireObject
 */

// we need $firebase for the constructors
// the FactoryExtender will be used to create the angularfire factory
.factory('FireObject', function($firebase, FactoryExtender) {

  function FireObject(schema, rootRef, objFireRef) {
    // these properties are technically accessable but only the stuff in the prototype is needed
    this.schema = schema;
    this.rootRef = rootRef;
    this.objFireRef = objFireRef; // here we obtain the object fire - we need this is order to reference other classes of objects later
    // create the angularfire factory
    this.factory = FactoryExtender.createFactory(this.schema, this.rootRef, this.objFireRef); // this process is handed off to a separate module
  }

  FireObject.prototype.getSchema = function() {
    return this.schema;
  }

  FireObject.prototype.getRootRef = function() {
    return this.rootRef;
  }

  FireObject.prototype.getObjectFireReference = function() {
    return this.objFireRef;
  }

  FireObject.prototype.getFactory = function() {
    return this.factory;
  }

  // edit the prototype
  FireObject.prototype.new = function() {
    // obtain the angularfire object
    var ref = this.rootRef.child(this.schema.getFBLoc()).push(); // create a new location for the object we are making
    var sync = $firebase(ref, { objectFactory: this.factory });
    var obj = sync.$asObject();

    // do constructor stuff
    obj._doLoad = {}; // this is private property that determines if a specific pointer should be loaded
    obj.pointers = {};
    if (this.schema.getConstructor() != null) {
      // call the constructor for new objects
      this.schema.getConstructor().apply(obj, arguments);
    }
    obj.$save(); // save the new constructed object

    //return the constructed object
    return obj;
  };
  FireObject.prototype.instance = function(id) {
    // obtain the angularfire object
    var ref = this.rootRef.child(this.schema.getFBLoc()).child(id); // rootRef here refers to the rootRef of the FireObject
    var sync = $firebase(ref, { objectFactory: this.factory });
    var obj = sync.$asObject();

    // do constructor stuff
    obj._doLoad = {}; // this is private property that determines if a specific pointer should be loaded
    obj.pointers = {}; // set its pointers to an empty object

    // return the constructed object
    return obj;
  };

  // return the constructor
  return FireObject;
})
