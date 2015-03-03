angular.module("objective-fire",["firebase"]).factory("ObjectiveFire",["FireObject",function(FireObject){function ObjectiveFire(ref){return!this instanceof ObjectiveFire?new ObjectiveFire(ref):(this.ref=ref,void(this.objects={}))}return ObjectiveFire.prototype={registerObjectClass:function(objectClass){return this.objects[objectClass.name]=new FireObject(objectClass,this.ref,this),this},getObjectClass:function(name){return this.objects[name]}},ObjectiveFire}]),angular.module("objective-fire").factory("Factories",["$firebaseObject","$firebaseArray","$q",function($firebaseObject,$firebaseArray,$q){var factories={objectFactory:function(objectClass,rootRef,objFire){return $firebaseObject.$extend({_objectClass:objectClass,_rootRef:rootRef,_objFire:objFire,$load:function(name){var properties=this._objectClass.properties,ops=(properties.primitive,properties.objectP),oaps=properties.arrayP,deffered=$q.defer();if("string"!=typeof name)throw"name must be of type string";if(this._doLoad[name])deffered.resolve(this[name]);else{for(var property=void 0,kind="",i=0;i<ops.length;i++)if(ops[i].name===name){property=ops[i],kind="op";break}for(var i=0;i<oaps.length;i++)if(oaps[i].name===name){property=oaps[i],kind="oap";break}if(this._doLoad[name]=!0,this._loaded){if("op"===kind){var objectClassName=property.objectClassName,objectClass2=objFire.getObjectClass(objectClassName),obj=objectClass2.instance(this[name]);this[name]=obj,this._isLoaded[name]=!0,deffered.resolve(this[name])}else if("oap"===kind){var objectClassName=property.objectClassName,objectClass2=objFire.getObjectClass(objectClassName),arr=new ObjectArray(rootRef.child(objectClass.name).child(this.$id).child(name),objectClass2);this[name]=arr,this._isLoaded[name]=!0,deffered.resolve(this[name])}}else this.$loaded().then(function(self){if(!self._isLoaded[name])if("op"===kind){var objectClassName=property.objectClassName,objectClass2=objFire.getObjectClass(objectClassName),obj=objectClass2.instance(self[name]);self[name]=obj}else if("oap"===kind){var objectClassName=property.objectClassName,objectClass2=objFire.getObjectClass(objectClassName),arr=new ObjectArray(rootRef.child(objectClass.name).child(self.$id).child(name),objectClass2);self[name]=arr}self._isLoaded[name]=!0,deffered.resolve(self[name])})}return deffered.promise},$toJSON:function(rec){for(var properties=this._objectClass.properties,pps=properties.primitive,ops=properties.objectP,oaps=properties.arrayP,data={},i=0;i<pps.length;i++){var name=pps[i].name;data[name]=rec[name]}for(var i=0;i<ops.length;i++){var name=ops[i].name;data[name]="object"==typeof rec[name]?rec[name].$id:rec[name]}for(var i=0;i<oaps.length;i++){var name=oaps[i].name;if("object"==typeof rec[name]){data[name]=[];for(var j=0;j<rec[name].length;j++)data[name][j]=rec[name][j].$id}else data[name]=rec[name]}for(var param in data)void 0===data[param]&&(data[param]=null);return data},$fromJSON:function(snap){var properties=this._objectClass.properties,pps=properties.primitive,ops=properties.objectP,oaps=properties.arrayP,data=snap.val();null===data&&(data={});for(var newRec={},i=0;i<pps.length;i++){var name=pps[i].name;newRec[name]=data[name]}for(var i=0;i<ops.length;i++){var name=ops[i].name;if(this._doLoad[name])if(this[name]&&this[name].$id===data[name])newRec[name]=this[name];else{var objectClassName=ops[i].objectClassName,objectClass=this._objFire.getObjectClass(objectClassName),obj=objectClass.instance(data[name]);this._isLoaded[name]=!0,newRec[name]=obj}else newRec[name]=data[name]}for(var i=0;i<oaps.length;i++){var name=oaps[i].name;if(this._doLoad[name])if(this._isLoaded[name])newRec=this[name];else{var objectClassName=oaps[i].objectClassName,objectClass=this._objFire.getObjectClass(objectClassName),Factory=factories.arrayFactory(objectClass,this._rootRef,this._objFire),arr=new Factory(this._rootRef.child(this._objectClass.name).child(this.$id).child(name));this._isLoaded[name]=!0,newRec[name]=arr}else newRec[name]=data[name]}return newRec}})},arrayFactory:function(fireObject,rootRef,objFire){return $firebaseArray.$extend({_fireObject:fireObject,_rootRef:rootRef,_objFire:objFire,$toJSON:function(rec){return rec.$id},$fromJSON:function(snap){var ob=this._fireObject.instance(snap.val());return ob}})}};return factories}]),angular.module("objective-fire").factory("FireObject",["Factories",function(Factories){function FireObject(objectClass,rootRef,objFire){this.objectClass=objectClass,this.rootRef=rootRef,this.objFire=objFire,this.Factory=Factories.objectFactory(objectClass,rootRef,objFire)}return FireObject.prototype["new"]=function(){var ref=this.rootRef.child(this.objectClass.name).push(),obj=new this.Factory(ref);if(obj._loaded=!1,obj.$loaded().then(function(){obj._loaded=!0}),obj._isLoaded={},obj._doLoad={},null===this.objectClass.objectConstructor||"function"!=typeof this.objectClass.objectConstructor)throw"new may only be called for classes that have constructors";this.objectClass.objectConstructor.apply(obj,arguments);for(var properties=this.objectClass.properties,ops=properties.objectP,oaps=properties.arrayP,i=0;i<ops.length;i++){var name=ops[i].name;name in obj&&(obj._isLoaded[name]=!0,obj._doLoad[name]=!0)}for(var i=0;i<oaps.length;i++){var name=oaps[i].name;name in obj&&(obj._isLoaded[name]=!0,obj._doLoad[name]=!0)}return obj.$save(),obj},FireObject.prototype.instance=function(id){var ref=this.rootRef.child(this.objectClass.name).child(id),obj=new this.Factory(ref);return obj._loaded=!1,obj.$loaded().then(function(){obj._loaded=!0}),obj._isLoaded={},obj._doLoad={},obj},FireObject}]),angular.module("objective-fire").factory("ObjectArray",["$firebaseArray",function($firebaseArray){var getFactory=function(fireObject){return $firebaseArray.$extend({$$added:function(snapshot){return fireObject.instance(snapshot.val())},$$updated:function(snapshot){var changed=!1,curO=this.$getRecord(snapshot.val()),newO=fireObject.instance(snapshot.val());return angular.equals(curO,newO)||(change=!0),changed}})};return function(ref,fireObject){var obj=new getFactory(fireObject);return obj}}]),angular.module("objective-fire").factory("ObjectClass",function(){function ObjectClass(name,objectConstructor,objectMethods,properties){if(!this instanceof ObjectClass)return new ObjectClass(name,objectConstructor,objectMethods,properties);if("string"!=typeof name)throw"name must be of type string";if("function"!=typeof objectConstructor&&null!==objectConstructor)throw"objectConstructor must be of type function or null";if("object"!=typeof objectMethods&&null!==objectMethods)throw"objectMethods must be of type object or null";if("object"!=typeof properties&&null!==properties)throw"properties must be of type object or null";this.name=name,this.objectConstructor=objectConstructor,this.objectMethods=objectMethods,this.properties=properties}return ObjectClass}),angular.module("objective-fire").factory("ObjectProperty",function(){function ObjectProperty(name,objectClassName){if(!this instanceof ObjectProperty)return new ObjectProperty(name,objectClassName);if("string"!=typeof name)throw"name must be of type string";this.name=name,this.objectClassName=objectClassName}return ObjectProperty}).factory("ObjectArrayProperty",function(){function ObjectArrayProperty(name,objectClassName){if(!this instanceof ObjectArrayProperty)return new ObjectArrayProperty(name,objectClassName);if("string"!=typeof name)throw"name must be of type string";this.name=name,this.objectClassName=objectClassName}return ObjectArrayProperty}).factory("PrimitiveProperty",function(){function PrimitiveProperty(name){if(!this instanceof PrimitiveProperty)return new PrimitiveProperty(name);if("string"!=typeof name)throw"name must be of type string";this.name=name}return PrimitiveProperty}).factory("Properties",["PrimitiveProperty","ObjectProperty","ObjectArrayProperty",function(PrimitiveProperty,ObjectProperty,ObjectArrayProperty){function Properties(){return!this instanceof Properties?new Properties:(this.primitive=[],this.objectP=[],void(this.arrayP=[]))}return Properties.prototype={addProperty:function(property){if(property instanceof PrimitiveProperty)this.primitive.push(property);else if(property instanceof ObjectProperty)this.objectP.push(property);else{if(!(property instanceof ObjectArrayProperty))throw"property must be of type PrimitiveProperty || ObjectProperty || ObjectArrayProperty";this.arrayP.push(property)}return this},addPrimitiveProperty:function(name){this.primitive.push(new PrimitiveProperty(name))},addObjectProperty:function(name,objectClassName){this.objectP.push(new ObjectProperty(name,objectClassName))},addObjectArrayProperty:function(name,objectClassName){this.arrayP.push(new ObjectArrayProperty(name,objectClassName))}},Properties}]);