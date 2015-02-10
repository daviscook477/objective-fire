angular.module('test01', ['objective-fire'])

// this is a really bad type of test

.controller('ctrl', function($scope, Schema, SchemaUtil, ObjectFire) {
  console.log("doing test01");
  var ref = new Firebase("https://idea0.firebaseio.com");
  var user = new Schema("user", "users");
  user.addProperty("screenName", SchemaUtil.createData("string"));
  var idea = new Schema("idea", "ideas");
  idea.addProperty("title", SchemaUtil.createData("string"));
  idea.addProperty("description", SchemaUtil.createData("string"));
  idea.addProperty("comments", SchemaUtil.createDataPointer("comment", true));
  idea.addProperty("owner", SchemaUtil.createDataPointer("user", false));
  idea.setConstructor(function(title, description) {
    this.title = title;
    this.description = description;
    var auth = ref.getAuth();
    if (auth) {
      this.pointers.owner = auth.uid;
    }
  });
  console.log("property list of idea: " + JSON.stringify(idea.getProperties()));
  console.log("pointer list of idea: " + JSON.stringify(idea.getPointersData()));
  console.log(ObjectFire);
  var objFire = new ObjectFire(ref);
  objFire.registerObjectType(idea);
  objFire.registerObjectType(user);
  var User = objFire.constructorOf("user");
  var Idea = objFire.constructorOf("idea");
  var IdeaNew = objFire.constructorOfNew("idea");
  var testUser = new User("simplelogin:12");
  testUser.$loaded().then(function(self) {
    console.log("user ");
    console.log(self);
  })
  var testIdea = new Idea("-JhlLResumfnaJbf94gk");
  testIdea.$loaded().then(function(self) {
    console.log("idea ");
    console.log(self);
    console.log("idea user ");
    console.log(self.owner);
  });
});
