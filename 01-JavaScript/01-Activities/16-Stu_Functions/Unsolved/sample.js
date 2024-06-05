// Functions are reusable blocks of code that perform a specific task
// This is a function declaration 
function declareHello() { 
  console.log("Hello, I am a function declaration.");
  console.log("-----------------------------------");
  // Return stops the execution of a function
  return;
}

function printHello() {
  console.log("Hello World");
  console.log("How are you!?");
}

function printHelloTo(name) {
  console.log("Hello " + name)
}

printHelloTo("Genevieve");
printHelloTo("Camden");

printHelloTo("Laura")


// This is a function expression
var expressHello = () => { 
  console.log("Hello, I am a function expression.");
  console.log("-----------------------------------");
  return;
};

const printHelloAgain = (name, gender) => {
  // our function logic here
  console.log("Hello " + name + " (" + gender + ")")
}

printHelloAgain("Natalia", "female") // Hello Natalia (female)
printHelloAgain("Jiwon", "female") // Hello Jiwon (female)
printHelloAgain("Jordan", "male") // Hello Jordan (male)

// Functions must be called to execute
declareHello(); 
expressHello();

//Functions can be called again to make the block of code execute again
declareHello(); 

// Functions can take parameters.
// Parameters give a name to the data to be passed into the function
function declareHelloAgain(x,y,z) { 
  console.log("Hello, my parameter's values are " + x + ", " + y + ", and " + z);
  console.log("-----------------------------------");
  return;
}

// Function arguments give parameters their values
// Here the parameter x is given the value 7 when the function is called
declareHelloAgain(7, "Hello", true);
