const helper = require('../helper.js');
const PersonDao = require('../dao/personDao.js');
const express = require('express');
var serviceRouter = express.Router();

helper.log('- Service Person');

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
        //check if username exists
        var username = personDao.existsUsername(request.body.benutzername);
        if (username == true){
            helper.logError('Service Person: Error creating new record. Username already exists.');
            response.status(400);
            throw new Error('[err] Could not create new record. Username already exists.');
        }
        //--

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