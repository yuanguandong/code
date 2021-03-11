function person(name, age) {
  this.name = name;
  this.age = age;
  this.say = () => {
    console.log("say", `Im ${name}`);
  };
}

function student(name, age) {
  person.call(this, name, age);
  this.study = () => {
    console.log("study");
  };
}

student.prototype = new person();
let my = new student("li si", 57);

function parent() {
  this.parent = "parent";
}
let obj = new parent();

Object.prototype.MyExtend = function (params) {
  let newObj = new Object(params);
  let obj = this;
  newObj.__proto__ = obj.constructor.prototype || {};
  for (let i in obj) {
    newObj.__proto__[i] = obj[i];
  }
  return newObj;
};

let obj2 = obj.MyExtend({ b: 1 });
console.log(obj2);
