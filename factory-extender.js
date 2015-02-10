angular.module('objective-fire')

.factory('FactoryExtender', function($FirebaseObject, $firebase, $q) {

  // return an object with this one method that creates an extended factory
  return {
    // creates an extended angularjs factory
    createFactory: function(schema, rootRef, ObjectFire) {
      // get the lists of the three types of properties from the schema
      var properties = schema.getDataProperties();
      var pointersData = schema.getPointerDataProperties();
      var pointersList = schema.getPointerListProperties();

      // extend the factory and return the factory
      return $FirebaseObject.$extendFactory({
        // this method instructs the object to load its pointer at name (there is no reason to use this with a normal property)
        load: function(name) {
          this._doLoad[name] = true; // we should load this
          // actually force it to load and return the loaded thing is a promise
          var deffered = $q.defer();
          if (name in pointersData) { // if this is a pointerData
            this.$loaded().then(function(self) {
              var classOfObj = pointersData[name].object; // figure out which class of object we need to create
              var constructorWeNeed = ObjectFire.getObjectClass(classOfObj).getExistConstructor(); // get the constructor
              self[name] = new constructorWeNeed(this.pointers[name]);
              deffered.resolve(self[name]);
            });
          } else if (name in pointerList) {
            //TODO: implement loading and checking lists
          } else { // not a pointer
            this.$loaded().then(function(self) {
              deffered.resolve(self[name]); // it wasn't a pointer so just resole it with whatever the hell is here
            })
          }
          return deffered.promise; // return the promise
        },
        $$updated: function(snapshot) {
          var newData = snapshot.val();
          var changed = false;

          // check for changes in the pointers and update the pointers and respective objects on this
          // set 'chhanged' to true if something changes
          

          // check for changes in normal data in the snapshot and update that here
          // change the 'changed' variable to true if anything changed

          // return if the data was changed
          return changed;
        }
      });
    }
  }

});
