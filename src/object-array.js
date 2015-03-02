angular.module('objective-fire')
.factory('ObjectArray', function($firebaseArray) {
  var getFactory = function(fireObject) {
    return $firebaseArray.$extend({
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
    var obj = new getFactory(fireObject);
    return obj;
  };
});
