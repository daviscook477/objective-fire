module("Property Tests");

// obtain angular stuff for testing
var injector = angular.injector(['ng', 'objective-fire']);
var Properties = injector.get('Properties');
var PointerProperty = injector.get('PointerProperty');
var NormalProperty = injector.get('NormalProperty');

QUnit.test("properties conforms to api", function(assert) {
  var myProperty = new Properties();
  var testObject = new NormalProperty("test", "test");
  var testPointerObject = new PointerProperty("object", "obj", "obj");
})
