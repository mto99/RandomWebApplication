const helper = require('../helper.js');
const PersonDao = require('../dao/personDao.js');
const express = require('express');
var serviceRouter = express.Router();

helper.log('- Service Person');

//====================================
// Die folgnden Methoden wurden von Muhammmed hinzugefügt
serviceRouter.get('/person/login/:name', function(request, response) {
    helper.log('Service Person Login: Client requested check if record exists ' + request.params.name);

    const personDao = new PersonDao(request.app.locals.dbConnection);
    try {
        //seperate paramList[3],paramList[]0;
        const parameter = request.params.name;
        const sepParam = parameter.split(';');
        //console.log("seperated Param: " + sepParam[0] + " ---- " + sepParam[1]);

        var un = personDao.existsUsername(sepParam[0]);
        
        //console.log("ID des Nutzers: " ,un);
        helper.log('Service Person: Login data valid');

        //check if passwords are equal
        var pw = personDao.getPassword(un.id); //password in db
        var enteredPW = sepParam[1];        //password entered by user
        //console.log("PWs in DB: ", pw.passwort , " |  eingabe: " + enteredPW);
        if (enteredPW != pw.passwort){
            response.status(400);
            throw new Error("FAULT! Wrong password!");
        }

        var result = un; //id des nutzer übergeben als res

        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Person Post: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});


//Von Muhammed hinzugefügt zum Persönliche Daten ändern
serviceRouter.put('/person/update', function(request, response) {
    helper.log('Service Person: Client requested update of new record');

    const personDao = new PersonDao(request.app.locals.dbConnection);
    try {
        //check if username exists
        var check = personDao.checkIfUsernameExists(request.body.benutzername);
        console.log("Check if Username exists: " +check);
        if (check == true){

            //if the username ist not changed
            if (request.body.benutzername != personDao.getUsername(request.body.id)['Benutzername']) {
                throw new Error('[err] Benutzername existiert bereits!');
            }
        }
        

        var result = personDao.updateData(request.body.anrede, request.body.vorname, request.body.nachname, 
                    request.body.benutzername, request.body.email, request.body.strassehausnr, request.body.plz, request.body.wohnort, request.body.id);
        helper.log('Service Person Put: Record updated, id=' + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Person Put: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    

});


serviceRouter.get('/person/getUsername/:id', function(request, response) {
    helper.log('Service Person Login: Client requested check if record exists ' + request.params.name);

    const personDao = new PersonDao(request.app.locals.dbConnection);
    try {
        //seperate paramList[3],paramList[]0;
        const parameter = request.params.id;
        
        helper.log('Service Person: ID');

        //check if passwords are equal
        var result = personDao.getUsername(parameter); //Benutzername in db

        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Person GetUsername: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});


//Von Muhammed hinzugefügt zum Persönliche Daten ändern
serviceRouter.put('/person/changePassword/:param', function(request, response) {
    helper.log('Service Person: Client requested update of new record');


    const personDao = new PersonDao(request.app.locals.dbConnection);
    try {

        const parameter = request.params.param; //inhalt des arrays: benutzername,sicherheitsfrage,sicherheitsantwort,passwort;
        const paramList = parameter.split(';');
        console.log("PARAMETER: " + paramList);

        //überprüfen ob sicherheitsfrage und -antwort richtig
        var question = personDao.getQuestion(paramList[0]);
        console.log("Frage: " + question.sicherheitsfrage + ' und Antwort: ' + question.sicherheitsantwort);
        if (question.sicherheitsfrage.includes(paramList[1])){
            console.log("Sicherheitsfrage richtig");
        }else{
            response.status(400);
            throw new Error("[err] Sicherheitsfrage falsch!");
        }

        if (question.sicherheitsantwort == paramList[2]){
            console.log("Sicherheitsantwort richtig");
        }else{
            response.status(400);
            throw new Error("[err] Sicherheitsantwort falsch!");
        }

        //Passwort aktualisieren
        var result = personDao.updatePassword(request.body.passwort, request.body.benutzername);

        helper.log('Service Person Put Password: Record updated, Benutzername=' + result);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Person Put Password: Error updating record by Benutzername. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    

});


//Zum Abrufen der Käufe für User mit ID:...
serviceRouter.get('/person/kaeufe/:id', function(request, response) {
    helper.log('Service Person Load Purchases: Client requested check if record exists ' + request.params.name);

    const personDao = new PersonDao(request.app.locals.dbConnection);
    try {
        const parameter = request.params.id; //id of User
        console.log("UserID: " + parameter);

        //check if passwords are equal
        var result = personDao.getPurchases(parseInt(parameter)); //Benutzername in db

        var products = [];
        for (i=0; i<result.length; i++){
            var element = personDao.getProducts(result[i]['ProduktID']);
            products.push(element);
        }

        //console.log("Element: ", products);

        response.status(200).json(helper.jsonMsgOK([result,products]));
    } catch (ex) {
        helper.logError('Service Person GetPurchases: Error loading records. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});


//Nachricht abschicken


serviceRouter.post('/person/nachricht/absenden', function(request, response) {
    helper.log('Service Kontakt: Client requested creation of new record');

    const personDao = new PersonDao(request.app.locals.dbConnection);
    try {
        var result = personDao.createMessage(request.body.anrede, request.body.vorname, request.body.nachname, 
                            request.body.email, request.body.betreff, request.body.text);
        helper.log('Service Kontakt: Record inserted');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Kontakt Post: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});


//Nachirchten abrufen

//Zum Abrufen der Käufe für User mit ID:...
serviceRouter.get('/person/nachricht', function(request, response) {
    helper.log('Service Person Load Purchases: Client requested check if record exists ' + request.params.name);

    const personDao = new PersonDao(request.app.locals.dbConnection);
    try {
        var result = personDao.getMessage();
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Person GetPurchases: Error loading records. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});


//Zum löschen einzelner NAchrichten
serviceRouter.delete('/person/nachricht/delete/:id', function(request, response) {
    helper.log('Service Person: Client requested deletion of record, id=' + request.params.id);

    const personDao = new PersonDao(request.app.locals.dbConnection);
    try {
        var obj = personDao.delMessage(request.params.id);
        helper.log('Service Message: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ 'gelöscht': true, 'eintrag': obj }));
    } catch (ex) {
        helper.logError('Service Person: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});


//====================================



serviceRouter.get('/person/gib/:id', function(request, response) {
    helper.log('Service Person: Client requested one record, id=' + request.params.id);

    const personDao = new PersonDao(request.app.locals.dbConnection);
    try {
        var result = personDao.loadById(request.params.id);
        helper.log('Service Person: Record loaded');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Person: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/person/alle', function(request, response) {
    helper.log('Service Person: Client requested all records');

    const personDao = new PersonDao(request.app.locals.dbConnection);
    try {
        var result = personDao.loadAll();
        helper.log('Service Person: Records loaded, count=' + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Person: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});


serviceRouter.get('/person/existiert/:id', function(request, response) {
    helper.log('Service Person: Client requested check, if record exists, id=' + request.params.id);

    const personDao = new PersonDao(request.app.locals.dbConnection);
    try {
        var result = personDao.exists(request.params.id);
        helper.log('Service Person: Check if record exists by id=' + request.params.id + ', result=' + result);
        response.status(200).json(helper.jsonMsgOK({ 'id': request.params.id, 'existiert': result }));
    } catch (ex) {
        helper.logError('Service Person: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});



serviceRouter.post('/person', function(request, response) {
    helper.log('Service Person: Client requested creation of new record');

    var errorMsgs=[];
    
    if (helper.isUndefined(request.body.anrede)) {
        errorMsgs.push('anrede fehlt');
    } else if (request.body.anrede.toLowerCase() !== 'herr' && request.body.anrede.toLowerCase() !== 'frau') {
        errorMsgs.push('anrede falsch. Herr und Frau sind erlaubt');
    }        
    if (helper.isUndefined(request.body.vorname)) 
        errorMsgs.push('vorname fehlt');
    if (helper.isUndefined(request.body.nachname)) 
        errorMsgs.push('nachname fehlt');
    if (helper.isUndefined(request.body.benutzername))
        errorMsgs.push('benutzername fehlt');
    if (helper.isUndefined(request.body.email)) 
        errorMsgs.push('email fehlt');
    if (!helper.isEmail(request.body.email)) 
        errorMsgs.push('email hat ein falsches Format');
    if (helper.isUndefined(request.body.sicherheitsfrage))
        errorMsgs.push('sicherheitsfrage fehlt');
    if (helper.isUndefined(request.body.sicherheitsantwort))
        errorMsgs.push('sicherheitsantwort fehlt');
    if (helper.isUndefined(request.body.passwort))
        errorMsgs.push('passwort fehlt');
    if (helper.isUndefined(request.body.strassehausnr))
        errorMsgs.push('adresse: Straße, Hausnr. fehlt');
    if (helper.isUndefined(request.body.plz))
        errorMsgs.push('adresse: plz fehlt');
    if (helper.isUndefined(request.body.wohnort))
        errorMsgs.push('adresse: wohnort fehlt');
    
    if (errorMsgs.length > 0) {
        helper.log('Service Person: Creation not possible, data missing!');
        response.status(400).json(helper.jsonMsgError('Hinzufügen nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const personDao = new PersonDao(request.app.locals.dbConnection);
    try {
        //check if username exists, else continue
        var username = personDao.existsUsername(request.body.benutzername);
        if (username == true){
            helper.logError('Service Person: Error creating new record. Username already exists.');
            throw new Error('[err] Could not create new record. Username already exists.');
        }
        //end if

        var result = personDao.create(request.body.anrede, request.body.vorname, request.body.nachname, 
                    request.body.benutzername, request.body.email, request.body.sicherheitsfrage, request.body.sicherheitsantwort, 
                    request.body.passwort, request.body.strassehausnr, request.body.plz, request.body.wohnort);
        helper.log('Service Person: Record inserted');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Person Post: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.put('/person', function(request, response) {
    helper.log('Service Person: Client requested update of existing record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push('id missing');
    if (helper.isUndefined(request.body.anrede)) {
        errorMsgs.push('anrede fehlt');
    } else if (request.body.anrede.toLowerCase() !== 'herr' && request.body.anrede.toLowerCase() !== 'frau') {
        errorMsgs.push('anrede falsch. Herr und Frau sind erlaubt');
    }        
    if (helper.isUndefined(request.body.vorname)) 
        errorMsgs.push('vorname fehlt');
    if (helper.isUndefined(request.body.nachname)) 
        errorMsgs.push('nachname fehlt');
    if (helper.isUndefined(request.body.benutzername))
        errorMsgs.push('benutzername fehlt');
    if (helper.isUndefined(request.body.email)) 
        errorMsgs.push('email fehlt');
    if (!helper.isEmail(request.body.email)) 
        errorMsgs.push('email hat ein falsches Format');
    if (helper.isUndefined(request.body.sicherheitsfrage))
        errorMsgs.push('sicherheitsfrage fehlt');
    if (helper.isUndefined(request.body.sicherheitsantwort))
        errorMsgs.push('sicherheitsantwort fehlt');
    if (helper.isUndefined(request.body.passwort))
        errorMsgs.push('passwort fehlt');
    if (helper.isUndefined(request.body.strassehausnr))
        errorMsgs.push('adresse: Straße, Hausnr. fehlt');
    if (helper.isUndefined(request.body.plz))
        errorMsgs.push('adresse: plz fehlt');
    if (helper.isUndefined(request.body.wohnort))
        errorMsgs.push('adresse: wohnort fehlt');

    if (errorMsgs.length > 0) {
        helper.log('Service Person: Update not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Update nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const personDao = new PersonDao(request.app.locals.dbConnection);
    try {
        var result = personDao.update(request.body.id, request.body.anrede, request.body.vorname, request.body.nachname, 
            request.body.benutzername, request.body.email, request.body.sicherheitsfrage, request.body.sicherheitsantwort, 
            request.body.passwort, request.body.strassehausnr, request.body.plz, request.body.wohnort);
        helper.log('Service Person: Record updated, id=' + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Person Put: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete('/person/:id', function(request, response) {
    helper.log('Service Person: Client requested deletion of record, id=' + request.params.id);

    const personDao = new PersonDao(request.app.locals.dbConnection);
    try {
        var obj = personDao.loadById(request.params.id);
        personDao.delete(request.params.id);
        helper.log('Service Person: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ 'gelöscht': true, 'eintrag': obj }));
    } catch (ex) {
        helper.logError('Service Person: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;