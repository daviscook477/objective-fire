angular.module('objective-fire')

.factory('FactoryExtender', function($FirebaseObject, $firebase, $q) {

  /*
   * The code in this class is what manipulates the angularfire objects to recognize pointers
   * Reserved properties of objects is just "pointers"
   *   At "pointers" the id's of all the pointers are stored
   *   Then at the specified location of on the object in the schema, the pointer is injected
   */

  // return an object with this one method that creates an extended factory
  return {
    // creates an extended angularjs factory
    createFactory: function(schema, rootRef, ObjectFire) { // I'm starting to think that we don't need rootRef
      // get the lists of the three types of properties from the schema
      var properties = schema.getDataProperties();
      var pointersData = schema.getPointerDataProperties();
      var pointersList = schema.getPointerListProperties();

      // extend the factory and return the factory
      return $FirebaseObject.$extendFactory({
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
              var constructorWeNeed = ObjectFire.getObjectClass(classOfObj).getExistConstructor(); // get the constructor
              self[name] = new constructorWeNeed(this.pointers[name]);
              deffered.resolve(self[name]);
            });
          } else if (name in pointerList) {

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

          // check for changes in the pointers and update the pointers and respective objects on this
          // set 'chhanged' to true if something changes


          // check for changes in normal data in the snapshot and update that here
          // change the 'changed' variable to true if anything changed

          //TEMP:
          changed = true;
          for (param in newData) {
            this[param] = newData[param];
          }

          // return if the data was changed
          return changed;
        }
      });
    }
  }

});
