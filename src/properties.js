angular.module("objective-fire")

.factory("PointerObjectProperty", function() {

  // type either "object" or "array"

  // typeObject should be the name of the object the pointer resolves to

  function PointerObject(type, locVisible, locData, typeObject) {
    if (!this instanceof PointerObject) {
      return new PointerObject(type, locVisible, locData, typeObject);
    }
    this.type = type;
    this.locVisible = locVisible;
    this.locData = locData;
    this.typeObject = typeObject;
  }

  PointerObject.prototype = {
    getType: function() {
      return this.type;
    },
    getLocationVisible: function() {
      return locVisible;
    },
    getLocationData: function() {
      return locData;
    },
    getTypeObject: function() {
      return typeObject;
    }
  };

  return PointerObject;

})

.factory("PointerDataProperty", function() {

  function PointerData(locVisible, locData, fbLoc) {
    if (!this instanceof PointerData) {
      return new PointerData(locVisible, locData, fbLoc);
    }
    this.locVisible = locVisible;
    this.locData = locData;
    this.fbLoc = fbLoc;
  }

  PointerData.prototype = {
    getLocationVisible: function() {
      return locVisible;
    },
    getLocationData: function() {
      return locData;
    },
    getFBLoc: function() {
      return fbLoc;
    }
  };

  return PointerData;

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

.factory("Properties", function(PointerObjectProperty, PointerDataProperty, NormalProperty) {
  function Properties() {
    if (!this instanceof Properties) { // failsafe for accidental function call instead of constructor call
      return new Properties();
    }
    // create the object in which properties will be stored
    this.normal = [];
    this.pointer = {
      obj: [],
      array: [],
      data: []
    };
  };
  Properties.prototype = {
    // returns true on success, false on failure
    addProperty: function(property) {
      if (property instanceof PointerObjectProperty) {
        if (property.type === "object") {
          this.pointer.obj.push(property);
        } else if (property.type === "array") {
          this.pointer.array.push(property);
        } else {
          return false;
        }
      } else if (property instanceof PointerDataProperty) {
        this.pointer.data.push(property);
      } else if (property instanceof NormalProperty) {
        this.normal.push(property);
      } else {
        return false;
      }
      return true;
    },
    getNormalProperties: function() {
      return this.normal;
    },
    getPointerObjectProperties: function() {
      return this.pointer.obj;
    },
    getPointerArrayProperties: function() {
      return this.pointer.array;
    },
    getPointerDataProperties: function() {
      return this.pointer.data;
    }
  };
  return Properties;
})

;
