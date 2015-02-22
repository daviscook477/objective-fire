angular.module("objective-fire")

.factory("PointerProperty", function() {

  // type either "object" or "array"

  function Pointer(type, locVisible, locData) {
    if (!this instanceof Pointer) {
      return new Pointer(type, locVisible, locData);
    }
    this.type = type;
    this.locVisible = locVisible;
    this.locData = locData;
  }

  Pointer.prototype = {
    getType: function() {
      return this.type;
    },
    getLocationVisible: function() {
      return locVisible;
    },
    getLocationData: function() {
      return locData;
    }
  };

  return Pointer;

})

.factory("NormalProperty", function() {

  function Normal(locVisible, locData) {
    if (!this instanceof Normal) {
      return new Normal(locVisible, locData);
    }
    this.locVisible = locVisible;
    this.locData = locData;
  }

  Normal.prototype = {
    getLocationVisible: function() {
      return locVisible;
    },
    getLocationData: function() {
      return locData;
    }
  };

  return Normal;

})

.factory("Properties", function(PointerProperty, NormalProperty) {
  function Properties() {
    if (!this instanceof Properties) { // failsafe for accidental function call instead of constructor call
      return new Properties();
    }
    // create the object in which properties will be stored
    this.normal = [];
    this.pointer = {
      obj: [],
      array: []
    };
  };
  Properties.prototype = {
    // returns true on success, false on failure
    addProperty: function(property) {
      if (property instanceof PointerProperty) {
        if (property.type === "object") {
          this.pointer.obj.push(property);
        } else if (property.type === "array") {
          this.pointer.array.push(property);
        } else {
          return false;
        }
      } else if (property instanceof NormalProperty) {
        this.normal.push(property);
      } else {
        return false;
      }
      return true;
    },
    getNormalProperties: function() {

    }
  };
  return Properties;
})

;
