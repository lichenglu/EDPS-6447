let a = 'Im happy to be here'; // string
let b = 50; // number
let c = 100;
let d = c % b; // 0
let e = c / 2; // -> 50

let expression1 = (b === e); // true
let expression2 = (e < d); // false

// Use comparison operators so all expressions below log to the console as true
console.log(a === b);
console.log(b !== e);
console.log(c < b);
console.log(d > 0);

// Use logical operators so all expressions below log to the console as true
console.log(expression1 && expression2);
console.log( !expression1 || expression2);
  
