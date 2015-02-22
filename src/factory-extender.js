angular.module('objective-fire')

.factory('FactoryExtender', function($FirebaseObject, $firebase, $q, PointerArray) {

  /*
   * The code in this class is what manipulates the angularfire objects to recognize pointers
   * Reserved properties of objects is just "pointers"
   *   At "pointers" the id's of all the pointers are stored
   *   Then at the specified location of on the object in the schema, the pointer is injected
   */

  // return an object with this one method that creates an extended factory
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
