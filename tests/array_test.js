module("Array Tests");

var injector = angular.injector(['objective-fire']);
var pa = injector.get('PointerArray');
var s = injector.get('Schema');
var ObjectFire = injector.get('ObjectFire');

test("pointer array works", function(assert) {
  var ref = new Firebase("https://idea0.firebaseio.com");
  var catSchema = new s('category', 'categories');
  catSchema.addDataProperty("title", "string");
  var objFire = new ObjectFire(ref);
  objFire.registerObjectClass(catSchema);

  var Category = objFire.getObjectClass('category');
  var pointRef = ref.child('categories').child('-Jhfut9iySJl4rHq_9fX').child('ideas');
  var mypa = new pa(pointRef, Category);
  console.log(mypa);
  ok(mypa);
});
