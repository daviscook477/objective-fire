angular.module('objective-fire')
.factory('FireObject', function($firebase, FactoryExtender) {
  /**
  Object created from class that has methods for creating instances of that class
  @class FireObject
  @constructor
  @param objectClass {ObjectClass} The class that this FireObject makes
  @param rootRef {Firebase} Firebase object that is the root of the Firebase
  @param objFire {ObjectiveFire} References to the ObjectiveFire that made this FireObject
  */
  function FireObject(objectClass, rootRef, objFire) {
    /**
    The class that this FireObject makes
    @property objectClass
    @type ObjectClass
    */
    this.objectClass = objectClass;
    /**
    Firebase object that is the root of the Firebase
    @property rootRef
    @type Firebase
    */
    this.rootRef = rootRef;
    /**
    Firebase object that is the root of the Firebase
    @property objFire
    @type ObjectiveFire
    */
    this.objFire = objFire;
    // create the angularfire factory
    /**
    AngularFire object factory used to create instances of this class
    @property factory
    @type AngularFire ObjectFactory
    */
    this.factory = FactoryExtender.createFactory(this.objectClass, this.rootRef, this.objFire);
  }
  /**
  Creates a new instance of the class.
  Important: The parameters passed to this method should be those for the class's constructor
  @method new
  @return New instance of the class
  */
  FireObject.prototype.new = function() { // TODO: when creating new objects they should automatically have their flags set to loaded
    // obtain the angularfire object
    var ref = this.rootRef.child(this.objectClass.name).push(); // create a new location for the object we are making
    var sync = $firebase(ref, { objectFactory: this.factory }); // create the angularfire object using the factory based off this class
    var obj = sync.$asObject();
    // construct the new instance
    obj._loaded = false; // private property that states if the object has been loaded
    obj.$loaded().then(function() { // make the _loaded property change to true when the object loads
      obj._loaded = true;
    });
    obj._isLoaded = {};
    obj._doLoad = {}; // this is private property that determines if an object property should be loaded
    obj.pointers = {}; // this property does something ... not sure what
    if (this.objectClass.objectConstructor !== null && typeof this.objectClass.objectConstructor === "function") {
      this.objectClass.objectConstructor.apply(obj, arguments); // call the constructor for new objects
    } else {
      throw "new may only be called for classes that have constructors";
    }
    var properties = this.objectClass.properties;
    var ops = properties.objectP;
    var oaps = properties.arrayP;
    for (var i = 0; i < ops.length; i++) {
      var name = ops[i].name;
      if (name in obj) {
        obj._isLoaded[name] = true;
        obj._doLoad[name] = true;
      }
    }
    for (var i = 0; i < oaps.length; i++) {
      var name = oaps[i].name;
      if (name in obj) {
        obj._isLoaded[name] = true;
        obj._doLoad[name] = true;
      }
    }
    obj.$save(); // save the new constructed object
    return obj;
  };
  /**
  Creates an instance of the class from data existing in the Firebase
  @method instance
  @param id {String} The id of this object in the Firebase (it's key)
  @return Existing instance of the class
  */
  FireObject.prototype.instance = function(id) {
    // obtain the angularfire object
    var ref = this.rootRef.child(this.objectClass.name).child(id);
    var sync = $firebase(ref, { objectFactory: this.factory });
    var obj = sync.$asObject();
    // construct the existing instance
    obj._loaded = false; // private property that states if the object has been loaded
    obj.$loaded().then(function() { // make the _loaded property change to true when the object loads
      obj._loaded = true;
    });
    obj._isLoaded = {};
    obj._doLoad = {}; // this is private property that determines if an object property should be loaded
    obj.pointers = {};
    return obj;
  };
  return FireObject;
})
;
