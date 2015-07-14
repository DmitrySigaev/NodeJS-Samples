/* start of file ->*/
ls = __filename.lastIndexOf('/');
rs = __filename.lastIndexOf('\\');
__filename = __filename.substring((((ls >= 0)? ls + 1: 0) | ((rs >= 0)? rs + 1: 0)), __filename.length);
console.log('[' + __filename + ']' + ": starting");
exports.done = false;
/* start of file <- */
/* ----------------------------------------- */

var ffi = require('ffi');
var ref = require('ref');
var ArrayType = require('ref-array')
var c_int = ref.types.int;
var IntArray = ArrayType('int');


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
        "indigoRender": ["int", ["int", "int"]],
        "indigoRenderToFile": ["int", ["int", "string"]],
        "indigoRenderGrid": ["int", ["int", "pointer", "int", "int"]],
        "indigoRenderGridToFile": ["int", ["int", "pointer", "int", "string"]],
        "indigoRenderReset": ["int", ["int"]]
    });
    
    this.renderToBuffer = function (obj) {
        this.indigo._setSessionId();
        wb = this.indigo.writeBuffer();
        try {
            this.indigo._checkResult(this._lib.indigoRender(obj.id, wb.id));
            return wb.toBuffer();
        } finally {
            wb.dispose();
        }
    }
    
    this.renderToFile = function (obj, filename) {
        this.indigo._setSessionId();
        this.indigo._checkResult(this._lib.indigoRenderToFile(obj.id, filename));
    }
    
    this.renderGridToFile = function (objects, refatoms, ncolumns, filename) {
        this.indigo._setSessionId();
        arr = null;
        if (refatoms) {
            if (refatoms.length != objects.count()) {
                throw new Error("renderGridToFile(): refatoms[] size must be equal to the number of objects");
            }
            arr = new IntArray(refatoms.length);
            for (i = 0; i < refatoms.length; i++) {
                arr[i] = refatoms[i];
            }
            
            self.indigo._checkResult(
                self._lib.indigoRenderGridToFile(objects.id, arr, ncolumns, filename));
        }
    }
    
    this.renderGridToBuffer = function (objects, refatoms, ncolumns) {
        this.indigo._setSessionId();
        arr = null;
        if (refatoms) {
            if (refatoms.length != objects.count()) {
                throw new Error("renderGridToBuffer(): refatoms[] size must be equal to the number of objects");
            }
            arr = new IntArray(refatoms.length);
            for (i = 0; i < refatoms.length; i++) {
                arr[i] = refatoms[i];
            }
            wb = this.indigo.writeBuffer();
            try {
                this.indigo._checkResult(
                    this._lib.indigoRenderGrid(objects.id, arr, ncolumns, wb.id));
                return wb.toBuffer();
            } finally {
                wb.dispose();
            }

        }
    }
}

exports.renderer = IndigoRenderer;

/* ----------------------------------------- */

/*end of file ->*/
exports.done = true;
console.log('[' + __filename + ']' + ": done.");
/*end of file <-*/
