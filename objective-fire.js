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
      var selfObjF = this;
      var properties = schema.getDataProperties();
      var pointersData = schema.getPointerDataProperties();
      var pointersList = schema.getPointerListProperties();
      console.log("generating angularfire factory for the object to be registered");
      var factory = $FirebaseObject.$extendFactory({
        load: function(name) {
          var deffered = $q.defer();
          if (name in pointersData) {
            this.$loaded().then(function(self) {
              self[name] = this.constructorOf(pointersData[name].object)(this.pointers[name]);
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
          //TODO: only do this stuff if they are supposed to be loaded
          for (param in self.pointers) { // check every pointer and update the object with the pointers
            if (typeof self.pointers[param] == "object") { // if its an object it is a list

            } else if (typeof self.pointers[param] != undefined) { // its just a single pointer
              if (this.pointers && this.pointers[param] != self.pointers[param]) { // something changed
                console.log("pointer of " + self.pointers[param]);
                console.log("object type = " + pointersData[param].object);
                self[param] = new (selfObjF.constructorOf.call(selfObjF, pointersData[param].object))(self.pointers[param]); // set the value that the pointer is bound to to an object
              } else {
                self[param] = this[param];
              }
            } else {
              // something should not happen
            }
          }
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
        var obj = sync.$asObject();
        obj.pointers = {};
        return obj;
      };
      console.log("registering constructor for new " + schema.name);
      this.objectConstructorsNew[schema.name] = function() {
        var ref = rootRef.child(schema.loc).push(); // create a new location for the object we are making
        var sync = $firebase(ref, { objectFactory: factory });
        var obj = sync.$asObject();
        obj.pointers = {};
        if (schema.objectConstructor != null) {
          schema.objectConstructor.apply(obj, arguments); // call the "mock" constructor
        }
        obj.$save(); // save the new constructed object
        return obj;
      }
    }
  };

  return ObjectFire;

});
