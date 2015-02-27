module("ObjectClass Test");

var injector = angular.injector(['ng', 'objective-fire']);
var ObjectClass = injector.get('ObjectClass');

QUnit.test("ObjectClass conforms to expected api", function(assert) {
  var myConstructor = function() {};
  var myMethods = {
    method: function() {}
  };
  var myProperties = {};
  var myClass = new ObjectClass("test", myConstructor, myMethods, myProperties);
  assert.ok(myClass.name==="test", "stores name");
  assert.ok(myClass.objectConstructor===myConstructor, "stores constructor");
  assert.ok(myClass.objectMethods===myMethods, "stores methods");
  assert.ok(myClass.properties===myProperties, "stores properties");
});
