//check if both passwords are equal
function comparePasswords(){
    var pw1 = document.getElementById("passwort").value;
    var pw2 = document.getElementById("passwort_wdh").value;
    console.log("PW: " +pw1 + " || " + pw2);

    if (pw1 != pw2){
        document.getElementById("alertPassword").innerHTML = "Passwörter stimmen nicht überein!";
        return false;
    }

    else if (pw1 == pw2){
        document.getElementById("alertPassword").innerHTML = "";
        return true;
    }

    else{
        throw new Error("[err] Passwords are not equal!");
    }
}

