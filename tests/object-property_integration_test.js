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
  var dog2 = new ObjectProperty("dog2", "dog");
  userProperties.addProperty(firstName).addProperty(lastName).addProperty(dog).addProperty(dog2);
  var userClass = new ObjectClass("user", userConstructor, userMethods, userProperties);

  var objFire = new ObjectiveFire(new Firebase("https://objective-fire.firebaseio.com"));
  objFire.registerObjectClass(userClass);
  objFire.registerObjectClass(dogClass);
  var User = objFire.getObjectClass("user");
  var myUser = User.instance("user:1");
  myUser.$load("dog2");
  var numDelayedLoad = 2;
  var numLoaded = 0;
  myUser.$loaded().then(function() {
    assert.ok(myUser.first === "Davis", "loaded first property");
    assert.ok(myUser.last === "Cook", "loaded last property");
    assert.ok(typeof myUser.dog2 === "object", "preloaded dog2 property");
    assert.ok(typeof myUser.dog !== "object", "dog not preloaded")
    myUser.dog2.$loaded().then(function() {
      assert.ok(myUser.dog2.color === "Purple" && myUser.dog2.name === "Imaginary", "loaded dog2 property");
      numLoaded++;
      if (numDelayedLoad === numLoaded) {
        QUnit.start();
      }
    });
    myUser.$load("dog").then(function() {
      myUser.dog.$loaded().then(function() {
        assert.ok(myUser.dog.color === "Grey" && myUser.dog.name === "Butch", "loaded dog property");
        numLoaded++;
        if (numDelayedLoad === numLoaded) {
          QUnit.start();
        }
      });
    });
  });
});

QUnit.asyncTest("ObjectProperty correctly created to test Firebase. NOTE: will fail if connection cannot be made to Firebase", function(assert) {
  var objFire = new ObjectiveFire(new Firebase("https://objective-fire.firebaseio.com"));
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
  var userConstructor = function(first, last, dog) {
    this.first = first;
    this.last = last;
    this.dog = objFire.getObjectClass("dog").new(dog.name, dog.color);
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

  objFire.registerObjectClass(userClass);
  objFire.registerObjectClass(dogClass);
  var User = objFire.getObjectClass("user");
  var myUser = User.new("Test", "User", {name: "Test Dog", color: "Blue"});
  var ref = new Firebase("https://objective-fire.firebaseio.com");
  var numDelayedLoad = 2;
  var numLoaded = 0;
  myUser.$loaded().then(function() {
    var id = myUser.$id;
    var ref2 = ref.child("user").child(id);
    myUser.dog.$loaded().then(function() {
      var id2 = myUser.dog.$id;
      var ref3 = ref.child("dog").child(id2);
      ref3.on("value", function(snapshot) {
        var data2 = snapshot.val();
        assert.ok(data2.name === "Test Dog", "name property created of dog");
        assert.ok(data2.color === "Blue", "color property created of dog");
        numLoaded++;
        if (numDelayedLoad === numLoaded) {
          QUnit.start();
        }
      });
    });
    ref2.on("value", function(snapshot) {
      var data = snapshot.val();
      assert.ok(data.first === "Test", "first property created");
      assert.ok(data.last === "User", "last property created");
      numLoaded++;
      if (numDelayedLoad === numLoaded) {
        QUnit.start();
      }
    });
    // TODO: make it check if the dog was made
  });
});
