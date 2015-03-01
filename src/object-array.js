angular.module('objective-fire')
.factory('ObjectArray', function($FirebaseArray, $firebase) {
  var getFactory = function(fireObject) {
    return $FirebaseArray.$extendFactory({
      $$added: function(snapshot) {
        return fireObject.instance(snapshot.val());
      },
      $$updated: function(snapshot) {
        var changed = false;
        var curO = this.$getRecord(snapshot.val());
        var newO = fireObject.instance(snapshot.val());
        if (!angular.equals(curO, newO)) {
          change = true;
        }
        //TODO: determine if it changes then return that instead of true
        return changed;
      }
    });
  };
  /**
  An array of objects in the Firebase. The objects are of some class.
  @class ObjectArray
  @constructor
  @param ref {Firebase} Firebase reference to the location where this ObjectArray resides
  @param fireObject {FireObject} FireObject that is the class that each element of this array will be
  */
  return function(ref, fireObject) {
    var sync = $firebase(ref, { arrayFactory: getFactory(fireObject) });
    var obj = sync.$asArray();
    return obj;
  };
});
