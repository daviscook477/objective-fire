angular.module('test01', ['objective-fire'])

// this is a really bad type of test

.controller('ctrl', function($scope, Schema, ObjectFire) {
  console.log("doing test01");
  var ref = new Firebase("https://idea0.firebaseio.com");
  var user = new Schema("user", "users");
  user.addDataProperty("screenName", "string");
  var idea = new Schema("idea", "ideas");
  idea.addDataProperty("title", "string");
  idea.addDataProperty("description", "string");
  idea.addPointerListProperty("comments", "comment");
  idea.addPointerDataProperty("owner", "user");
  idea.setConstructor(function(title, description) {
    this.title = title;
    this.description = description;
    var auth = ref.getAuth();
    if (auth) {
      this.pointers.owner = auth.uid;
    }
  });
  console.log("property list of idea: " + JSON.stringify(idea.getDataProperties()));
  console.log("pointer list of idea: " + JSON.stringify(idea.getPointerDataProperties()));
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
