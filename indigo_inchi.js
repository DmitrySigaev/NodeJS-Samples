/* start of file ->*/
ls = __filename.lastIndexOf('/');
rs = __filename.lastIndexOf('\\');
__filename = __filename.substring((((ls >= 0)? ls + 1: 0) | ((rs >= 0)? rs + 1: 0)), __filename.length);
console.log('[' + __filename + ']' + ": starting");
exports.done = false;
/* start of file <- */
/* ----------------------------------------- */

var ffi = require('ffi');
var ind = require('./indigo');

function IndigoInchi(indigo) {
    if (!(this instanceof IndigoInchi)) {
        return new IndigoInchi(indigo);
    }
    
    qword = "ulonglong";
    if (process.platform == "win32") {
        qword = "uint64";

    }
    if (indigo.done == true) {
        /* module*/
        this.indigo = indigo.indigo();
    }
    else {
        /* function */
        if (indigo.name == "Indigo") {
            this.indigo = indigo();
        } else {
            /* object */
            if (indigo instanceof Object) {
                this.indigo = indigo;
            }
        }
    }
    var libpath = './indigo-libs/shared/' + process.platform + '/' + process.arch + '/indigo-inchi';
    this._lib = ffi.Library(libpath, {
        "indigoInchiVersion": ["string", []],
        "indigoInchiResetOptions": ["int", []], 
        "indigoInchiLoadMolecule": ["int", ["string"]],
        "indigoInchiGetInchi": ["string", ["int"]],
        "indigoInchiGetInchiKey": ["string", ["string"]],
        "indigoInchiGetWarning": ["string", []],
        "indigoInchiGetLog": ["string", []],
        "indigoInchiGetAuxInfo": [" string", []]
    });
    
    /* function indigo.vesrion() gets node +indigo versions*/
    this.version = function () {
        this.indigo._setSessionId();
        return this._lib.indigoInchiVersion();
    }
    this.resetOptions = function () {
        this.indigo._setSessionId();
        this.indigo._checkResult(this._lib.indigoInchiResetOptions());
    }
    this.loadMolecule = function (inchi) {
        this.indigo._setSessionId();
        res = this.indigo._checkResult(this._lib.indigoInchiLoadMolecule(inchi));
        if (res == 0)
            return null;
        return this.indigo.IndigoObject(this.indigo, res)
    }

    this.getInchi = function (molecule) {
        this.indigo._setSessionId();
        return this.indigo._checkResultString(this._lib.indigoInchiGetInchi(molecule.id));
    }
    
    this.getInchiKey = function (inchi) {
        this.indigo._setSessionId()
        return this.indigo._checkResultString(this._lib.indigoInchiGetInchiKey(inchi));
    }
    this.getWarning = function () {
        this.indigo._setSessionId();
        return this.indigo._checkResultString(this._lib.indigoInchiGetWarning());
    }
    
    this.getLog = function () {
        this.indigo._setSessionId();
        return this.indigo._checkResultString(this._lib.indigoInchiGetLog());
    }

    this.getAuxInfo = function () {
        this.indigo._setSessionId();
        return this.indigo._checkResultString(this._lib.indigoInchiGetAuxInfo());
    }
}

exports.inchi  = IndigoInchi;

/* ----------------------------------------- */

/*end of file ->*/
exports.done = true;
console.log('[' + __filename + ']' + ": done.");
/*end of file <-*/
