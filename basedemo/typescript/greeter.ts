class Student {
  fullName: string;
  constructor(public firstName: any, public middleInitial: any, public lastName: any) {
    this.fullName = firstName + " " + middleInitial + " " + lastName;
  }
}

interface Person {
  firstName: string;
  lastName: string;
}

function greeter(person: Person) {
  return "Hello, " + person.firstName + " " + person.lastName;
}

let user = new Student("Jane", "M.", "User");

document.body.innerHTML = greeter(user);

function* getStockPrice(stock: any) {
  while (true) {
    yield Math.random() * 100
  }
}

let priceGenerator:any = getStockPrice("IBM");

var price = 100
var limitPrice = 15

while (price > limitPrice) {
  price = priceGenerator.next().value;
  console.log(`return ${price}`)
}

console.log(`buying at ${price}`)