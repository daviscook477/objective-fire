module("ObjectArrayProperty Integration Test");

QUnit.asyncTest("ObjectProperty correctly loaded from test Firebase. NOTE: will fail if connection cannot be made to Firebase", function(assert) {
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
  var dog2 = new ObjectProperty("dog2", "dog");
  userProperties.addProperty(firstName).addProperty(lastName).addProperty(dog).addProperty(dog2);
  var userClass = new ObjectClass("user", userConstructor, userMethods, userProperties);

  var objFire = new ObjectiveFire(new Firebase("https://objective-fire.firebaseio.com"));
  objFire.registerObjectClass(userClass);
  var groupConstructor = function() {

  };
  var groupMethods = {

  };
  var groupProperties = new Properties();
  var users = new ObjectArrayProperty("users", "user");
  groupProperties.addProperty(users);
  groupClass = new ObjectClass("group", groupConstructor, groupMethods, groupProperties);
  objFire.registerObjectClass(groupClass);
  var myGroup = objFire.getObjectClass("group").instance("group:1");
  myGroup.$load("users");
  myGroup.$loaded().then(function() {
    myGroup.users.$loaded().then(function() {
      myGroup.users[0].$loaded().then(function() {
        assert.ok(myGroup.users[0].first === "Davis" && myGroup.users[0].last === "Cook", "loaded the array right");
        QUnit.start();
      });
    });
  });
});
