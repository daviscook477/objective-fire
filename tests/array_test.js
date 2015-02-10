module("Array Tests");

var injector = angular.injector(['ng', 'objective-fire']);
var pa = injector.get('PointerArray');
var s = injector.get('Schema');
var ObjectFire = injector.get('ObjectFire');
asyncTest("pointer array works", function(assert) {
  //assert.expect(0);
  var ref = new Firebase("https://idea0.firebaseio.com");
  var catSchema = new s('category', 'categories');
  catSchema.addDataProperty("title", "string");
  var objFire = new ObjectFire(ref);
  objFire.registerObjectClass(catSchema);

  var Category = objFire.getObjectClass('category');
  var pointRef = ref.child('categories').child('-Jhfut9iySJl4rHq_9fX').child('ideas');
  var mypa = new pa(pointRef, Category);
  mypa.$loaded().then(function(self) {
    console.log("hello!")
    console.log("hello world ");
    console.log(mypa[0].title);
    for (var i = 0; i < mypa.length; i++) {
      for (param in mypa[i]) {
        console.log(param, mypa[i][param]);
      }
    }
    assert.ok(mypa);
  })


});
