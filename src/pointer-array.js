angular.module('objective-fire')

.factory('PointerArray', function($FirebaseArray, $firebase) {

  var getFactory = function(fireObject) {
    return $FirebaseArray.$extendFactory({
      $$added: function(snapshot) {
        var constructor = fireObject.getExistConstructor();
        return new constructor(snapshot.key());
      },
      $$updated: function(snapshot) {
        var constructor = fireObject.getExistConstructor();
        this.$getRecord(snapshot.key()) = new constructor(snapshot.key());
      }
    });
  };

  return function(pointerRef, fireObject) {
    var sync = $firebase(pointerRef, { arrayFactory: getFactory(fireObject) });
    var obj = sync.$asArray();

    return obj;
  }

});
