angular.module('objective-fire')
.factory('ObjectArray', function($FirebaseArray, $firebase) {
  var getFactory = function(fireObject) {
    return $FirebaseArray.$extendFactory({
      $$added: function(snapshot) {
        return fireObject.instance(snapshot.key());
      },
      $$updated: function(snapshot) {
        this.$getRecord(snapshot.key()) = fireObject.instance(snapshot.key());
        //TODO: determine if it changes then return that instead of true
        return true;
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
  }
});
