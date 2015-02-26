module("Objective Fire Tests");

// obtain angular stuff for testing
var injector = angular.injector(['ng', 'objective-fire']);
var ObjectFire = injector.get('ObjectFire');

QUnit.test("objective fire conforms to api", function(assert) {
  var name = "test";
  var fbLoc = new Firebase("https://objective-fire.firebaseio.com");
  var fbLocSchemaTest = fbLoc.child("test");
  var testConstructor = function(myWord) {
    this.myWord = myWord;
  };
  var testMethod = function() {
    return myWord;
  };
  var methods = [testMethod];
  var testSchema = new Schema(name, fbLocSchemaTest, testConstructor, methods, null);
  var myObjFire = new ObjectFire(fbLoc);
  assert.ok(myObjFire.getFBRef() == fbLoc, "stored firebase reference");
  myObjFire.registerObjectClass(testSchema);
  assert.ok(myObjFire.getObjectClass("test") instanceof Object, "registered and could obtain an object from a schema");
});
