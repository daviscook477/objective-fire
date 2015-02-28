module("PrimitiveProperty Integration Test");

QUnit.asyncTest("PrimitiveProperty correctly loaded from test Firebase. NOTE: will fail if connection cannot be made to Firebase", function(assert) {
  var myConstructor = function() {};
  var myMethods = {
    method: function() {}
  };
  var myProperties = new Properties();
  var firstName = new PrimitiveProperty("first");
  var lastName = new PrimitiveProperty("last");
  myProperties.addProperty(firstName).addProperty(lastName);
  var myClass = new ObjectClass("user", myConstructor, myMethods, myProperties);
  var objFire = new ObjectiveFire(new Firebase("https://objective-fire.firebaseio.com"));
  objFire.registerObjectClass(myClass);
  var User = objFire.getObjectClass("user");
  var myUser = User.instance("user:1");
  myUser.$loaded().then(function() {
    assert.ok(myUser.first === "Davis", "loaded first property");
    assert.ok(myUser.last === "Cook", "loaded last property");
    start();
  });
});
