const helper = require('../helper.js');
///const AdresseDao = require('./adresseDao.js');

class PersonDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        /***const adresseDao = new AdresseDao(this._conn);***/

        var sql = 'SELECT * FROM User WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);

        result = helper.objectKeysToLower(result);

        /***if (result.anrede == 0) 
            result.anrede = 'Herr';
        else 
            result.anrede = 'Frau';

        result.adresse = adresseDao.loadById(result.adresseid);
        delete result.adresseid;
        ***/

        return result;
    }

    loadAll() {
        /***
        const adresseDao = new AdresseDao(this._conn);
        var addresses = adresseDao.loadAll();
        ***/

        var sql = 'SELECT * FROM User';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];
        
        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {
            if (result[i].anrede == 0) 
                result[i].anrede = 'Herr';
            else 
                result[i].anrede = 'Frau';
        }

        return result;
    }

    exists(id) {
        var sql = 'SELECT COUNT(ID) AS cnt FROM User WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

    
    //Von Muhammed hinzugefügt für die Registrierung 
    //Überprüft ob der eingebene Benutzername bereits vergeben ist
    existsUsername(username) {
        var sql = 'SELECT ID FROM User WHERE Benutzername=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(username);

        if (result != null){
            return true;
        }
        return false;
    }

    create(anrede = 'Herr', vorname = '', nachname = '', benutzername = '', email = '', sicherheitsfrage = '', 
        sicherheitsantwort = '', passwort = '', strassehausnr = '', plz = '', wohnort = '') {
        var sql = 'INSERT INTO User (Anrede,Vorname,Nachname,Benutzername,Email,Sicherheitsfrage,Sicherheitsantwort,Passwort,StrasseHausnr,PLZ,Wohnort) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
        var statement = this._conn.prepare(sql);
        var params = [anrede, vorname, nachname, benutzername, email, sicherheitsfrage, sicherheitsantwort, passwort, strassehausnr, plz, wohnort];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not insert new Record. Data: ' + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, anrede = 'Herr', vorname = '', nachname = '', benutzername = '', email = '', sicherheitsfrage = '', 
        sicherheitsantwort = '', passwort = '', strassehausnr = '', plz = '', wohnort = '') {
        var sql = 'UPDATE User SET \
                Anrede=?,Vorname=?,Nachname=?,Benutzername=?,Email=?,Sicherheitsfrage=?,Sicherheitsantwort=?,Passwort=?,StrasseHausnr=?,PLZ=?,Wohnort=? \
                WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var params = [id, anrede, vorname, nachname, benutzername, email, sicherheitsfrage, sicherheitsantwort, passwort, strassehausnr, plz, wohnort];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not update existing Record. Data: ' + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            var sql = 'DELETE FROM User WHERE ID=?';
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
        helper.log('PersonDao [_conn=' + this._conn + ']');
    }
}

module.exports = PersonDao;
