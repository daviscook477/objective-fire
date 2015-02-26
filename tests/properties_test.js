module("Properties Tests");

function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }
    return true;
}

var injector = angular.injector(['ng', 'objective-fire']);
var Properties = injector.get('Properties');
var ObjectProperty = injector.get('ObjectProperty');
var ObjectArrayProperty = injector.get('ObjectArrayProperty');
var PrimitiveProperty = injector.get('PrimitiveProperty');

QUnit.test("PrimitiveProperty conforms to expected api", function(assert) {
  var prop = new PrimitiveProperty("test");
  assert.ok(prop.name === "test", "stores name");
});

QUnit.test("ObjectProperty conforms to expected api", function(assert) {
  var prop = new ObjectProperty("test", "Test");
  assert.ok(prop.name === "test", "stores name");
  assert.ok(prop.objectClassName === "Test", "stores object class name");
});

QUnit.test("ObjectArrayProperty conforms to expected api", function(assert) {
  var prop = new ObjectArrayProperty("test", "Test");
  assert.ok(prop.name === "test", "stores name");
  assert.ok(prop.objectClassName === "Test", "stores object class name");
});

QUnit.test("Properties conforms to expected api", function(assert) {
  var properties = new Properties();
  var pp = new PrimitiveProperty("pp");
  var op = new ObjectProperty("op", "Test");
  var oap = new ObjectArrayProperty("oap", "Test");
  properties.addProperty(pp).addProperty(op).addProperty(oap);
  assert.ok(arraysEqual(properties.primitive, [pp]), "stores primitive properties");
  assert.ok(arraysEqual(properties.objectP, [op]), "stores object properties");
  assert.ok(arraysEqual(properties.arrayP, [oap]), "stores object array properties");
});
