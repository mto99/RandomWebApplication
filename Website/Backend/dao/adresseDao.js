const helper = require('../helper.js');
const LandDao = require('./landDao.js');

class AdresseDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const landDao = new LandDao(this._conn);

        var sql = 'SELECT * FROM Adresse WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);

        result = helper.objectKeysToLower(result);

        return result;
    }

    loadAll() {
        const landDao = new LandDao(this._conn);
        var countries = landDao.loadAll();

        var sql = 'SELECT * FROM Adresse';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];
        
        result = helper.arrayObjectKeysToLower(result);


        return result;
    }

    exists(id) {
        var sql = 'SELECT COUNT(ID) AS cnt FROM Adresse WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

    create(strassehausnr = '', plz = '', stadt = '') {
        var sql = 'INSERT INTO Adresse (StrasseHausnr,PLZ,Stadt) VALUES (?,?,?)';
        var statement = this._conn.prepare(sql);
        var params = [strassehausnr, plz, stadt];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not insert new Record. Data: ' + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, strassehausnr = '', plz = '', stadt = '') {
        var sql = 'UPDATE Adresse SET StrasseHausnr=?,PLZ=?,Stadt=? WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var params = [id,strassehausnr, plz, stadt];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not update existing Record. Data: ' + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            var sql = 'DELETE FROM Adresse WHERE ID=?';
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
        helper.log('AdresseDao [_conn=' + this._conn + ']');
    }
}

module.exports = AdresseDao;