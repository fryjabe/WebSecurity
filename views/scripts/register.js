var PASS_REG = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,12}$/;
var MAIL_REG = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

var CORRECT = 'rgb(225, 242, 230)';
var INCORRECT = 'rgb(244, 231, 219)';

var username;
var password;
var repassword;
var email;

window.onload = function(){
    document.getElementById('submitbutton').disabled=true;

    username = false;
    password = false;
    repassword = false;
    email = false;
}


function checkError(e, t) {

    switch (t){
        case 'text':
            if(e.value == "" || e.value == "undefined" || e.value == null){
                e.style.setProperty('background-color', INCORRECT, 'important');
                this[e.name] = false;
                blockSubmit();
            }
            else{
                e.style.setProperty('background-color', CORRECT, 'important');
                this[e.name] = true;
                if(username && name && password && repassword && birthday && email ) allowSubmit();
            }
            break;

        case 'mail':

            if(!MAIL_REG.test(e.value)){
                e.style.setProperty('background-color', INCORRECT, 'important');
                email = false;
                blockSubmit();
            }
            else{
                e.style.setProperty('background-color', CORRECT, 'important');
                email = true;
                if(username && name && password && repassword && birthday && email) allowSubmit();
            }
            break;


        case 'pass':

            if(!PASS_REG.test(e.value)){
                e.style.setProperty('background-color', INCORRECT, 'important');
                this[e.name] = false;
                blockSubmit();
            }
            else{
                if(e.name == "repassword" && e.value != document.getElementById("password").value){
                    e.style.setProperty('background-color', INCORRECT, 'important');
                    repassword = false;
                    blockSubmit();
                }
                else{
                    e.style.setProperty('background-color', CORRECT, 'important');
                    this[e.name] = true;
                    if(username && name && password && repassword && birthday && email) allowSubmit();
                }

            }
            break;
    }

}

function allowSubmit(){
    document.getElementById('submitbutton').disabled=false;
}

function blockSubmit(){
    document.getElementById('submitbutton').disabled=true;
}

function preventDefault(){
    return name && password && repassword && birthday && email;
}
