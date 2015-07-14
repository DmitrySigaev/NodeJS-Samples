/* start of file ->*/
ls = __filename.lastIndexOf('/');
rs = __filename.lastIndexOf('\\');
__filename = __filename.substring((((ls >= 0)? ls + 1: 0) | ((rs >= 0)? rs + 1: 0)), __filename.length);
console.log('[' + __filename + ']' + ": starting");
exports.done = false;
/* start of file <- */
/* ----------------------------------------- */

var ffi = require('ffi');

function Bingo(indigo) {
    if (!(this instanceof Bingo)) {
        return new Bingo(indigo);
    }
    this._indigo = indigo;

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
    var libpath = './indigo-libs/shared/' + process.platform + '/' + process.arch + '/bingo';
    this._lib = ffi.Library(libpath, {
        "bingoVersion": ["string", []]
    });
    
    
    /* function bingo.vesrion() */
    this.version = function () {
        this.indigo._setSessionId();
        return this._lib.bingoVersion();
    }
}

exports.bingo = Bingo;

/* ----------------------------------------- */

/*end of file ->*/
exports.done = true;
console.log('[' + __filename + ']' + ": done.");
/*end of file <-*/
