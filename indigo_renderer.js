/* start of file ->*/
ls = __filename.lastIndexOf('/');
rs = __filename.lastIndexOf('\\');
__filename = __filename.substring((((ls >= 0)? ls + 1: 0) | ((rs >= 0)? rs + 1: 0)), __filename.length);
console.log('[' + __filename + ']' + ": starting");
exports.done = false;
/* start of file <- */
/* ----------------------------------------- */

var ffi = require('ffi');

function IndigoRenderer(indigo) {
    if (!(this instanceof IndigoRenderer)) {
        return new IndigoRenderer(indigo);
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
    var libpath = './indigo-libs/shared/' + process.platform + '/' + process.arch + '/indigo-renderer';
    this._lib = ffi.Library(libpath, {
        "indigoRender": ["int", ["int","int"]],
        "indigoRenderToFile": ["int", ["int", "string"]],
        "indigoRenderGrid": ["int", ["int", "pointer","int", "int"]],
        "indigoRenderGridToFile": ["int", ["int", "pointer", "int", "string"]],
        "indigoRenderReset": ["int", ["int"]]
    });
}

exports.renderer = IndigoRenderer;

/* ----------------------------------------- */

/*end of file ->*/
exports.done = true;
console.log('[' + __filename + ']' + ": done.");
/*end of file <-*/
