module("ObjectProperty Integration Test");

QUnit.asyncTest("ObjectProperty correctly loaded from test Firebase. NOTE: will fail if connection cannot be made to Firebase", function(assert) {
  var dogConstructor = function(name, color) {
    this.name = name;
    this.color = color;
  };
  var dogMethods = {
    description: function() {return this.name + " is " + this.color;}
  };
  dogProperties = new Properties();
  var name = new PrimitiveProperty("name");
  var color = new PrimitiveProperty("color");
  dogProperties.addProperty(name).addProperty(color);
  var dogClass = new ObjectClass("dog", dogConstructor, dogMethods, dogProperties);

  var userConstructor = function(first, last) {
    this.first = first;
    this.last = last;
  };
  var userMethods = {
    fullName: function() {return this.first + " " + this.last;}
  };
  var userProperties = new Properties();
  var firstName = new PrimitiveProperty("first");
  var lastName = new PrimitiveProperty("last");
  var dog = new ObjectProperty("dog", "dog");
  userProperties.addProperty(firstName).addProperty(lastName).addProperty(dog);
  var userClass = new ObjectClass("user", userConstructor, userMethods, userProperties);

  var objFire = new ObjectiveFire(new Firebase("https://objective-fire.firebaseio.com"));
  objFire.registerObjectClass(userClass);
  objFire.registerObjectClass(dogClass);
  var User = objFire.getObjectClass("user");
  var myUser = User.instance("user:1");
  myUser.$loaded().then(function() {
    assert.ok(myUser.first === "Davis", "loaded first property");
    assert.ok(myUser.last === "Cook", "loaded last property");
    assert.ok(myUser.dog === undefined, "dog is undefined to start")
    myUser.$load("dog").then(function() {
      assert.ok(myUser.dog.color === "Grey" && myUser.dog.name === "Butch", "loaded dog property");
      start();
    });
  });
});
