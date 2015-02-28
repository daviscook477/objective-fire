//TODO: make this work, currently it's totally broken
angular.module('objective-fire')
.factory('FactoryExtender', function($FirebaseObject, $firebase, $q, ObjectArray) {
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
      template.$load = function(name) {
        var deffered = $q.defer();
        if (!this._doLoad[name]) { // if property is already loaded don't do anything
          this._doLoad[name] = true; // require that the property is loaded
          if (this._loaded) { // if already loaded then manually load the property

          } else { // if we haven't loaded, it will be loaded when the object is loaded
            // this means that simply changing this._doLoad[name] will load it

            // make sure it is actually loaded in the object loading (could not due to synchronization issues (I think))
            this.$loaded().then(function(self) {
              if (!self[name]) { // if for some reason not loaded manually load the property

              }
            })
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
        for (var i = 0; i < ops.length; i++) {
          var name = ops[i].name;
          if (this._doLoad[name]) { // only load property if it should be
            var objectClassName = ops[i].objectClassName;
            var objectClass = objFire.getObjectClass(objectClassName);
            
          }
        }
        return changed;
      }

      return $FirebaseObject.$extendFactory(template);
    }
  }
})
;

/*
angular.module('objective-fire')
.factory('FactoryExtender', function($FirebaseObject, $firebase, $q, PointerArray) {
  return {
    // creates an extended angularjs factory
    createFactory: function(schema, rootRef, ObjectFire) {

      // get the properties from the schema
      var properties = schema.getProperties();
      var normalP = properties.getNormalProperties();
      var objectP = properties.getPointerObjectProperties();
      var arrayP = properties.getPointerArrayProperties();
      var dataP = properties.getPointerDataProperties();

      // get the lists of the three types of properties from the schema
      var properties = schema.getDataProperties();
      var pointersData = schema.getPointerDataProperties();
      var pointersList = schema.getPointerListProperties();

      // extend the factory and return the factory
      return $FirebaseObject.$extendFactory({

        //TODO: load should do something such that it doesn't load the object and then $$update loads the object


        // this method instructs the object to load its pointer at name (there is no reason to use this with a normal property)
        load: function(name) {
          this._doLoad[name] = true; // we should load this (this property is checked in $$updated)

          // if we didn't manually load the property now, we'd have to wait for a change in the data on firebase for it to load- that is not the intended behaviour

          // force it to load - return what was loaded in a promise
          var deffered = $q.defer();
          if (name in pointersData) { // if this is a pointerData

            // this section of code loads the object if it is a pointer to data
            this.$loaded().then(function(self) {
              var classOfObj = pointersData[name].object; // figure out which class of object we need to create
              self[name] = ObjectFire.getObjectClass(classOfObj).instance(self.pointers[name]);
              deffered.resolve(self[name]);
            });
          } else if (name in pointersList) {
            console.log("loading the " + name);
            this.$loaded().then(function(self) {
              var classOfList = pointersList[name].object; // figure out which class to make the array
              var theClass = ObjectFire.getObjectClass(classOfList);
              var ref = rootRef.child(schema.getLocation()).child(self.$id).child("pointers").child(name);//.child(uh to somewhere this must lead)
              self[name] = new PointerArray(ref, theClass);
              deffered.resolve(self[name]);
            });
            // this section of code loads the object if it is a pointer list
            //TODO: implement loading and checking lists
          } else { // not a pointer

            // so here - the thing was not a pointer, in this case we'll just return whatever they wanted off of this object after its $loaded
            this.$loaded().then(function(self) {
              deffered.resolve(self[name]); // it wasn't a pointer so just resole it with whatever the hell is here
            })
          }
          return deffered.promise; // return the promise
        },

        // now we override the angularfire implementatation of methods in order to make it work with pointers
        $$updated: function(snapshot) {
          var newData = snapshot.val();
          var changed = false;
          //this method is going to get complicated if I want it to work right...


          //TODO: iterate through each property in each list of properties and add the property from the data snapshot to the correct locaiton on this object

          // <========== HERE LIES OLDE CODE =======>

          // check for changes in the pointers and update the pointers and respective objects on this
          // set 'chhanged' to true if something changes
          for (param in pointersData) {
            console.log("this is a pointer: " + param);
            if (this._doLoad[param]) { // if we should load this property
              console.log("we are going to load it");
              //temp
              var classOfObj = pointersData[param].object;
              console.log("this is the class we found for it: " + JSON.stringify(classOfObj));
              newData[param] = ObjectFire.getObjectClass(classOfObj).instance(newData.pointers[param]);
            }
          }

          for (param in pointersList) {
            console.log("this is a pointer list: " + param)
            if (this._doLoad[param]) {
              console.log("we are going to load it");
              var classOfList = pointersList[param].object;
              console.log("this is the class we found for it: " + JSON.stringify(classOfList));
              var theClass = ObjectFire.getObjectClass(classOfList);
              var ref = rootRef.child(schema.getLocation()).child(this.$id).child("pointers").child(param);//.child(uh to somewhere this must lead)
              console.log("the location " + param + " is being set to a pointer array");
              newData[param] = new PointerArray(ref, theClass);
            }
          }

          // check for changes in normal data in the snapshot and update that here
          // change the 'changed' variable to true if anything changed

          //TEMP:
          changed = true;
          for (param in newData) {
            this[param] = newData[param];
          }

          // return if the data was changed
          return changed;

          // <======= HERE ENDS OLD CODE ======>
        }
      });
    }
  }

});
*/
