//when click on Search Button
function search(){
    var searched = document.getElementById("suche").value;
    document.location.href = "../HTML/suche.html"; //zur Suchseite weiterleiten

    searchInDatabase(searched); //funktion aufrufen
    
    return searched; //das gesuchte zurcükliefern
}

//search in Database
function searchInDatabase(param){
    var searched = param;

    //search in Database after searched

}

