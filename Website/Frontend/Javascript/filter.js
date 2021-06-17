
function checkIfNumber(){
    var minpreis = document.getElementById("minpreis").value;
    var maxpreis = document.getElementById("maxpreis").value;

    if (isNaN(minpreis)) {
        document.getElementById("minpreis").value = "";
    }

    if (isNaN(maxpreis)){
        document.getElementById("maxpreis").value = "";
    }

}