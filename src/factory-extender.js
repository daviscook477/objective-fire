angular.module('objective-fire')
.factory('FactoryExtender', function($firebaseObject, $q, ObjectArray) {
  /**
  Helper class that creates extended AngularFire factories
  @class FactoryExtender
  @static
  */
  return {
    /**
    Creates an AngularFire factory that makes of objects of a specific class from a specific Firebase
    @method createObjectFactory
    @param objectClass {ObjectClass} The class of object the factory will produce
    @param rootRef Firebase object that is the root of the Firebase
    @param objFire {ObjectiveFire} References to the ObjectiveFire that made this FireObject
    @return AngularFire factory that produces objects of the class objectClass
    */
    createObjectFactory: function(objectClass, rootRef, objFire) {
      var template = {};
      var properties = objectClass.properties;
      var pps, ops, oaps;
      if (properties === null) {
        pps = []; ops = []; oaps = [];
      } else {
        pps = properties.primitive;
        ops = properties.objectP;
        oaps = properties.arrayP;
      }
      var methods = objectClass.objectMethods;
      if (typeof methods === "object") {
        for (var param in methods) { // add the methods to the template for the AngularFire factory
          template[param] = methods[param];
        }
      }
      // not sure how to document this with yuidoc - just use single *
      /*
      Method used to load ObjectProperty and ObjectArrayProperty
      @method $load
      @param name {String} The name of the property to load
      @return promise that resolves to the object
      */
      template.$load = function(name) { // TODO: does this trigger angularjs $scope updates - probably not!
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
      };
      // overrides the function in angularfire TODO: use yuidoc to state that
      template.$$updated = function(snapshot) {
        var changed = false;
        var data = snapshot.val();
        if (data === null) {
          data = {};
        }
        for (var i = 0; i < pps.length; i++) { // replace all primitive properties
          var name = pps[i].name;
          // primitives can be compared with ==
          if (data[name] !== this[name]) {
            changed = true;
          }
          this[name] = data[name]; // replace the property
        }
        for (var i = 0; i < ops.length; i++) { // replace all object properties
          var name = ops[i].name;
          if (this._doLoad[name]) { // only load property if it should be
            var objectClassName = ops[i].objectClassName;
            var objectClass2 = objFire.getObjectClass(objectClassName);
            var obj = objectClass2.instance(data[name]); // create the object
            if (!angular.equals(obj, this[name])) {
              changed = true;
            }
            this._isLoaded[name] = true;
            this[name] = obj;
          } else {
            this[name] = data[name];
          }
        }
        for (var i = 0; i < oaps.length; i++) { // replace all object array properties
          var name = oaps[i].name;
          if (this._doLoad[name]) {
            var objectClassName = oaps[i].objectClassName;
            var objectClass2 = objFire.getObjectClass(objectClassName);
            var arr = new ObjectArray(rootRef.child(objectClass.name).child(this.$id).child(name), objectClass2);
            if (!angular.equals(arr, this[name])) {
              changed = true;
            }
            this._isLoaded[name] = true;
            this[name] = arr;
          } else {
            this[name] = data[name];
          }
        }
        return changed;
      };
      template.$save = function() {
        var data = {};
        for (var i = 0; i < pps.length; i++) { // save primitives
          var name = pps[i].name;
          data[name] = this[name];
        }
        for (var i = 0; i < ops.length; i++) { // save object references
          var name = ops[i].name;
          if (typeof this[name] === "object") {
            data[name] = this[name].$id;
          } else {
            data[name] = this[name];
          }
        }
        for (var i = 0; i < oaps.length; i++) { // save object array references
          var name = oaps[i].name;
          if (typeof this[name] === "object") {
            data[name] = [];
            for (var j = 0; j < this[name].length; j++) {
              data[name][j] = this[name][j];
            }
          } else {
            data[name]= this[name];
          }
        }
        for (var param in data) { // sanatize firebase input
          if (data[param] === undefined) {
            data[param] = null;
          }
        }
        rootRef.child(objectClass.name).child(this.$id).set(data); // set the data at here in the firebase
      };
      return $firebaseObject.$extend(template);
    }
  };
})
;
