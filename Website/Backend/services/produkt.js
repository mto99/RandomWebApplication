const helper = require('../helper.js');
const ProduktDao = require('../dao/produktDao.js');
const express = require('express');
var serviceRouter = express.Router();

helper.log('- Service Produkt');

//============================================================
//Von Muhammed hinzugefügt
serviceRouter.get('/produkt/kategorie/:id', function(request, response){
    helper.log('Service Produkt: Client requested records with id=' + request.params.id);

    const produktDao = new ProduktDao(request.app.locals.dbConnection);
    try{
        var result = produktDao.loadByCategoryId(request.params.id);
        helper.log('Service Produkt: Records loaded, id=' + result);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Produkt: Error loading records by CategoryId. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
    
});



//============================================================

serviceRouter.get('/produkt/gib/:id', function(request, response) {
    helper.log('Service Produkt: Client requested one record, id=' + request.params.id);

    const produktDao = new ProduktDao(request.app.locals.dbConnection);
    try {
        var result = produktDao.loadById(request.params.id);
        helper.log('Service Produkt: Record loaded');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Produkt: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});


serviceRouter.get('/produkt/alle/', function(request, response) {
    helper.log('Service Produkt: Client requested all records');

    const produktDao = new ProduktDao(request.app.locals.dbConnection);
    try {
        var result = produktDao.loadAll();
        helper.log('Service Produkt: Records loaded, count=' + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Produkt: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/produkt/existiert/:id', function(request, response) {
    helper.log('Service Produkt: Client requested check, if record exists, id=' + request.params.id);

    const produktDao = new ProduktDao(request.app.locals.dbConnection);
    try {
        var result = produktDao.exists(request.params.id);
        helper.log('Service Produkt: Check if record exists by id=' + request.params.id + ', result=' + result);
        response.status(200).json(helper.jsonMsgOK({ 'id': request.params.id, 'existiert': result }));
    } catch (ex) {
        helper.logError('Service Produkt: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post('/produkt', function(request, response) {
    helper.log('Service Produkt: Client requested creation of new record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.titel)) 
        errorMsgs.push('titel fehlt');
    if (helper.isUndefined(request.body.beschreibung)) 
        request.body.beschreibung = '';
    if (helper.isUndefined(request.body.nettopreis)) 
        errorMsgs.push('nettopreis fehlt');
    if (!helper.isNumeric(request.body.nettopreis)) 
        errorMsgs.push('nettopreis muss eine Zahl sein');
    if (helper.isUndefined(request.body.kategorieid)) 
        errorMsgs.push('kategorie fehlt');
    if (helper.isUndefined(request.body.mehrwertsteuer))
        errorMsgs.push('mehrwertsteuer fehlt');
    if (helper.isUndefined(request.body.bilder)) 
        request.body.bilder = [];
    
    if (errorMsgs.length > 0) {
        helper.log('Service Produkt: Creation not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Hinzufügen nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const produktDao = new ProduktDao(request.app.locals.dbConnection);
    try {
        var result = produktDao.create(request.body.bild, request.body.titel, request.body.beschreibung, request.body.nettopreis, request.body.mehrwertsteuer.id, request.body.kategorieid);
        helper.log('Service Produkt: Record inserted');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Produkt: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.put('/produkt', function(request, response) {
    helper.log('Service Produkt: Client requested update of existing record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push('id fehlt');
    if (helper.isUndefined(request.body.titel)) 
        errorMsgs.push('titel fehlt');
    if (helper.isUndefined(request.body.beschreibung)) 
        request.body.beschreibung = '';
    if (helper.isUndefined(request.body.nettopreis)) 
        errorMsgs.push('nettopreis fehlt');
    if (!helper.isNumeric(request.body.nettopreis)) 
        errorMsgs.push('nettopreis muss eine Zahl sein');
    if (helper.isUndefined(request.body.kategorieid))
        errorMsgs.push('kategorie fehlt');      
    if (helper.isUndefined(request.body.mehrwertsteuer)) 
        errorMsgs.push('mehrwertsteuer fehlt');        
    if (helper.isUndefined(request.body.bild)) 
        request.body.bilder = [];

    if (errorMsgs.length > 0) {
        helper.log('Service Produkt: Update not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Update nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const produktDao = new ProduktDao(request.app.locals.dbConnection);
    try {
        var result = produktDao.update(request.body.bild, request.body.titel, request.body.beschreibung, request.body.nettopreis, request.body.mehrwertsteuer.id, request.body.kategorieid);
        helper.log('Service Produkt: Record updated, id=' + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Produkt: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete('/produkt/:id', function(request, response) {
    helper.log('Service Produkt: Client requested deletion of record, id=' + request.params.id);

    const produktDao = new ProduktDao(request.app.locals.dbConnection);
    try {
        var obj = produktDao.loadById(request.params.id);
        produktDao.delete(request.params.id);
        helper.log('Service Produkt: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ 'gelöscht': true, 'eintrag': obj }));
    } catch (ex) {
        helper.logError('Service Produkt: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;