/* start of file ->*/
ls = __filename.lastIndexOf('/');
rs = __filename.lastIndexOf('\\');
__filename = __filename.substring((((ls>=0)? ls + 1: 0 )| ((rs >= 0)? rs + 1: 0)), __filename.length); 
console.log('['+__filename +']'+ ": starting");
exports.done = false;
/* start of file <- */
/* ----------------------------------------- */
var ffi = require('ffi');
var ref = require('ref');
var ArrayType = require('ref-array')
var c_int = ref.types.int;
var c_float = ref.types.float;
var IntArray = ArrayType('int');
var FloatArray = ArrayType('float');



IndigoObject = function (d, id, parent) {
    if (!(this instanceof IndigoObject)) {
        return new IndigoObject(d, id, parent);
    }
    this.id = id;
    this.d = d;
    this.parent = parent;

    this.dispose = function () {
        if (this.id >= 0)
            if (this.d._lib != null) {
                this.d._setSessionId();
            }
        this.d._lib.indigoFree(this.id);
        this.id = -1;
    }

    this.molfile = function (filename) {
        d._setSessionId();
        return d._checkResultString(d._lib.indigoMolfile(this.id));
    }

    this.saveMolfile = function (filename) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSaveMolfileToFile(this.id, filename));
    }

    this.grossFormula = function () {
        d._setSessionId();
        gfid = d._checkResult(d._lib.indigoGrossFormula(id));
        gf = d.IndigoObject(d, gfid);
        return d._checkResultString(d._lib.indigoToString(gf.id));
    }
    
    this.toString = function () {
        d._setSessionId();
        return d._checkResultString(d._lib.indigoToString(id));
    }
    
    this.oneBitsList = function () {
        d._setSessionId();
        return d._checkResultString(d._lib.indigoOneBitsList(id));
    }
    this.mdlct = function () {
        d._setSessionId();
        buf = d.writeBuffer();
        d._checkResult(d._lib.indigoSaveMDLCT(id, buf.id));
        return buf.toBuffer();
    }
    
    this.layout = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoLayout(id));
    }

    this.aromatize = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoAromatize(id));
    }

    this.dearomatize = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoDearomatize(id));
    }
    
    this.foldHydrogens = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoFoldHydrogens(id));
    }
    
    this.unfoldHydrogens = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoUnfoldHydrogens(id));
    }

    this.clearProperties = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoClearProperties(id));
    }
    
    this.tell = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoTell(id));
    }
    
    this.count = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCount(id));
    }
    
    this.clear = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoClear(id));
    }
    
    this.rdfHeader = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoRdfHeader(id));
    }

}

function Indigo() {
    if (!(this instanceof Indigo)) {
        return new Indigo();
    }
    
    qword = "ulonglong";
    if (process.platform == "win32") {
        qword = "uint64";
    }
    
    int_ptr = ref.refType('int');
    float_ptr = ref.refType('float');
        
    var libpath = './indigo-libs/shared/' + process.platform + '/' + process.arch + '/indigo';
    this._lib = ffi.Library(libpath, {
        "indigoVersion": ["string", []], 
        "indigoAllocSessionId": [qword, []],
        "indigoSetSessionId": ["void", [qword]],
        "indigoWriteBuffer": ["int", []],
        "indigoFree": ["int", ["int"]],
        "indigoIterateSDFile": ["int", ["string"]],
        "indigoSaveMolfileToFile": ["int", ["string"]], 
        "indigoMolfile": ["string", ["int"]],
        "indigoNext": ["int", ["int"]],
        "indigoOneBitsList": ["string", ["int"]],
        "indigoSaveMDLCT": ["int", ["int", "int"]],
        "indigoGetLastError": ["string", []],
        "indigoSetXYZ": ["int", ["int", "float", "float", "float"]],
        "indigoAlignAtoms": ["float", ["int", "int", int_ptr, float_ptr]],
        "indigoLayout": ["int", ["int"]],
        "indigoAromatize": ["int", ["int"]],
        "indigoDearomatize": ["int", ["int"]],
        "indigoFoldHydrogens": ["int", ["int"]],
        "indigoUnfoldHydrogens": ["int", ["int"]],
        "indigoClearProperties": ["int", ["int"]],
        "indigoTell": ["int", ["int"]],
        "indigoCount": ["int", ["int"]],
        "indigoClear": ["int", ["int"]],
        "indigoRdfHeader": ["int", ["int"]],
        "indigoCmlHeader": ["int", ["int"]],
        "indigoCmlFooter": ["int", ["int"]],
        "indigoIterateArray": ["int", ["int"]],
        "indigoUnignoreAllAtoms": ["int", ["int"]],
        "indigoHighlightedTarget": ["int", ["int"]],
        "indigoAllScaffolds": ["int", ["int"]],
        "indigoDecomposedMoleculeScaffold": ["int", ["int"]],
        "indigoIterateDecomposedMolecules": ["int", ["int"]],
        "indigoDecomposedMoleculeHighlighted": ["int", ["int"]],
        "indigoDecomposedMoleculeWithRGroups": ["int", ["int"]],
        "indigoIterateDecompositions": ["int", ["int"]],
        "indigoExpandAbbreviations": ["int", ["int"]],
        "indigoDbgInternalType": ["int", ["int"]],
        "indigoSmiles": ["string", ["int"]], 
        "indigoName": ["string", ["int"]], 
        "indigoCheckBadValence": ["string", ["int"]], 
        "indigoCheckAmbiguousH": ["string", ["int"]], 
        "indigoRawData": ["string", ["int"]], 
        "indigoToString": ["string", ["int"]],
        "indigoLoadReactionFromString": ["int", ["string"]], 
        "indigoLoadQueryReactionFromString": ["int", ["string"]], 
        "indigoLoadMoleculeFromString": ["int", ["string"]],
        "indigoLoadQueryMoleculeFromString": ["int", ["string"]]
    });
    
    /* function indigo.vesrion() gets node +indigo versions*/
    this.version = function () {
        return "Node (" + process.version + "); Indigo (" + this._lib.indigoVersion() + ");";
    }
    

    this._sid = this._lib.indigoAllocSessionId();
    this._setSessionId = function () { this._lib.indigoSetSessionId(this._sid) };
    this._checkResult = function (result) { if (result < 0) { throw new Error('indigo:res < 0[' + result + ']') } return result; }
    this._checkResultString = function (result) { console.log(result); return result; }
    this.writeBuffer = function () {
        this._setSessionId();
        id = this._checkResult(this._lib.indigoWriteBuffer());
        return IndigoObject(this, id);
    }
    this.writeBuffer = function (self) { this._setSessionId(); id = this._checkResult(this._lib.indigoWriteBuffer()); return IndigoObject(id) }
    this.iterateSDFile = function (filename) {
        this._setSessionId();
        this.id = this._checkResult(this._lib.indigoIterateSDFile(filename));
        return this;
    }
    
    this.next = function () {
        this._setSessionId();
        newobj = this._checkResult(this._lib.indigoNext(this.id))
        if (newobj !== 0) {
            this.id = newobj;
            return { value: IndigoObject(this, newobj), done: false }
        } else { return { done: true }; }
    }


}
      
exports.indigo = Indigo;

/* ----------------------------------------- */

/*end of file ->*/
exports.done = true;
console.log('['+__filename + ']' + ": done.");
/*end of file <-*/
