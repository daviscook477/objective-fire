module("Array Tests");

var injector = angular.injector(['ng', 'objective-fire']);
var pa = injector.get('PointerArray');
var s = injector.get('Schema');
var ObjectFire = injector.get('ObjectFire');
asyncTest("pointer array works", function(assert) {
  //assert.expect(0);
  var ref = new Firebase("https://idea0.firebaseio.com");
  var catSchema = new s('category', 'ideas');
  catSchema.addDataProperty("title", "string");
  var objFire = new ObjectFire(ref);
  objFire.registerObjectClass(catSchema);

  var Category = objFire.getObjectClass('category');
  var pointRef = ref.child('categories').child('-Jhfut9iySJl4rHq_9fX').child('ideas');
  var mypa = new pa(pointRef, Category);
  mypa.$loaded().then(function(self) {
    console.log("hello!")
    console.log("hello world ");
    mypa[0].$loaded(function( self2) {
      console.log(self2.title);
    });
    assert.ok(true);
    start();
  })


});
