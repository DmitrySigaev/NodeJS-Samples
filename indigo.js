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
var int_ptr = ref.refType('int');
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
    
    this.xyz = function () {
        d._setSessionId();
        xyz = d._lib.indigoXYZ(id)
        if (xyz == null)
            throw new Error(d._lib.indigoGetLastError());
        return [xyz[0], xyz[1], xyz[2]];
    }
    
    this.setXYZ = function (x, y, z) {
        d._setSessionId();
        d._checkResult(d._lib.indigoSetXYZ(id, x, y, z))
    }
    
    this.alignAtoms = function (atom_ids, desired_xyz) {
        d._setSessionId();
        if (atom_ids.length * 3 != desired_xyz.length)
            throw new Error("alignAtoms(): desired_xyz[] must be exactly 3 times bigger than atom_ids[]");
        
        atoms = new IntArray(atom_ids.length);
        for (i = 0; i < atom_ids.length; i++) {
            atoms[i] = atom_ids[i];
        }
        xyz = new FloatArray(desired_xyz.length);
        for (i = 0; i < desired_xyz.length; i++)
            xyz[i] = desired_xyz[i];
        return d._checkResultFloat(d._lib.indigoAlignAtoms(id, atoms.length, atoms, xyz));
    }
    
    this.addStereocenter = function (type, v1, v2, v3, v4) {
        if (v4 === undefined) {
            v4 = -1;
        }
        d._setSessionId();
        return d._checkResult(d._lib.indigoAddStereocenter(this.id, type, v1, v2, v3, v4));
    }
    
    this.clone = function () {
        d._setSessionId();
        return d.IndigoObject(d, d._checkResult(d._lib.indigoClone(this.id)));
    }
    
    this.close = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoClose(this.id));
    }
    
    this._next = function () {
        d._setSessionId();
        newobj = d._checkResult(d._lib.indigoNext(this.id));
        if (newobj == 0)
            return null;
        else
            return d.IndigoObject(d, newobj, this)

    }

    this.hasNext = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoHasNext(this.id));
    }
    
    this.index = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoIndex(this.id));
    }
    
    this.remove = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoRemove(this.id));
    }
    
    this.saveMolfile = function (filename) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSaveMolfileToFile(this.id, filename));
    }

    this.molfile = function () {
        d._setSessionId();
        return d._checkResultString(d._lib.indigoMolfile(this.id));
    }
    
    this.saveCml = function (filename) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSaveCmlToFile(this.id, filename));
    }
    
    this.cml = function () {
        d._setSessionId();
        return d._checkResultString(d._lib.indigoCml(this.id));
    }
    
    this.saveMDLCT = function (output) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSaveMDLCT(this.id, output.id));
    }
    
    this.addReactant = function (molecule) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoAddReactant(this.id, molecule.id));
    }
    
    this.addProduct = function (molecule) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoAddProduct(this.id, molecule.id));
    }
    this.addCatalyst = function (molecule) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoAddCatalyst(this.id, molecule.id));
    }
    
    this.countReactants = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCountReactants(this.id));
    }
    
    this.countProducts = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCountProducts(this.id));
    }
    
    this.countCatalysts = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCountCatalysts(this.id));
    }
    
    this.countMolecules = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCountMolecules(this.id));
    }
    
    this.getMolecule = function (index) {
        d._setSessionId();
        return d.IndigoObject(d, d._checkResult(d._lib.indigoGetMolecule(this.id, index)));
    }
    
    this.iterateReactants = function () {
        d._setSessionId();
        return d.IndigoObject(d, d._checkResult(d._lib.indigoIterateReactants(this.id)));
    }
    
    this.iterateProducts = function () {
        d._setSessionId();
        return d.IndigoObject(d, d._checkResult(d._lib.indigoIterateProducts(this.id)));
    }
    
    this.iterateCatalysts = function () {
        d._setSessionId();
        return d.IndigoObject(d, d._checkResult(d._lib.indigoIterateCatalysts(this.id)));
    }
    
    this.iterateMolecules = function () {
        d._setSessionId();
        return d.IndigoObject(d, d._checkResult(d._lib.indigoIterateMolecules(this.id)));
    }
    
    this.saveRxnfile = function (filename) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSaveRxnfileToFile(this.id, filename));
    }
    
    this.rxnfile = function () {
        d._setSessionId();
        return d._checkResultString(d._lib.indigoRxnfile(this.id));
    }
    
    this.optimize = function (options) {
        d._setSessionId();
        if (options === undefined || options === null) {
            options = '';
        }
        return d._checkResult(d._lib.indigoOptimize(this.id, options));
    }
    
    this.normalize = function (options) {
        d._setSessionId();
        if (options === undefined || options === null) {
            options = '';
        }
        return d._checkResult(d._lib.indigoNormalize(this.id, options));
    }
    
    this.standardize = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoStandardize(this.id));
    }
    
    this.automap = function (mode) {
        d._setSessionId();
        if (mode === undefined || mode === null) {
            mode = '';
        }
        return d._checkResult(d._lib.indigoAutomap(this.id, mode));
    }
    
    this.atomMappingNumber = function (reaction_atom) {
        d._setSessionId();
        if (reaction_atom === undefined || reaction_atom === null) {
            return 0;
        }
        return d._checkResult(d._lib.indigoGetAtomMappingNumber(this.id, reaction_atom.id));
    }
    
    this.setAtomMappingNumber = function (reaction_atom, number) {
        d._setSessionId();
        if (reaction_atom === undefined || reaction_atom === null) {
            return 0;
        }
        return d._checkResult(d._lib.indigoSetAtomMappingNumber(this.id, reaction_atom.id, number));
    }
    
    this.reactingCenter = function (reaction_bond, number) {
        d._setSessionId();
        if (reaction_bond === undefined || reaction_bond === null) {
            return 0;
        }
        var value = ref.alloc('int'); // allocate a 4-byte (32-bit) chunk for the output value
        res = d._checkResult(d._lib.indigoGetReactingCenter(this.id, reaction_bond.id, value));
        if (res === null)
            return null;
        else
            return value.deref();
    }
    
    this.setReactingCenter = function (reaction_bond, rc) {
        d._setSessionId();
        if (reaction_bond === undefined || reaction_bond === null) {
            return 0;
        }
        return d._checkResult(d._lib.indigoSetReactingCenter(this.id, reaction_bond.id, rc));
    }
    
    this.clearAAM = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoClearAAM(this.id));
    }
    
    this.correctReactingCenters = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCorrectReactingCenters(this.id));
    }
    
    this.iterateAtoms = function () {
        d._setSessionId();
        return d.IndigoObject(d, d._checkResult(d._lib.indigoIterateAtoms(this.id)));
    }
    
    this.iteratePseudoatoms = function () {
        d._setSessionId();
        return d.IndigoObject(d, d._checkResult(d._lib.indigoIteratePseudoatoms(this.id)));
    }

    this.iterateRSites = function () {
        d._setSessionId();
        return d.IndigoObject(d, d._checkResult(d._lib.indigoIterateRSites(this.id)));
    }
    
    this.iterateStereocenters = function () {
        d._setSessionId();
        return d.IndigoObject(d, d._checkResult(d._lib.indigoIterateStereocenters(this.id)));
    }
    
    this.iterateAlleneCenters = function () {
        d._setSessionId();
        return d.IndigoObject(d, d._checkResult(d._lib.indigoIterateAlleneCenters(this.id)));
    }
    
    this.iterateRGroups = function () {
        d._setSessionId();
        return d.IndigoObject(d, d._checkResult(d._lib.indigoIterateRGroups(this.id)));
    }
    
    this.isPseudoatom = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoIsPseudoatom(this.id));
    }
    
    this.isRSite = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoIsRSite(this.id));
    }
    
    this.stereocenterType = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoStereocenterType(this.id));
    }
    
    this.stereocenterGroup = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoStereocenterGroup(this.id));
    }

    this.setStereocenterGroup = function (group) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSetStereocenterGroup(this.id, group));
    }
    
    this.changeStereocenterType = function (type) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoChangeStereocenterType(this.id, type));
    }
    
    this.validateChirality = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoValidateChirality(this.id));
    }
    
    this.singleAllowedRGroup = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSingleAllowedRGroup(this.id));
    }
    
    this.iterateRGroupFragments = function () {
        d._setSessionId();
        return d.IndigoObject(d, d._checkResult(d._lib.indigoIterateRGroupFragments(this.id)));
    }
    
    this.countAttachmentPoints = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCountAttachmentPoints(this.id));
    }
    
    this.iterateAttachmentPoints = function (order) {
        d._setSessionId();
        return d.IndigoObject(d, d._checkResult(d._lib.indigoIterateAttachmentPoints(this.id, order)));
    }
    
    this.symbol = function () {
        d._setSessionId();
        return d._checkResultString(d._lib.indigoSymbol(this.id));
    }
    
    this.degree = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoDegree(this.id));
    }
    
    this.charge = function () {
        d._setSessionId();
        var value = ref.alloc('int'); // allocate a 4-byte (32-bit) chunk for the output value
        res = d._checkResult(d._lib.indigoGetCharge(this.id, value));
        if (res === null)
            return null;
        else
            return value.deref();
    }
    
    this.getExplicitValence = function () {
        d._setSessionId();
        var value = ref.alloc('int'); // allocate a 4-byte (32-bit) chunk for the output value
        res = d._checkResult(d._lib.indigoGetExplicitValence(this.id, value));
        if (res === null)
            return null;
        else
            return value.deref();
    }
    
    this.setExplicitValence = function (valence) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSetExplicitValence(this.id, valence));
    }
    
    this.radicalElectrons = function () {
        d._setSessionId();
        var value = ref.alloc('int'); // allocate a 4-byte (32-bit) chunk for the output value
        res = d._checkResult(d._lib.indigoGetRadicalElectrons(this.id, value));
        if (res === null)
            return null;
        else
            return value.deref();
    }
    
    this.radical = function () {
        d._setSessionId();
        var value = ref.alloc('int'); // allocate a 4-byte (32-bit) chunk for the output value
        res = d._checkResult(d._lib.indigoGetRadical(this.id, value));
        if (res === null)
            return null;
        else
            return value.deref();
    }
    
    this.setRadical = function (radical) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSetRadical(this.id, radical));
    }
    
    this.atomicNumber = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoAtomicNumber(this.id));
    }
    
    this.isotope = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoIsotope(this.id));
    }

    this.valence = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoValence(this.id));
    }
    
    this.countHydrogens = function () {
        d._setSessionId();
        var value = ref.alloc('int'); // allocate a 4-byte (32-bit) chunk for the output value
        res = d._checkResult(d._lib.indigoCountHydrogens(this.id, value));
        if (res === null)
            return null;
        else
            return value.deref();
    }
    
    this.countImplicitHydrogens = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCountImplicitHydrogens(this.id));
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

    this.countBits = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCountBits(id));
    }
    
    this.cmlHeader = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCmlHeader(id));
    }
    
    this.cmlFooter = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCmlFooter(id));
    }
    
    this.iterateArray = function () {
        d._setSessionId();
        newobj = d._checkResult(d._lib.indigoIterateArray(id));
        if (newobj == 0)
            return null;
        else
            return d.IndigoObject(d, newobj, this)
    }
    
    this.unignoreAllAtoms = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoUnignoreAllAtoms(id));
    }
    
    this.highlightedTarget = function () {
        d._setSessionId();
        return d.IndigoObject(d, d._checkResult(d._lib.indigoHighlightedTarget(id)));
    }

    this.allScaffolds = function () {
        d._setSessionId();
        return d.IndigoObject(d, d._checkResult(d._lib.indigoAllScaffolds(id)));
    }
    
    this.decomposedMoleculeScaffold = function () {
        d._setSessionId();
        return d.IndigoObject(d, d._checkResult(d._lib.indigoDecomposedMoleculeScaffold(id)));
    }
    this.iterateDecomposedMolecules = function () {
        d._setSessionId();
        return d.IndigoObject(d, d._checkResult(d._lib.indigoIterateDecomposedMolecules(id)));
    }
    this.decomposedMoleculeHighlighted = function () {
        d._setSessionId();
        return d.IndigoObject(d, d._checkResult(d._lib.indigoDecomposedMoleculeHighlighted(id)));
    }
    this.decomposedMoleculeWithRGroups = function () {
        d._setSessionId();
        return d.IndigoObject(d, d._checkResult(d._lib.indigoDecomposedMoleculeWithRGroups(id)));
    }

    this.iterateDecompositions = function () {
        d._setSessionId();
        return d.IndigoObject(d, d._checkResult(d._lib.indigoIterateDecompositions(id)));
    }
    
    this.expandAbbreviations = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoExpandAbbreviations(id));
    }
    
    this.dbgInternalType = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoDbgInternalType(id));
    }
    
    this.smiles = function () {
        d._setSessionId();
        return d._checkResultString(d._lib.indigoSmiles(id));
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
        "indigoNext": ["int", ["int"]],
        "indigoHasNext": ["int", ["int"]],
        "indigoClone": ["int", ["int"]],
        "indigoClose": ["int", ["int"]],
        "indigoIndex": ["int", ["int"]],
        "indigoRemove": ["int", ["int"]],
        "indigoSaveMolfileToFile": ["int", ["string"]], 
        "indigoMolfile": ["string", ["int"]],
        "indigoSaveCmlToFile": ["int", ["string"]], 
        "indigoCml": ["string", ["int"]],
        "indigoSaveMDLCT": ["int", ["int", "int"]],
        "indigoAddReactant": ["int", ["int", "int"]],
        "indigoAddProduct": ["int", ["int", "int"]],
        "indigoAddCatalyst": ["int", ["int", "int"]],
        "indigoCountReactants": ["int", ["int"]],
        "indigoCountProducts": ["int", ["int"]],
        "indigoCountCatalysts": ["int", ["int"]],
        "indigoCountMolecules": ["int", ["int"]],
        "indigoGetMolecule": ["int", ["int", "int"]],
        "indigoIterateReactants": ["int", ["int"]],
        "indigoIterateProducts": ["int", ["int"]],
        "indigoIterateCatalysts": ["int", ["int"]],
        "indigoIterateMolecules": ["int", ["int"]],
        "indigoSaveRxnfileToFile": ["int", ["string"]], 
        "indigoRxnfile": ["string", ["int"]],
        "indigoOptimize": ["int", ["int", "string"]], 
        "indigoNormalize": ["int", ["int", "string"]], 
        "indigoStandardize": ["int", ["int"]],
        "indigoAutomap": ["int", ["int", "string"]], 
        "indigoGetAtomMappingNumber": ["int", ["int", "int"]],
        "indigoSetAtomMappingNumber": ["int", ["int", "int", "int"]],
        "indigoGetReactingCenter": ["int", ["int", "int", int_ptr]],
        "indigoSetReactingCenter": ["int", ["int", "int", "int"]],
        "indigoClearAAM": ["int", ["int"]],
        "indigoCorrectReactingCenters": ["int", ["int"]],
        "indigoIterateAtoms": ["int", ["int"]],
        "indigoIteratePseudoatoms": ["int", ["int"]],
        "indigoIterateRSites": ["int", ["int"]],
        "indigoIterateStereocenters": ["int", ["int"]],
        "indigoIterateAlleneCenters": ["int", ["int"]],
        "indigoIterateRGroups": ["int", ["int"]],
        "indigoIsPseudoatom": ["int", ["int"]],
        "indigoIsRSite": ["int", ["int"]],
        "indigoStereocenterType": ["int", ["int"]],
        "indigoStereocenterGroup": ["int", ["int"]],
        "indigoSetStereocenterGroup": ["int", ["int", "int"]],
        "indigoChangeStereocenterType": ["int", ["int", "int"]],
        "indigoValidateChirality": ["int", ["int"]],
        "indigoSingleAllowedRGroup": ["int", ["int"]],
        "indigoAddStereocenter": ["int", ["int", "int", "int", "int", "int", "int"]],
        "indigoIterateRGroupFragments": ["int", ["int"]],
        "indigoCountAttachmentPoints": ["int", ["int"]],
        "indigoIterateAttachmentPoints": ["int", ["int", "int"]],
        "indigoSymbol": ["int", ["int"]],
        "indigoDegree": ["int", ["int"]],
        "indigoGetCharge": ["int", ["int", int_ptr]],
        "indigoGetExplicitValence": ["int", ["int", int_ptr]],
        "indigoSetExplicitValence": ["int", ["int", "int"]],
        "indigoGetRadicalElectrons": ["int", ["int", int_ptr]],
        "indigoGetRadical": ["int", ["int", int_ptr]],
        "indigoSetRadical": ["int", ["int", "int"]],
        "indigoAtomicNumber": ["int", ["int"]],
        "indigoIsotope": ["int", ["int"]],
        "indigoValence": ["int", ["int"]],
        "indigoCountHydrogens": ["int", ["int", int_ptr]],
        "indigoCountImplicitHydrogens": ["int", ["int"]],
        "indigoOneBitsList": ["string", ["int"]],
        "indigoGetLastError": ["string", []],
        "indigoXYZ":[float_ptr,["int"]],
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
        "indigoCountBits": ["int", ["int"]],
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
