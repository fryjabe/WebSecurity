var CORRECT = 'rgb(225, 242, 230)';
var INCORRECT = 'rgb(244, 231, 219)';

var user = false;
var pass = false;

document.getElementById('user').addEventListener("input", function(){

  var emailInput = document.getElementById('user');

  if(emailInput.value == "" || emailInput.value == "undefined" || emailInput.value == null){
            emailInput.style.setProperty('background-color', INCORRECT, 'important');
            user = false;
            blockSubmit();
          }
  else{
            emailInput.style.setProperty('background-color', CORRECT, 'important');
            user = true;
            if(pass) allowSubmit();
  }
});


document.getElementById('pass').addEventListener("input", function(){

  var passInput = document.getElementById('pass');

  if(passInput.value == "" || passInput.value == "undefined" || passInput.value == null){
            passInput.style.setProperty('background-color', INCORRECT, 'important');
            pass = false;
            blockSubmit();
  }

  else{
            passInput.style.setProperty('background-color', CORRECT, 'important');
            pass = true;
            if(user) allowSubmit();
  }
});

window.onload = function(){
    blockSubmit();
  }



function allowSubmit(){
    document.getElementById('submitbutton').disabled=false;
}

function blockSubmit(){
    document.getElementById('submitbutton').disabled=true;
}

function preventDefault(){
    return pass && user;
}
