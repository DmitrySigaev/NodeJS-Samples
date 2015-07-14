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
        }
        /* object */
        if (indigo instanceof Object) {
            this.indigo = indigo;
        }
    }
    var libpath = './indigo-libs/shared/' + process.platform + '/' + process.arch + '/indigo-inchi';
    this._lib = ffi.Library(libpath, {
        "indigoInchiVersion": ["string", []]
    });
    
    /* function indigo.vesrion() gets node +indigo versions*/
    this.version = function () {
        this.indigo._setSessionId();
        return this._lib.indigoInchiVersion();
    }
}

exports.inchi  = IndigoInchi;

/* ----------------------------------------- */

/*end of file ->*/
exports.done = true;
console.log('[' + __filename + ']' + ": done.");
/*end of file <-*/
