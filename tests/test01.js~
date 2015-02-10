angular.module('test01', ['objective-fire'])

// this is a really bad type of test

.controller('ctrl', function($scope, Schema, ObjectFire) {
  console.log("doing test01");
  var ref = new Firebase("https://idea0.firebaseio.com");

  // create user schema
  var user = new Schema("user", "users");
  user.addDataProperty("screenName", "string");

  // create idea schema
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
  // create the objectfire and register the two schemas
  var objFire = new ObjectFire(ref);
  objFire.registerObjectClass(idea);
  objFire.registerObjectClass(user);

  // now create an instance of idea
  var Idea = objFire.getObjectClass("idea");
  var IdeaConst = Idea.getExistConstructor();
  var testIdea = new IdeaConst("-JhlLResumfnaJbf94gk");
  testIdea.$loaded().then(function(self) {
    console.log("idea ");
    console.log(self);
    console.log("idea user ");
    console.log(self.owner);
  });
});
