angular.module('objective-fire', ['firebase'])

.factory('ObjectFire', ['$q', '$injector', '$FirebaseObject', '$firebase', function($q, $injector, $FirebaseObject, $firebase) {}
  function ObjectFire(rootRef) {
    this.rootRef = rootRef;
    this.objectConstructors = {};
  }

  ObjectFire.prototype = {
    constructorOf: function(name) {
      return objectConstructors[name];
    }
    registerObjectType: function(schema) {
      var properties = schema.getProperties();
      var pointersData = schema.getPointersData();
      var pointersList = schema.getPointersList();
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
      this.objectConstructors[schema.name] = function(id) {
        var ref = this.rootRef.child(schema.loc).child(id);
        var sync = $firebase(ref, { objectFactory: factory });
        return sync.$asObject();
      };
    }
  };

  return new ObjectFire();

})

.factory('Schema', [function() {

  function Schema(name, loc) {
    this.name = name;
    this.loc = loc;
    this._properties = {};
  }

  Schema.prototype = {
    createData: function(type) {
      var data = {};
      data.type = type;
      return data;
    },
    createDataPointer: function(objectType, isList) {
      var data = {};
      data.object = type;
      if (isList) {
        data.type = "pointerList";
      } else {
        data.type = "pointerData";
      }
      return data;
    },
    addProperty: function(name, data) {
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
      return propeties;
    },
    getPointersData: function() {
      var properties = {};
      for (name in this._properties) {
        if (this._properties[name].type === "pointerData") {
          properties[name] = this._properties[name];
        }
      }
      return propeties;
    },
    getPointersList: function() {
      var properties = {};
      for (name in this._properties) {
        if (this._properties[name].type === "pointerList") {
          properties[name] = this._properties[name];
        }
      }
      return propeties;
    }
  };

  return Schema;

}]);
