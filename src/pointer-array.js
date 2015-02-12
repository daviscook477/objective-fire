angular.module('objective-fire')

.factory('PointerArray', function($FirebaseArray, $firebase) {

  var getFactory = function(fireObject) {
    return $FirebaseArray.$extendFactory({
      $$added: function(snapshot) {
        console.log("Data obtained for update us " + JSON.stringify(snapshot.val()));
        return fireObject.instance(snapshot.key());
      },
      $$updated: function(snapshot) {
        console.log("Data obtained for update us" + JSON.stringify(snapshot.val()));
        this.$getRecord(snapshot.key()) = fireObject.instance(snapshot.key());
        return true;
      }
    });
  };

  return function(pointerRef, fireObject) {
    console.log("creating pointer array");
    var sync = $firebase(pointerRef, { arrayFactory: getFactory(fireObject) });
    var obj = sync.$asArray();

    return obj;
  }

});
