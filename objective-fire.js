angular.module('objective-fire', ['firebase'])

.factory('ObjectFire', function($q, $injector, $FirebaseObject, $firebase) {
  function ObjectFire(rootRef) {
    this.rootRef = rootRef;
    this.objectConstructors = {};
    this.objectConstructorsNew = {};
  }

  ObjectFire.prototype = {
    constructorOf: function(name) {
      console.log("obtaining the constructor for " + name);
      return this.objectConstructors[name];
    },
    constructorOfNew: function(name) {
      console.log("obtaining the constructor for a new " + name);
      return this.objectConstructorsNew[name];
    },
    registerObjectType: function(schema) {
      var properties = schema.getProperties();
      var pointersData = schema.getPointersData();
      var pointersList = schema.getPointersList();
      console.log("generating angularfire factory for the object to be registered");
      var factory = $FirebaseObject.$extendFactory({
        load: function(name) {
          var deffered = $q.defer();
          if (name in pointersData) {
            this.$loaded().then(function(self) {
              self[name] = constructorOf(pointersData[name].object)(this._pointers[name]);
              deffered.resolve(self.userD);
            });
          } else if (name in pointerList) {

          } else {
            deffered.resolve(null);
          }
          return deffered.promise;
        },
        $$updated: function(snapshot) {
          var self = snapshot.val();
          if (self == null) {
            self = {};
          }
          //TODO: recreate pointerss
          for (param in self) {
            this[param] = self[param];
          }
          return true;
        }
      });
      var rootRef = this.rootRef;
      console.log("registering constructor of " + schema.name);
      this.objectConstructors[schema.name] = function(id) {
        var ref = rootRef.child(schema.loc).child(id);
        var sync = $firebase(ref, { objectFactory: factory });
        return sync.$asObject();
      };
      console.log("registering constructor for new " + schema.name);
      this.objectConstructorsNew[schema.name] = function() {
        var ref = rootRef.child(schema.loc).push(); // create a new location for the object we are making
        var sync = $firebase(ref, { objectFactory: factory });
        var obj = sync.$asObject();
        if (schema.objectConstructor != null) {
          schema.objectConstructor.apply(obj, arguments); // call the "mock" constructor
        }
        obj.$save(); // save the new constructed object
        return sync.$asObject();
      }
    }
  };

  return ObjectFire;

})

.factory('Schema', function() {

  console.log("schema factory being created");

  function Schema(name, loc) {
    this.name = name;
    this.loc = loc;
    this.objectConstructor = null;
    this._properties = {};
    console.log("creating schema for '" + name + "' with location in firebase of " + loc);
  }

  Schema.prototype = {
    setConstructor: function(objectConstructor) {
      this.objectConstructor = objectConstructor;
    },
    addProperty: function(name, data) {
      console.log("creating property '" + name + "' with data of '" + JSON.stringify(data));
      this._properties[name] = data;
    },
    removeProperty: function(name) {
      this._properties[name] = null;
    },
    getProperties: function() {
      var properties = {};
      for (name in this._properties) {
        var isNormalProperty = true;
        if (this._properties[name].type === "pointerData") {
          isNormalProperty = false;
        } else if (this._properties[name].type === "pointerList") {
          isNormalProperty = false;
        }
        if (isNormalProperty) {
          properties[name] = this._properties[name];
        }
      }
      return properties;
    },
    getPointersData: function() {
      var properties = {};
      for (name in this._properties) {
        if (this._properties[name].type === "pointerData") {
          properties[name] = this._properties[name];
        }
      }
      return properties;
    },
    getPointersList: function() {
      var properties = {};
      for (name in this._properties) {
        if (this._properties[name].type === "pointerList") {
          properties[name] = this._properties[name];
        }
      }
      return properties;
    }
  };

  return Schema;
})

.factory('SchemaUtil', function() {
  return {
    createData: function(type) {
      var data = {};
      data.type = type;
      console.log("creating data with type '" + type + "'");
      return data;
    },
    createDataPointer: function(objectType, isList) {
      var data = {};
      data.object = objectType;
      if (isList) {
        console.log("creating data pointer that points to a list of objects of type '" + data.object + "'");
        data.type = "pointerList";
      } else {
        data.type = "pointerData";
        console.log("creating data pointer that points to an object of type '" + data.object + "'");
      }
      return data;
    }
  };
});
