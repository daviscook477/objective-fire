module("Schema Tests");

// obtain angular stuff for testing
var injector = angular.injector(['ng', 'objective-fire']);
var Schema = injector.get('Schema');


QUnit.test("schema conforms to expected api", function(assert) {
  var mySchema = new Schema("test", "tests");
  assert.ok(mySchema, 'can create new schema');
  assert.ok(mySchema.getName() == "test", 'schema name is correct');
  assert.ok(mySchema.getLocation() == "tests", 'schema location is correct');
  var constructor = function() {
    console.log("Hello World!");
  };
  mySchema.setConstructor(constructor);
  assert.ok(mySchema.getConstructor() == constructor, 'schema constructor is correct');
  // add some data properties
  mySchema.addDataProperty("potato", "string").addDataProperty("carrot", "number");

  // make sure they are returned in the correct api
  assert.ok("potato" in mySchema.getDataProperties() &&
  "carrot" in mySchema.getDataProperties() &&
  "number" == mySchema.getDataProperties()["carrot"] &&
  "string" == mySchema.getDataProperties()["potato"], "schema correctly adds data properties");

  mySchema.addPointerDataProperty("owner", 'user');
  var dp = mySchema.getPointerDataProperties();
  assert.ok('owner' in dp
  && 'type' in dp['owner']
  && 'object' in dp['owner']
  && dp['owner'].type == 'pointerData'
  && dp['owner'].object == 'user', 'schema correctly adds data pointers');

  //TODO: test with pointer list properties
});
