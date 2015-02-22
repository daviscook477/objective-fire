module("Schema Tests");

// obtain angular stuff for testing
var injector = angular.injector(['ng', 'objective-fire']);
var Schema = injector.get('Schema');

QUnit.test("schema conforms to api", function(assert) {
  var name = "test";
  var fbLoc = new Firebase("https://objective-fire.firebaseio.com/test");
  var testConstructor = function(myWord) {
    this.myWord = myWord;
  };
  var testMethod = function() {
    return myWord;
  };
  var methods = [testMethod];
  var testSchema = new Schema(name, fbLoc, testConstructor, methods, null);
  assert.ok(testSchema.getName() === name, "schema stores name");
  assert.ok(testSchema.getFBLoc() === fbLoc, "schema stores location in firebase");
  assert.ok(testSchema.getConstructor() == testConstructor, "schema stores constructor");
  assert.ok(testSchema.getMethods() == methods, "schema stores list of methods");
  assert.ok(testSchema.getProperties() == null, "schema stores properties");
})
