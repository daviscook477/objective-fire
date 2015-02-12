module("Data Pointer Tests");

var injector = angular.injector(['ng', 'objective-fire']);
var pa = injector.get('PointerArray');
var s = injector.get('Schema');
var ObjectFire = injector.get('ObjectFire');
asyncTest("single data pointer evaluates correctly", function(assert) {
  //assert.expect(0);
  var ref = new Firebase("https://objective-fire.firebaseio.com");
  var groupSchema = new s('group', 'groups');
  groupSchema.addPointerDataProperty("admin", 'user');
  var objFire = new ObjectFire(ref);
  objFire.registerObjectClass(groupSchema);
  var userSchema = new s('user', 'users');
  userSchema.addDataProperty('first', 'string').addDataProperty('last', 'string');
  objFire.registerObjectClass(userSchema);
  var group = objFire.getObjectClass('group');
  var myGroup = group.instance('group:1');
  myGroup.load('admin').then(function(self) {
    self.$loaded().then(function(self2) {
      assert.ok(self2.first == "Admin" && self2.last=="Test");
      start();
    });
  });
});
