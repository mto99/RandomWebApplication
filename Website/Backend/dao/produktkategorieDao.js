const helper = require('../helper.js');

class ProduktkategorieDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        var sql = 'SELECT * FROM Produktkategorie WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);

        return helper.objectKeysToLower(result);
    }


//HABE ICH HINZUGEFÜGT------------------------------------------
    loadCat(id) {
        var sql = 'SELECT * FROM Produktkategorie WHERE Oberkategorie=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result))
            throw new Error('No Record found by id=' +id);
        
        return helper.objectKeysToLower(result);
    }

    loadAll() {
        var sql = 'SELECT * FROM Produktkategorie';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];
        
        return helper.arrayObjectKeysToLower(result);
    }

    exists(id) {
        var sql = 'SELECT COUNT(ID) AS cnt FROM Produktkategorie WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

    create(oberkategorie = '', unterkategorie = '', bild = '') {
        var sql = 'INSERT INTO Produktkategorie (Oberkategorie, Unterkategorie, Bild) VALUES (?)';
        var statement = this._conn.prepare(sql);
        var params = [oberkategorie, unterkategorie, bild];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not insert new Record. Data: ' + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, oberkategorie = '', unterkategorie = '', bild = '') {
        var sql = 'UPDATE Produktkategorie SET Oberkategorie=?, Unterkategorie=?, Bild=? WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var params = [id, oberkategorie, unterkategorie, bild];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not update existing Record. Data: ' + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            var sql = 'DELETE FROM Produktkategorie WHERE ID=?';
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
        helper.log('ProduktkategorieDao [_conn=' + this._conn + ']');
    }
}

module.exports = ProduktkategorieDao;