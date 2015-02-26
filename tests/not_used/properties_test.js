module("Property Tests");

// obtain angular stuff for testing
var injector = angular.injector(['ng', 'objective-fire']);
var Properties = injector.get('Properties');
var PointerObjectProperty = injector.get('PointerObjectProperty');
var PointerDataProperty = injector.get('PointerDataProperty');
var NormalProperty = injector.get('NormalProperty');

// util method for making sure that arrays have the same elements

var arrayElementsSame = function(arr1, arr2) {
  var same = true;
  if (arr1.length != arr2.length) {
    same = false;
  }
  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      same = false;
    }
  }
  return same;
}

QUnit.test("properties conforms to api", function(assert) {
  var myProperty = new Properties();
  var testObject = new NormalProperty("test", "test");
  var testPointerObject = new PointerObjectProperty("object", "obj", "obj", null);
  var testPointerArray = new PointerObjectProperty("array", "arr", "arr", null);
  var fbLoc = new Firebase("https://objective-fire.firebaseio.com/data");
  var testPointerData = new PointerDataProperty("data", "data", fbLoc);
  assert.ok(myProperty.addProperty(testObject), "added normal property");
  assert.ok(myProperty.addProperty(testPointerObject), "added pointer object property");
  assert.ok(myProperty.addProperty(testPointerArray), "added pointer array property");
  assert.ok(myProperty.addProperty(testPointerData), "added pointer data property");
  assert.ok(!myProperty.addProperty(null), "adding a null property fails");
  assert.ok(arrayElementsSame(myProperty.getNormalProperties(), [testObject]), "property stores normal properties");
  assert.ok(arrayElementsSame(myProperty.getPointerObjectProperties(), [testPointerObject]), "property stores pointer objects properties");
  assert.ok(arrayElementsSame(myProperty.getPointerArrayProperties(), [testPointerArray]), "property stores pointer arrays properties");
  assert.ok(arrayElementsSame(myProperty.getPointerDataProperties(), [testPointerData]), "property stores pointer datas properties");
});
