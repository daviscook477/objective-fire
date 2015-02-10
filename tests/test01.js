angular.module('test01', ['objective-fire'])

.controller('ctrl', function($scope, Schema, SchemaUtil, ObjectFire) {
  console.log("doing test01");
  var user = new Schema("user", "users");
  user.addProperty("screenName", SchemaUtil.createData("string"));
  var idea = new Schema("idea", "ideas");
  idea.addProperty("title", SchemaUtil.createData("string"));
  idea.addProperty("description", SchemaUtil.createData("string"));
  idea.addProperty("owner", SchemaUtil.createDataPointer("user", false));
  idea.setConstructor(function(title, description) {
    this.title = title;
    this.description = description;
  });
  console.log("property list of idea: " + JSON.stringify(idea.getProperties()));
  console.log("pointer list of idea: " + JSON.stringify(idea.getPointersData()));
  console.log(ObjectFire);
  var objFire = new ObjectFire(new Firebase("https://idea0.firebaseio.com"));
  objFire.registerObjectType(idea);
  objFire.registerObjectType(user);
  var User = objFire.constructorOf("user");
  var Idea = objFire.constructorOf("idea");
  var IdeaNew = objFire.constructorOfNew("idea");
  var testIdea = new Idea("-JhfuxKt7IYKzKN3rHRQ");
  testIdea.$loaded().then(function(self) {
    console.log("idea loaded");
  });
  var testIdea2 = IdeaNew("test title", "test description");
  testIdea2.$loaded().then(function(self) {
    console.log(self);
  });
});
