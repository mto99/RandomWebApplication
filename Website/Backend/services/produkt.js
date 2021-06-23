const helper = require('../helper.js');
const ProduktDao = require('../dao/produktDao.js');
const ProduktkategorieDao = require('../dao/produktkategorieDao.js');
const express = require('express');
var serviceRouter = express.Router();

helper.log('- Service Produkt & Warenkorb');

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


//Warenkorb---------------------------------------------------

serviceRouter.post('/produkt/warenkorb', function(request, response) {
    helper.log('Service Produkt: Client requested creation of new record');


    const produktDao = new ProduktDao(request.app.locals.dbConnection);
    try {
        var result = produktDao.toCart(request.body.userid, request.body.produktid, request.body.menge, request.body.groesse);
        helper.log('Service Warenkorb: Record inserted');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Warenkorb: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

//Artikel aus dem Warenkorb holen für Benutzer
serviceRouter.get('/produkt/warenkorb/gib/:id', function(request, response) {
    helper.log('Service Produkt: Client requested cart of user with ID:...');

    const produktDao = new ProduktDao(request.app.locals.dbConnection);
    try {

        //Artikel aus dem Warenkorb holen
        var cart = produktDao.getCart(request.params.id);
        console.log('[inf] Artikel aus dem Warenkorb für UserID ' + request.params.id + ': ', cart);

        //Produkte laden mit der ProduktID aus dem Warenkorb

        var result = Array();
        for (i=0; i < cart.length; i++){
            result.push(produktDao.loadById(cart[i]['ProduktID']));
        }

        //console.log('[inf] Produkte: ', result);

        helper.log('Service Warenkorb: Record inserted');
        response.status(200).json(helper.jsonMsgOK([result,cart])); 
    } catch (ex) {
        helper.logError('Service Warenkorb: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }

});

//Artikel vom Warenkorb löschen
serviceRouter.delete('/produkt/warenkorb/delete/:id', function(request, response) {
    helper.log('Service Person: Client requested deletion of record, id=' + request.params.id);

    const produktDao = new ProduktDao(request.app.locals.dbConnection);
    try {
        //var obj = produktDao.loadById(request.params.id);
        var obj = produktDao.delete(request.params.id);
        helper.log('Service Person: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ 'gelöscht': true, 'eintrag': obj }));
    } catch (ex) {
        helper.logError('Service Person: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});


//Warenkorb leeren
serviceRouter.delete('/produkt/warenkorb/empty/:id', function(request, response) {
    helper.log('Service Person: Client requested deletion of record, id=' + request.params.id);

    const produktDao = new ProduktDao(request.app.locals.dbConnection);
    try {
        var obj = produktDao.delCart(request.params.id);
        helper.log('Service Person: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ 'gelöscht': true, 'eintrag': obj }));
    } catch (ex) {
        helper.logError('Service Person: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

//Artikel kaufen und in Table Käufe einfügen
serviceRouter.post('/produkt/kasse', function(request, response) {
    helper.log('Service Produkt: Client requested creation of new record');


    const produktDao = new ProduktDao(request.app.locals.dbConnection);
    try {

        //parameter lesen
        const id = request.body.id;
        const summe = request.body.sum;
        console.log("UserID: " + id);
        const zahlungsart = request.body.zahlungsart;
        const zahlungsinfo = request.body.zahlungsinfo;
        const productList = [];
        const datum = new Date().toDateString();

        //Aus dem Warenkorb die IDs der Produkte des UserIDs = ....
        var cart = produktDao.getCart(id);
        console.log("Cart:", cart[0]['Menge']);

        for (i=0; i < cart.length; i++){
            var result = produktDao.toPurchases(id, cart[i]['ProduktID'], cart[i]['Groesse'], cart[i]['Menge'], summe, datum, zahlungsart, zahlungsinfo);
            console.log("Result: " + result);
        }        

        var result = cart;
        helper.log('Service Kasse: Record inserted');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Kasse: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

//Suche-------------------------------------------------------
serviceRouter.get('/produkt/suche/gib/:name', function(request, response){
    helper.log('Service Produkt: Client requested records with Search=' + request.params.id);

    const produktDao = new ProduktDao(request.app.locals.dbConnection);
    const produktkategorieDao = new ProduktkategorieDao(request.app.locals.dbConnection);
    try{

        var result = produktDao.getSearch(request.params.name);
        //console.log("Result: ",result);

        var kategorieArray = Array();//array für die kategorieids
        for (i=0; i < result.length; i++){
            var resultCat = produktkategorieDao.loadById(result[i]['KategorieID']);
            kategorieArray.push(resultCat);
        }

        helper.log('Service Produkt: Records loaded, Search=' + result);
        response.status(200).json(helper.jsonMsgOK([result,kategorieArray]));
    } catch (ex) {
        helper.logError('Service Produkt: Error loading records by Search. Exception occured: ' + ex.message);
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