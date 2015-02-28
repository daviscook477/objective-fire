angular.module('objective-fire')
.factory('FactoryExtender', ["$FirebaseObject", "$firebase", "$q", "ObjectArray", function($FirebaseObject, $firebase, $q, ObjectArray) {
  /**
  Helper class that creates extended AngularFire factories
  @class FactoryExtender
  @static
  */
  return {
    /**
    Creates an AngularFire factory that makes of objects of a specific class from a specific Firebase
    @method createFactory
    @param objectClass {ObjectClass} The class of object the factory will produce
    @param rootRef Firebase object that is the root of the Firebase
    @param objFire {ObjectiveFire} References to the ObjectiveFire that made this FireObject
    @return AngularFire factory that produces objects of the class objectClass
    */
    createFactory: function(objectClass, rootRef, objFire) {
      var template = {};
      var properties = objectClass.properties;
      var pps = properties.primitive;
      var ops = properties.objectP;
      var oaps = properties.arrayP;
      var methods = objectClass.objectMethods;
      for (param in methods) { // add the methods to the template for the AngularFire factory
        template[param] = methods[param];
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
        if (!this._doLoad[name]) { // if property is already loaded don't do anything
          // find the actual property definition
          var property = undefined;
          for (var i = 0; i < ops.length; i++) {
            if (ops[i].name === name) {
              property = ops[i];
              break;
            }
          }
          for (var i = 0; i < oaps.length; i++) {
            if (oaps[i].name === name) {
              property = oaps[i];
              break;
            }
          }
          this._doLoad[name] = true; // require that the property is loaded
          if (this._loaded) { // if already loaded then manually load the property
            var objectClassName = property.objectClassName;
            var objectClass = objFire.getObjectClass(objectClassName);
            var obj = objectClass.instance(this[name]); // create the object
            this[name] = obj;
            this._isLoaded[name] = true;
            deffered.resolve(obj);
          } else { // if we haven't loaded, it will be loaded when the object is loaded
            // this means that simply changing this._doLoad[name] will load it

            // make sure it is actually loaded in the object loading (could not due to synchronization issues (I think))
            this.$loaded().then(function(self) {
              if (!self._isLoaded[name]) { // if for some reason not loaded manually load the property
                var objectClassName = property.objectClassName;
                var objectClass = objFire.getObjectClass(objectClassName);
                var obj = objectClass.instance(self[name]); // create the object
                self[name] = obj;
              }
              self._isLoaded[name] = true;
              deffered.resolve(self[name]);
            });
          }
        } else {
          deffered.resolve(this[name]);
        }
        return deffered.promise;
      }
      // overrides the function in angularfire TODO: use yuidoc to state that
      template.$$updated = function(snapshot) {
        var changed = false;
        var data = snapshot.val();
        for (var i = 0; i < pps.length; i++) { // replace all primitive properties
          var name = pps[i].name;
          // primitives can be compared with ==
          if (data[name] == this[name]) {
            changed = true;
          }
          this[name] = data[name]; // replace the property
        }
        for (var i = 0; i < ops.length; i++) { // replace all object properties
          var name = ops[i].name;
          if (this._doLoad[name]) { // only load property if it should be
            var objectClassName = ops[i].objectClassName;
            var objectClass = objFire.getObjectClass(objectClassName);
            var obj = objectClass.instance(data[name]); // create the object
            if (!angular.equals(obj, this[name])) {
              changed = true;
            }
            this._isLoaded[name] = true;
            this[name] = obj;
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
        for (param in data) { // sanatize firebase input
          if (data[param] === undefined) {
            data[param] = null;
          }
        }
        rootRef.child(objectClass.name).child(this.$id).set(data); // set the data at here in the firebase
      };
      return $FirebaseObject.$extendFactory(template);
    }
  }
}])
;
