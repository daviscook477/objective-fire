module("List Pointer Tests");

var injector = angular.injector(['ng', 'objective-fire']);
var s = injector.get('Schema');
var ObjectFire = injector.get('ObjectFire');
asyncTest("list pointer evaluates correctly", function(assert) {
  //assert.expect(0);
  var ref = new Firebase("https://objective-fire.firebaseio.com");
  var groupSchema = new s('group', 'groups');
  groupSchema.addPointerListProperty("participants", 'user');
  var objFire = new ObjectFire(ref);
  objFire.registerObjectClass(groupSchema);
  var userSchema = new s('user', 'users');
  userSchema.addDataProperty('first', 'string').addDataProperty('last', 'string');
  objFire.registerObjectClass(userSchema);
  var group = objFire.getObjectClass('group');
  var myGroup = group.instance('group:1');
  var numDone = 0;
  var maybeStart = function() {
    if (numDone == 2) {
      start();
    }
  };
  myGroup.load('participants');
  myGroup.$loaded().then(function(self) {
    self.participants.$loaded(function(self2) {
      console.log("HELLO WORDL!");
      self2[0].$loaded().then(function(s1) {
        console.log(s1.first + " " + s1.last);
        assert.ok(s1.first=="John"&&s1.last=="Test", "first array element recieved");
        numDone++;
        maybeStart();
      });
      self2[1].$loaded().then(function(s1) {
        console.log(s1.first + " " + s1.last);
        assert.ok(s1.first=="Bob"&&s1.last=="Test", "second array element recieved");
        numDone++;
        maybeStart();
      });
    });
  });
});
