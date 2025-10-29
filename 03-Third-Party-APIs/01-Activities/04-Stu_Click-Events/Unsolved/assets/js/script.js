var passwordBtnEl = $('.password-btn');
var passwordDisplayEl = $('#password-display');

// Returns a random character that includes alphanumeric and special character values
function getPasswordCharacter() {
  return String.fromCharCode(Math.floor(Math.random() * 77) + 34);
}

// Returns a string of concatenated characters of length num
function passwordGenerator(num) {
  var password = '';
  for (var i = 0; i < num; i++) {
    password += getPasswordCharacter();
  }
  return password;
}

passwordBtnEl.on('dblclick', function () {
  var newPassword = passwordGenerator(15);
  passwordDisplayEl.text(newPassword);
});

// TODO: Add an event listener using "on" so that we trigger a function when passwordBtnEl is double clicked

// TODO: Within the function, we will trigger passwordGenerator and get a 15-character password, save the password as a variable "newPassword"

// TODO: then change the text of passwordDisplayEl using the newly generated password