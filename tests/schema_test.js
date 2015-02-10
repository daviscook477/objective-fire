module("Schema Tests");

// obtain angular stuff for testing
var injector = angular.injector(['ng', 'objective-fire']);
var Schema = injector.get('Schema');


QUnit.test("schema conforms to expected api", function(assert) {
  console.log("how is this undefined but the tests work:", JSON.stringify(assert.ok));
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
  console.log(JSON.stringify(mySchema.getDataProperties()));
  assert.ok("potato" in mySchema.getDataProperties() &&
  "carrot" in mySchema.getDataProperties() &&
  "number" == mySchema.getDataProperties()["carrot"] &&
  "string" == mySchema.getDataProperties()["potato"], "schema correctly adds data properties");

  //TODO: test with pointer data properties

  //TODO: test with pointer list properties
});
