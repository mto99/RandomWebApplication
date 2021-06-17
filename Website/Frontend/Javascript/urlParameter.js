// splits up all url parameters in array of json objects
// consisting of name/value pairs
function getUrlParameters() {
    // split name/value pairs into array elements
    var pairs = window.location.search.substring(1).split('&');

    // create target array
    var arr = Array();

    // transform each pair into json object and add to array
    for (i = 0; i < pairs.length; i++) {
        // only process if pair exists
        if (pairs[i].length > 0) {
            var param = pairs.toString().split(';');

//HABE ICH ANEPASST--------------------------------------------------
            //if 3 params
            if (param.length>1){
                
                // split into name/value pair
                var pair1 = param[0].split('=');
                var pair2 = param[1].split('=');
                var pair3 = param[2].split('=');

                // create json object and add to array
                arr.push({
                    paramOberkategorieName: pair1[0], 
                    paramOberkategorieValue: decodeURIComponent(pair1[1]),
                    paramUnterkategorieName: pair2[0],
                    paramUnterkategorieValue: decodeURIComponent(pair2[1]),
                    paramIdName: pair3[0],
                    paramIdValue: decodeURIComponent(pair3[1])
                });
            }

            //if 1 param
            else{
                var pair = param[0].split('=');
                // create json object and add to array
                arr.push({
                    paramOberkategorieName: pair[0], 
                    paramOberkategorieValue: decodeURIComponent(pair[1]),
                });
            }
        }
    }

    // return array
    return arr;
}

// counts all url parameters
function countUrlParameters() {
    return getUrlParameters().length;
}

// return true, if url parameters received
function hasUrlParameters() {
    return countUrlParameters() > 0;
}

// extracts value of name value pair by name
// return null if not existent

//HABE ICH ANGEPASST---------------------------------------------
function getUrlFirstParameterValue(parameterName) {
    var params = getUrlParameters();

    for (i = 0; i < params.length; i++) {
        if (params[i].paramOberkategorieName === parameterName) {
            return params[i].paramOberkategorieValue;
        }
    }

    return null;
}

function getUrlSecondParameterValue(parameterName) {
    var params = getUrlParameters();

    for (i = 0; i < params.length; i++) {
        if (params[i].paramUnterkategorieName === parameterName) {
            return params[i].paramUnterkategorieValue;
        }
    }

    return null;
}

function getUrlThirdParameterValue(parameterName){
    var params = getUrlParameters();

    for (i = 0; i< params.length; i++){
        if (params[i].paramIdName === parameterName) {
            return params[i].paramIdValue;
        }
    }

    return null;
}
// BIS HIER-------------------------------------------------------

// searches for name value pair by name
// return true if exists, otherwise false
function existsUrlParameter(parameterName) {
    var params = getUrlParameters();

    for (i = 0; i < params.length; i++) {
        if (params[i].parameterName === parameterName) {
            return true;
        }
    }

    return false;
}