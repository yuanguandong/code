function convertTemplate(template, data) {
  let reg = /\$\{\s(\w+)\s\}/g;
  let result = template;
  while ((a = reg.exec(template))) {
    result = result.replace(a[0], data[a[1]]);
  }
  return result;
}

let str = "My name is ${ name }, I'm ${ age } years old.";
let data = { name: "F", age: 20 };