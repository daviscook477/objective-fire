angular.module('objective-fire')

.factory('PointerArray', function($FirebaseArray, $firebase) {

  var getFactory = function(fireObject) {
    return $FirebaseArray.$extendFactory({
      $$added: function(snapshot) {
        return fireObject.instance(snapshot.key());
      },
      $$updated: function(snapshot) {
        this.$getRecord(snapshot.key()) = fireObject.instance(snapshot.key());
        return true;
      }
    });
  };

  return function(pointerRef, fireObject) {
    var sync = $firebase(pointerRef, { arrayFactory: getFactory(fireObject) });
    var obj = sync.$asArray();

    return obj;
  }

});
