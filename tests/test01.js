angular.module('test01', ['objective-fire'])

.controller('ctrl', function($scope, Schema, SchemaUtil) {
  console.log("doing test01");
  var user = new Schema("user", "users");
  user.addProperty("screenName", SchemaUtil.createData("string"));
  var idea = new Schema("idea", "ideas");
  idea.addProperty("title", SchemaUtil.createData("string"));
  idea.addProperty("description", SchemaUtil.createData("string"));
  idea.addProperty("owner", SchemaUtil.createDataPointer("user", false));
  console.log("property list of idea: " + JSON.stringify(idea.getProperties()));
  console.log("pointer list of idea: " + JSON.stringify(idea.getPointersData()));
});
