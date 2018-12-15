var PASS_REG = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,12}$/;
var MAIL_REG = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

var CORRECT = 'rgb(225, 242, 230)';
var INCORRECT = 'rgb(244, 231, 219)';

var username;
var password;
var repassword;
var email;

document.getElementById('name').addEventListener("input", function(){

  var nameInput = document.getElementById('name');

  if(nameInput.value == "" || nameInput.value == "undefined" || nameInput.value == null){
      nameInput.style.setProperty('background-color', INCORRECT, 'important');
      username = false;
      blockSubmit();
  }
  else{
      nameInput.style.setProperty('background-color', CORRECT, 'important');
      username = true;
      if(username && password && repassword && email ) allowSubmit();
  }
});

document.getElementById('email').addEventListener("input", function(){

  var emailInput = document.getElementById('email');

  if(!MAIL_REG.test(emailInput.value)){
      emailInput.style.setProperty('background-color', INCORRECT, 'important');
      email = false;
      blockSubmit();
  }
  else{
      emailInput.style.setProperty('background-color', CORRECT, 'important');
      email = true;
      if(username && password && repassword && email) allowSubmit();
  }
});

document.getElementById('password').addEventListener("input", function(){

  var passInput = document.getElementById('password');

  if(!PASS_REG.test(passInput.value)){
    passInput.style.setProperty('background-color', INCORRECT, 'important');
    password = false;
    blockSubmit();


  }
  else{
    passInput.style.setProperty('background-color', CORRECT, 'important');
    password = true;
    if(username && password && repassword && email) allowSubmit();
    document.getElementById('passReq').style.setProperty('display', 'none', 'important')
  }

  if(password && passInput.value == document.getElementById("repassword").value){
    document.getElementById("repassword").style.setProperty('background-color', CORRECT, 'important');
    repassword = true;
    if(username && password && repassword && email) allowSubmit();
  }


});

document.getElementById('password').addEventListener("change", function(){

  var passInput = document.getElementById('password');

  if(!PASS_REG.test(passInput.value)){
    document.getElementById('passReq').style.setProperty('display', 'block', 'important')
  }

});

document.getElementById('repassword').addEventListener("input", function(){

  var repassInput = document.getElementById('repassword');

  if(repassInput.value != document.getElementById("password").value || !password){
    repassInput.style.setProperty('background-color', INCORRECT, 'important');
    repassword = false;
    blockSubmit();
  }
  else{
    repassInput.style.setProperty('background-color', CORRECT, 'important');
    repassword = true;
    if(username && password && repassword && email) allowSubmit();
  }
});



window.onload = function(){
    document.getElementById('submitbutton').disabled=true;

    username = false;
    password = false;
    repassword = false;
    email = false;
}


function allowSubmit(){
    document.getElementById('submitbutton').disabled=false;
}

function blockSubmit(){
    document.getElementById('submitbutton').disabled=true;
}

function preventDefault(){
    return username && password && repassword && email;
}
