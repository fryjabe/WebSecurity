var CORRECT = 'rgb(225, 242, 230)';
var INCORRECT = 'rgb(244, 231, 219)';

var user = false;
var pass = false;

window.onload = function(){
    document.getElementById('submitbutton').disabled=true;
}

function checkError(e, t) {

	switch (t){
		case 'text':
			if(e.value == "" || e.value == "undefined" || e.value == null){
                e.style.setProperty('background-color', INCORRECT, 'important');
                user = false;
                blockSubmit();
            }
			else{
                e.style.setProperty('background-color', CORRECT, 'important');
                user = true;
                if(pass) allowSubmit();
			}
			break;

		case 'pass':

			if(!PASS_REG.test(e.value)){
                e.style.setProperty('background-color', INCORRECT, 'important');
                pass = false;
                blockSubmit();
            }
            else{
                e.style.setProperty('background-color', CORRECT, 'important');
                pass = true;
                if(user) allowSubmit();
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
    return pass && user;
}
