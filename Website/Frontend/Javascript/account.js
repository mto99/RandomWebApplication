//logout
//Vorgehen:
//...auf anmeldung.html weiterleiten
//...localStorage leeren

function logout(){
    localStorage.clear();
    window.location.replace('anmeldung.html');
    alert("Erfolgreich ausgeloggt");

}
