/* start of file ->*/
ls = __filename.lastIndexOf('/');
rs = __filename.lastIndexOf('\\');
__filename = __filename.substring((((ls>=0)? ls + 1: 0 )| ((rs >= 0)? rs + 1: 0)), __filename.length); 
console.log('['+__filename +']'+ ": starting");
exports.done = false;
/* start of file <- */
/* ----------------------------------------- */
var ffi = require('ffi');

IndigoObject = function (d, id, parent) {
    if (!(this instanceof IndigoObject)) {
        return new IndigoObject(d, id, parent);
    }
    this.id = id;
    this.d = d;
    this.parent = parent;
}

function Indigo() {
    if (!(this instanceof Indigo)) {
        return new Indigo();
    }
    
    qword = "ulonglong";
    if (process.platform == "win32") {
        qword = "uint64";
    }
        
    var libpath = './indigo-libs/shared/' + process.platform + '/' + process.arch + '/indigo';
    this._lib = ffi.Library(libpath, {
        "indigoVersion": ["string", []], "indigoAllocSessionId": [qword, []], "indigoSetSessionId": ["void", [qword]]
    });
    
    /* function indigo.vesrion() gets node +indigo versions*/
    this.version = function () {
        return "Node (" + process.version + "); Indigo (" + this._lib.indigoVersion() + ");";
    }
    

    this._sid = this._lib.indigoAllocSessionId();
    this._setSessionId = function () { this._lib.indigoSetSessionId(this._sid) };
    this._checkResult = function (result) { if (result < 0) { throw new Error('indigo:res < 0[' + res + ']') } return result; }
    this._checkResultString = function (result) { console.log(result); return result; }
}
      
exports.indigo = Indigo;

/* ----------------------------------------- */

/*end of file ->*/
exports.done = true;
console.log('['+__filename + ']' + ": done.");
/*end of file <-*/
