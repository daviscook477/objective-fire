module("Array Tests");

var injector = angular.injector(['ng', 'objective-fire']);
var pa = injector.get('PointerArray');
var s = injector.get('Schema');
var ObjectFire = injector.get('ObjectFire');
asyncTest("pointer array works", function(assert) {
  var ref = new Firebase("https://objective-fire.firebaseio.com");
  var pointerArrayRef = ref.child('groups').child('group:1').child('pointers').child('participants');
  var userSchema = new s('user', 'users');
  userSchema.addDataProperty('first', 'string').addDataProperty('last', 'string');
  var objFire = new ObjectFire(ref);
  objFire.registerObjectClass(userSchema);
  var mypa = new pa(pointerArrayRef, objFire.getObjectClass('user'));
  var numDone = 0;
  var maybeStart = function() {
    if (numDone == 2) {
      start();
    }
  };
  mypa.$loaded().then(function(self) {
    mypa[0].$loaded().then(function(self2) {
      assert.ok(self2.first=="John"&&self2.last=="Test", "first object of array loaded correctly");
      numDone++;
      maybeStart();
    });
    mypa[1].$loaded().then(function(self2) {
      assert.ok(self2.first=="Bob"&&self2.last=="Test", "second object of array loaded correctly");
      numDone++;
      maybeStart();
    });
  });
});
