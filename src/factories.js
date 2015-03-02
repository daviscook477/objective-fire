angular.module('objective-fire')
.factory('Factories', function($firebaseObject, $firebaseArray) {
  var factories = {
    objectFactory: function(objectClass, rootRef, objFire) {
      function Factory() {}
      Factory.prototype = {
        // things that must be accessible
        _objectClass: objectClass,
        _rootRef: rootRef,
        _objFire: objFire,
        // methods to override
        $load: function(name) {
          //TODO/WARNING THIS METHOD DOESN'T WORK! IT SIMPLY COPIES OLD CODE FOR REFERENCE
          var deffered = $q.defer();
          if (typeof name !== "string") {
            throw "name must be of type string";
          }
          if (!this._doLoad[name]) { // if property is already loaded don't do anything
            // find the actual property definition
            var property = undefined;
            var kind = "";
            for (var i = 0; i < ops.length; i++) {
              if (ops[i].name === name) {
                property = ops[i];
                kind = "op";
                break;
              }
            }
            for (var i = 0; i < oaps.length; i++) {
              if (oaps[i].name === name) {
                property = oaps[i];
                kind = "oap";
                break;
              }
            }
            this._doLoad[name] = true; // require that the property is loaded
            if (this._loaded) { // if already loaded then manually load the property
              if (kind === "op") {
                var objectClassName = property.objectClassName;
                var objectClass2 = objFire.getObjectClass(objectClassName);
                var obj = objectClass2.instance(this[name]); // create the object
                this[name] = obj;
                this._isLoaded[name] = true;
                deffered.resolve(this[name]);
              } else if (kind === "oap") {
                var objectClassName = property.objectClassName;
                var objectClass2 = objFire.getObjectClass(objectClassName);
                var arr = new ObjectArray(rootRef.child(objectClass.name).child(this.$id).child(name), objectClass2);
                this[name] = arr;
                this._isLoaded[name] = true;
                deffered.resolve(this[name]);
              }
            } else { // if we haven't loaded, it will be loaded when the object is loaded
              // this means that simply changing this._doLoad[name] will load it

              // make sure it is actually loaded in the object loading (could not due to synchronization issues (I think))
              this.$loaded().then(function(self) {
                if (!self._isLoaded[name]) { // if for some reason not loaded manually load the property
                  if (kind === "op") {
                    var objectClassName = property.objectClassName;
                    var objectClass2 = objFire.getObjectClass(objectClassName);
                    var obj = objectClass2.instance(self[name]); // create the object
                    self[name] = obj;
                  } else if (kind === "oap") {
                    var objectClassName = property.objectClassName;
                    var objectClass2 = objFire.getObjectClass(objectClassName);
                    var arr = new ObjectArray(rootRef.child(objectClass.name).child(self.$id).child(name), objectClass2);
                    self[name] = arr;
                  }
                }
                self._isLoaded[name] = true;
                deffered.resolve(self[name]);
              });
            }
          } else {
            deffered.resolve(this[name]);
          }
          return deffered.promise;
        },
        $toJSON: function(rec) {
          var properties = this._objectClass.properties;
          var pps = properties.primtive;
          var ops = properties.objectP;
          var oaps = properties.arrayP;
          var data = {};
          for (var i = 0; i < pps.length; i++) { // save primitives
            var name = pps[i].name;
            data[name] = rec[name];
          }
          for (var i = 0; i < ops.length; i++) { // save object references
            var name = ops[i].name;
            if (typeof rec[name] === "object") {
              data[name] = rec[name].$id; // save just the id of the object
            } else {
              data[name] = rec[name];
            }
          }
          for (var i = 0; i < oaps.length; i++) { // save object array references
            var name = oaps[i].name;
            if (typeof rec[name] === "object") {
              data[name] = [];
              for (var j = 0; j < rec[name].length; j++) {
                data[name][j] = rec[name][j].$id; // save just the id of each element in the array
              }
            } else {
              data[name]= rec[name]; // if it is not object it is just the reference so save the reference back
            }
          }
          for (var param in data) { // sanatize firebase input
            if (data[param] === undefined) {
              data[param] = null;
            }
          }
          return data; // return the data that we made
        },
        $fromJSON: function(snap) {
          var properties = this._objectClass.properties;
          var pps = properties.primtive;
          var ops = properties.objectP;
          var oaps = properties.arrayP;
          var data = snap.val();
          if (data === null) {
            data = {};
          }
          var newRec = {};
          for (var i = 0; i < pps.length; i++) { // replace all primitive properties
            var name = pps[i].name;
            newRec[name] = data[name]; // simply replace primitives
          }
          for (var i = 0; i < ops.length; i++) { // replace all object properties
            var name = ops[i].name;
            if (this._doLoad[name]) { // only load property if it should be
              // only create a new object if the object has changed
              if (this[name].$id !== data[name]) { // in the firebase only the object reference is stored so if the reference isn't the same as the id of the existing object they must be different
                var objectClassName = ops[i].objectClassName;
                var objectClass = this._objFire.getObjectClass(objectClassName);
                var obj = objectClass.instance(data[name]);
                this._isLoaded[name] = true;
                newRec[name] = obj;
              } else {
                newRec[name] = this[name];
              }
            } else {
              newRec[name] = data[name]; // just save the reference if not supposed to load it
            }
          }
          for (var i = 0; i < oaps.length; i++) { // replace all object array properties
            var name = oaps[i].name;
            if (this._doLoad[name]) {
              if (!this.isLoaded[name]) { // arrays actually must only be loaded once
                var objectClassName = oaps[i].objectClassName;
                var objectClass = this._objFire.getObjectClass(objectClassName);
                var arr = new factories.arrayFactory(objectClass, this._rootRef, this._objFire)(this._rootRef.child(this._objectClass.name).child(this.$id).child(name)); // we are obtaining a constructor by a function with parameters then calling that function
                this._isLoaded[name] = true;
                newRec[name] = arr;
              } else {
                newRec = this[name]; // pull the object of the current object if it exists
              }
            } else {
              newRec[name] = data[name]; // just save the reference if not supposed to load it
            }
          }
          return newRec;
        }
      };
      return $firebaseObject.$extend(Factory);
    },
    arrayFactory: function(fireObject, rootRef, objFire) {
      function Factory() {}
      Factory.prototype = {
        // things that must be accessible
        _fireObject: fireObject,
        _rootRef: rootRef,
        _objFire: objFire,
        // methods to override
        $toJSON: function(rec) {
          return rec.$id; // a record should be saved by its reference
        },
        $fromJSON: function(snap) {
          return this._fireObject.instance(snap.val()); // create an object from the snapshot
        }
      };
      return $firebaseArray.$extend(Factory);
    }
  };
  return factories;
});
