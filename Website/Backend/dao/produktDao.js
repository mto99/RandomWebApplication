const helper = require('../helper.js');
const ProduktkategorieDao = require('./produktkategorieDao.js');
//const MehrwertsteuerDao = require('./mehrwertsteuerDao.js');
//const DownloadDao = require('./downloadDao.js');
//const ProduktbildDao = require('./produktbildDao.js');


class ProduktDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

//======================================================================
//Von Muhammed hinzugefügt
    loadByCategoryId(id){
        const produktkategorieDao = new ProduktkategorieDao(this._conn);

        var sql = 'SELECT * FROM Produkt WHERE KategorieID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.all(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by CategoryID=' + id);

        return result;
    }


//======================================================================

    loadById(id){
        var sql = 'SELECT * FROM Produkt WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);

        return result;
    }


    loadAll() {
        var sql = 'SELECT * FROM Produkt';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];

        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {
            for (var element of categories) {
                if (element.id == result[i].KategorieID) {
                    result[i].Kategorie = element;
                    break;
                }
            }
            delete result[i].KategorieID;

            result.mehrwertsteuer = helper.round((result.nettopreis / 100) * result.mehrwertsteuer);

            result[i].bruttopreis = helper.round(result[i].nettopreis + result[i].mehrwertsteuer);
        }

        return result;
    }


    exists(id) {
        var sql = 'SELECT COUNT(ID) AS cnt FROM Produkt WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }


    create(Bild = '', Titel = '', Beschreibung = '', Nettopreis = 0.0, Mehrwertsteuer, KategorieID = 0, Groesse = null) {

        var sql = 'INSERT INTO Produkt (Bild,Titel,Beschreibung,Nettopreis,Mehrwertsteuer,KategorieID,Groesse) VALUES (?,?,?,?,?,?,?)';
        var statement = this._conn.prepare(sql);
        var params = [Bild,Titel,Beschreibung,Nettopreis,Mehrwertsteuer,KategorieID,Groesse];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not insert new Record. Data: ' + params);

        
        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }


    update(ID, Bild='', Titel='',Beschreibung='', Nettopreis=0.0, Mehrwertsteuer,KategorieID = 0, Groesse=null) {
        /*
        const produktbildDao = new ProduktbildDao(this._conn);
        produktbildDao.deleteByParent(id);
        */

        var sql = 'UPDATE Produkt SET Bild=?, Titel=?, Beschreibung=?, Nettopreis=?, Mehrwertsteuer=?, KategorieID=? WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var params = [ID,Titel,Beschreibung,Nettopreis,Mehrwertsteuer,KategorieID,Groesse];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not update existing Record. Data: ' + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }


    delete(id) {
        try {
            /*
            const produktbildDao = new ProduktbildDao(this._conn);
            produktbildDao.deleteByParent(id);
            */

            var sql = 'DELETE FROM Produkt WHERE ID=?';
            var statement = this._conn.prepare(sql);
            var result = statement.run(id);

            if (result.changes != 1) 
                throw new Error('Could not delete Record by id=' + id);

            return true;
        } catch (ex) {
            throw new Error('Could not delete Record by id=' + id + '. Reason: ' + ex.message);
        }
    }


    toString() {
        helper.log('ProduktDao [_conn=' + this._conn + ']');
    }
}

module.exports = ProduktDao;
