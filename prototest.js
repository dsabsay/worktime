function Super() {
  Super.prototype.superMethod = () => console.log("this is the super's method.");
}

function MyObject(msg) {
  const obj = new Super();
  obj.msg = msg;

  obj.greet = () => {return console.log('Here is my message: ', msg);}

  return obj;
}

function Extend(sup, methods) {
  const obj = new sup();

  // Bind this
  // Object.keys(methods).map(key => (
  //   obj[key] = methods[key].bind(obj)
  // ));

  Object.assign(obj, methods);

  return obj;
}

/* The following doesn't work because 'this' is lexically bound in arrow functions
 * and it cannot be changed.
 */
 /*
const MyObject2 = (msg) => Extend(Super, {
  init: () => this.flag = true,
  greet: () => console.log('greetings ', msg),
  bye: () => console.log('bye'),
  moreLines: () => {
    console.log('start of moreLines()');
    console.log('         a method defined with more lines');
    console.log(this);
    console.log('end of moreLines()');
  },
  set: val => this.val = val,
  get: () => this.val,
});
*/

const MyObject2 = (msg) => Extend(Super, {
  init: function() {
   this.flag = true;
  },
  greet: function() {
   console.log('greetings ', msg);
  },
  moreLines: function() {
    console.log('start of moreLines()');
    console.log('         a method defined with more lines');
    console.log(this);
    console.log('end of moreLines()');
  },
  set: function(val) {
   this.val = val
  },
  get: function() {
   return this.val
  },
});

// How I want to use these objects:
var o = MyObject('hi');
console.log(o);
console.log(Object.getPrototypeOf(o));
o.greet();
o.superMethod();

console.log('--------');
var k = MyObject2('Daniel');
console.log(k);
console.log('this: ', this);
k.init();
k.greet();
k.superMethod();
k.moreLines();
k.set('test value');
console.log(k.get());
console.log(k.moreLines);
console.log('this: ', this);
