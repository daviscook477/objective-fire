module("Array Tests");

var injector = angular.injector(['ng', 'objective-fire']);
var pa = injector.get('PointerArray');
var s = injector.get('Schema');
var ObjectFire = injector.get('ObjectFire');
asyncTest("pointer array works", function(assert) {
  //assert.expect(0);
  var ref = new Firebase("https://idea0.firebaseio.com");
  var ideaSchema = new s('idea', 'ideas');
  ideaSchema.addPointerDataProperty("owner", "user");
  var objFire = new ObjectFire(ref);
  objFire.registerObjectClass(ideaSchema);
  var userSchema = new s('user', 'users');
  userSchema.addDataProperty('screenName', 'string');
  objFire.registerObjectClass(userSchema);

  var idea = objFire.getObjectClass('idea');
  var myIdea = idea.instance('-JhfuxKt7IYKzKN3rHRQ');
  myIdea.load('owner').then(function(self) {
    self.$loaded().then(function(self2) {
      console.log(myIdea.owner.screenName);
      assert.ok(true);
      start();
    });
  });


});
