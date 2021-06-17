//check if both passwords are equal
function comparePasswords() {
    var pw1 = document.getElementById('passwort1').value;
    var pw2 = document.getElementById('passwort_wdh').value;

    if (pw1 != pw2){
        document.getElementById("alertPassword").innerHTML = "Passwörter stimmen nicht überein!";
        return false;
    }

    else {
        document.getElementById("alertPassword").innerHTML = "";
        return true;
    }
}
