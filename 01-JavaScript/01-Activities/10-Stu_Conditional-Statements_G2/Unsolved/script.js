var expression1 = false;
var expression2 = true;

if (expression1 && expression2) 
{
  console.log("True ✅ True ✅");
} 
else if (expression1) 
{
  console.log("True ✅ False ❌");
}
else if (expression2) 
{
  console.log("False ❌ True ✅");
}
 else
{
  console.log("False ❌ False ❌");
}
