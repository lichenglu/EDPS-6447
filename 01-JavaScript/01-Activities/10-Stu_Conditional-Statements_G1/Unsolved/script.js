var x = 2;
var expression1 = true; // false
var expression2 = true; // true

if (expression1 && expression2){
    console.log("True ✅ True ✅");
} else if (expression1) {
    console.log("True ✅ False ❌");
} else if (expression2) {
    console.log("False ❌ True ✅");
} else {
    console.log("False ❌ False ❌");
}

x = 40
switch (x) {
    case x < 25:
        console.log("Young gansta!");
        break;
    case x < 45:
        console.log("Middle-aged gansta!");
        break;
    case x < 65:
        console.log("Elder gansta!");
        break;
    case x < 100:
        console.log("God gansta!");
        break;
}