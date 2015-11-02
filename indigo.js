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
var byte_ptr = ref.refType('byte');
var c_float = ref.types.float;
var IntArray = ArrayType('int');
var ByteArray = ArrayType('byte');
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
      
    this.oneBitsList = function () {
        d._setSessionId();
        return d._checkResultString(d._lib.indigoOneBitsList(this.id));
    }
    
    this.mdlct = function () {
        d._setSessionId();
        buf = d.writeBuffer();
        d._checkResult(d._lib.indigoSaveMDLCT(this.id, buf.id));
        return buf.toBuffer();
    }
    
    this.xyz = function () {
        d._setSessionId();
        xyz = d._lib.indigoXYZ(id)
        if (xyz == null)
            throw new Error(d._lib.indigoGetLastError());
        return [xyz[0], xyz[1], xyz[2]];
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
        return d._checkResultFloat(d._lib.indigoAlignAtoms(this.id, atoms.length, atoms, xyz));
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
        return IndigoObject(d, d._checkResult(d._lib.indigoClone(this.id)));
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
            return IndigoObject(d, newobj, this)

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
        var str = d._lib.indigoMolfile(this.id);
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
        return IndigoObject(d, d._checkResult(d._lib.indigoGetMolecule(this.id, index)));
    }
    
    this.iterateReactants = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoIterateReactants(this.id)));
    }
    
    this.iterateProducts = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoIterateProducts(this.id)));
    }
    
    this.iterateCatalysts = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoIterateCatalysts(this.id)));
    }
    
    this.iterateMolecules = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoIterateMolecules(this.id)));
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
        return IndigoObject(d, d._checkResult(d._lib.indigoIterateAtoms(this.id)));
    }
    
    this.iteratePseudoatoms = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoIteratePseudoatoms(this.id)));
    }

    this.iterateRSites = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoIterateRSites(this.id)));
    }
    
    this.iterateStereocenters = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoIterateStereocenters(this.id)));
    }
    
    this.iterateAlleneCenters = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoIterateAlleneCenters(this.id)));
    }
    
    this.iterateRGroups = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoIterateRGroups(this.id)));
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
        return IndigoObject(d, d._checkResult(d._lib.indigoIterateRGroupFragments(this.id)));
    }
    
    this.countAttachmentPoints = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCountAttachmentPoints(this.id));
    }
    
    this.iterateAttachmentPoints = function (order) {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoIterateAttachmentPoints(this.id, order)));
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
    
    this.setXYZ = function (x, y, z) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSetXYZ(this.id, x, y, z));
    }
    
    this.countSuperatoms = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCountSuperatoms(this.id));
    }

    this.countDataSGroups = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCountDataSGroups(this.id));
    }

    this.countRepeatingUnits = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCountRepeatingUnits(this.id));
    }

    this.countMultipleGroups = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCountMultipleGroups(this.id));
    }
    
    this.countGenericSGroups = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCountGenericSGroups(this.id));
    }
    
    this.iterateDataSGroups = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoIterateDataSGroups(this.id)));
    }

    this.iterateSuperatoms = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoIterateSuperatoms(this.id)));
    }

    this.iterateGenericSGroups = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoIterateGenericSGroups(this.id)));
    }

    this.iterateRepeatingUnits = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoIterateRepeatingUnits(this.id)));
    }
    
    this.iterateMultipleGroups = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoIterateMultipleGroups(this.id)));
    }
    
    this.getSuperatom = function (index) {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoGetSuperatom(this.id, index)));
    }
    
    this.getDataSGroup = function (index) {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoGetDataSGroup(this.id, index)));
    }
    
    this.getGenericSGroup = function (index) {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoGetGenericSGroup(this.id, index)));
    }

    this.getMultipleGroup = function (index) {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoGetMultipleGroup(this.id, index)));
    }
    
    this.getRepeatingUnit = function (index) {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoGetRepeatingUnit(this.id, index)));
    }
    
    this.description = function () {
        d._setSessionId();
        return d._checkResultString(d._lib.indigoDescription(this.id));
    }
    
    this.data = function () {
        d._setSessionId();
        return d._checkResultString(d._lib.indigoData(this.id));
    }
    
    this.addDataSGroup = function (atoms, bonds, description, data) {
        d._setSessionId();
        arr2 = new IntArray(atoms.length);
        for (i = 0; i < atoms.length; i++) {
            arr2[i] = atoms[i];
        }
        arr4 = new IntArray(bonds.length);
        for (i = 0; i < bonds.length; i++) {
            arr4[i] = bonds[i];
        }
        return IndigoObject(d, d._checkResult(d._lib.indigoAddDataSGroup(this.id, atoms.length, arr2,  bonds.length, arr4, description, data)));
    }
    
    this.addSuperatom = function (atoms, name) {
        d._setSessionId();
        arr2 = new IntArray(atoms.length);
        for (i = 0; i < atoms.length; i++) {
            arr2[i] = atoms[i];
        }
        return IndigoObject(d, d._checkResult(d._lib.indigoAddSuperatom(this.id, atoms.length, arr2, name)));
    }
    
    this.setDataSGroupXY = function (x, y, options) {
        d._setSessionId();
        if (options === undefined || options === null) {
            options = '';
        }
        return d._checkResult(d._lib.indigoSetDataSGroupXY(this.id, x, y, options));
    }
    
    this.setSGroupData = function (data) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSetSGroupData(this.id, data));
    }
    
    this.setSGroupCoords = function (x, y) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSetSGroupCoords(this.id, x, y));
    }
    
    this.setSGroupDescription = function (description) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSetSGroupDescription(this.id, description));
    }
    
    this.setSGroupFieldName = function (name) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSetSGroupFieldName(this.id, name));
    }
    
    this.setSGroupQueryCode = function (code) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSetSGroupQueryCode(this.id, code));
    }
    
    this.setSGroupQueryOper = function (oper) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSetSGroupQueryOper(this.id, oper));
    }
    
    this.setSGroupDisplay = function (option) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSetSGroupDisplay(this.id, option));
    }
    
    this.setSGroupLocation = function (option) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSetSGroupLocation(this.id, option));
    }
    
    this.setSGroupTag = function (tag) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSetSGroupTag(this.id, tag));
    }
    
    this.setSGroupTagAlign = function (tag_align) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSetSGroupTagAlign(this.id, tag_align));
    }
    
    this.setSGroupDataType = function (data_type) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSetSGroupDataType(this.id, data_type));
    }
    
    this.setSGroupXCoord = function (x) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSetSGroupXCoord(this.id, x));
    }
    
    this.setSGroupYCoord = function (y) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSetSGroupYCoord(this.id, y));
    }
    
    
    this.createSGroup = function (sgtype, mapping, name) {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoCreateSGroup(sgtype, mapping.id, name)));
    }
    
    this.setSGroupClass = function (sgclass) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSetSGroupClass(this.id, sgclass));
    }

    this.setSGroupName = function (sgname) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSetSGroupName(this.id, sgname));
    }

    this.getSGroupClass = function () {
        d._setSessionId();
        return d._checkResultString(d._lib.indigoGetSGroupClass(this.id));
    }
    
    this.getSGroupName = function () {
        d._setSessionId();
        return d._checkResultString(d._lib.indigoGetSGroupName(this.id));
    }
    
    this.getSGroupNumCrossBonds = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoGetSGroupNumCrossBonds(this.id));
    }
    
    this.addSGroupAttachmentPoint = function (aidx, lvidx, apid) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoAddSGroupAttachmentPoint(this.id, aidx, lvidx, apid));
    }
    
    this.deleteSGroupAttachmentPoint = function (apidx) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoDeleteSGroupAttachmentPoint(this.id, apidx));
    }
    
    this.getSGroupDisplayOption = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoGetSGroupDisplayOption(this.id));
    }
    
    this.setSGroupDisplayOption = function (option) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSetSGroupDisplayOption(this.id, option));
    }
    
    this.getSGroupMultiplier = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoGetSGroupMultiplier(this.id));
    }
    
    this.setSGroupMultiplier = function (mult) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSetSGroupMultiplier(this.id, mult));
    }
    
    this.setSGroupBrackets = function (style, x1, y1, x2, y2, x3, y3, x4, y4) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSetSGroupBrackets(this.id, style, x1, y1, x2, y2, x3, y3, x4, y4));
    }
    
    this.findSGroups = function (prop, val) {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoFindSGroups(prop, val)));
    }
    
    this.getSGroupType = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoGetSGroupType(this.id));
    }
    
    this.getSGroupIndex = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoGetSGroupIndex(this.id));
    }

    this.transformSCSRtoCTAB = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoTransformSCSRtoCTAB(this.id));
    }

    this.transformCTABtoSCSR = function (templates) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoTransformCTABtoSCSR(this.id, templates.id));
    }

    this.resetCharge = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoResetCharge(this.id));
    }
    
    this.resetExplicitValence = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoResetExplicitValence(this.id));
    }
    
    this.resetRadical = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoResetRadical(this.id));
    }
    
    this.resetIsotope = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoResetIsotope(this.id));
    }
    
    this.setAttachmentPoint = function (order) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSetAttachmentPoint(this.id, order));
    }
    
    this.clearAttachmentPoints = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoClearAttachmentPoints(this.id));
    }
    
    this.removeConstraints = function (type) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoRemoveConstraints(this.id, type));
    }
    
    this.addConstraint = function (type, value) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoAddConstraint(this.id, type, value));
    }
    
    this.addConstraintNot = function (type, value) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoAddConstraintNot(this.id, type, value));
    }
    
    this.addConstraintOr = function (type, value) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoAddConstraintOr(this.id, type, value));
    }

    this.resetStereo = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoResetStereo(this.id));
    }
    
    this.invertStereo = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoInvertStereo(this.id));
    }
    
    this.countAtoms = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCountAtoms(this.id));
    }
    
    this.countBonds = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCountBonds(this.id));
    }
    
    this.countPseudoatoms = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCountPseudoatoms(this.id));
    }
    
    this.countRSites = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCountRSites(this.id));
    }
    
    this.iterateBonds = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoIterateBonds(this.id)));
    }
    
    this.bondOrder = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoBondOrder(this.id));
    }
    
    this.bondStereo = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoBondStereo(this.id));
    }
    
    this.topology = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoTopology(this.id));
    }
    
    this.iterateNeighbors = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoIterateNeighbors(this.id)));
    }
        
    this.bond = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoBond(this.id)));
    }
    
    this.getAtom = function (idx) {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoGetAtom(this.id, idx)));
    }
    
    this.getBond = function (idx) {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoGetBond(this.id, idx)));
    }
    
    this.source = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoSource(this.id)));
    }
    
    this.destination = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoDestination(this.id)));
    }
    
    this.clearCisTrans = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoClearCisTrans(this.id));
    }
    
    this.clearStereocenters = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoClearStereocenters(this.id));
    }
    
    this.countStereocenters = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCountStereocenters(this.id));
    }
    
    this.clearAlleneCenters = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoClearAlleneCenters(this.id));
    }
    
    this.countAlleneCenters = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCountAlleneCenters(this.id));
    }
    
    this.resetSymmetricCisTrans = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoResetSymmetricCisTrans(this.id));
    }
    
    this.resetSymmetricStereocenters = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoResetSymmetricStereocenters(this.id));
    }
    
    this.markEitherCisTrans = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoMarkEitherCisTrans(this.id));
    }
    
    this.markStereobonds = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoMarkStereobonds(this.id));
    }
    
    this.addAtom = function (symbol) {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoAddAtom(this.id, symbol)));
    }
    
    this.resetAtom = function (symbol) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoResetAtom(this.id, symbol));
    }
    
    this.addRSite = function (name) {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoAddRSite(this.id, name)));
    }
    
    this.setRSite = function (name) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSetRSite(this.id, name));
    }
    
    this.setCharge = function (charge) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSetCharge(this.id, charge));
    }
    
    this.setIsotope = function (isotope) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSetIsotope(this.id, isotope));
    }
    
    this.setImplicitHCount = function (impl_h) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSetImplicitHCount(this.id, impl_h));
    }
    
    this.addBond = function (destination, order) {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoAddBond(this.id, destination.id, order)));
    }
    
    this.setBondOrder = function (order) {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoSetBondOrder(this.id, order)));
    }
  
    this.merge = function (what) {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoMerge(this.id, what.id)));
    }
    
    this.highlight = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoHighlight(this.id));
    }
    
    this.unhighlight = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoUnhighlight(this.id));
    }
    
    this.isHighlighted = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoIsHighlighted(this.id));
    }
    
    this.countComponents = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCountComponents(this.id));
    }
    
    this.componentIndex = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoComponentIndex(this.id));
    }
    
    this.iterateComponents = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoIterateComponents(this.id)));
    }
    
    this.component = function (index) {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoComponent(this.id, index)));
    }

    this.countSSSR = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCountSSSR(this.id));
    }
    
    this.iterateSSSR = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoIterateSSSR(this.id)));
    }
    
    this.iterateSubtrees = function (min_atoms, max_atoms) {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoIterateSubtrees(this.id, min_atoms, max_atoms)));
    }
    
    this.iterateRings = function (min_atoms, max_atoms) {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoIterateRings(this.id, min_atoms, max_atoms)));
    }
    
    this.iterateEdgeSubmolecules = function (min_bonds, max_bonds) {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoIterateEdgeSubmolecules(this.id, min_bonds, max_bonds)));
    }
    
    this.countHeavyAtoms = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCountHeavyAtoms(this.id));
    }
    
    this.grossFormula = function () {
        d._setSessionId();
        gfid = d._checkResult(d._lib.indigoGrossFormula(this.id));
        gf = IndigoObject(d, gfid);
        return d._checkResultString(d._lib.indigoToString(gf.id));
    }

    this.molecularWeight = function () {
        d._setSessionId();
        return d._checkResultFloat(d._lib.indigoMolecularWeight(this.id));
    }

    this.mostAbundantMass = function () {
        d._setSessionId();
        return d._checkResultFloat(d._lib.indigoMostAbundantMass(this.id));
    }
    
    this.monoisotopicMass = function () {
        d._setSessionId();
        return d._checkResultFloat(d._lib.indigoMonoisotopicMass(this.id));
    }

    this.canonicalSmiles = function () {
        d._setSessionId();
        return d._checkResultString(d._lib.indigoCanonicalSmiles(this.id));
    }
    
    this.layeredCode = function () {
        d._setSessionId();
        return d._checkResultString(d._lib.indigoLayeredCode(this.id));
    }
    
    this.symmetryClasses = function () {
        d._setSessionId();
        var size = ref.alloc('int'); // allocate a 4-byte (32-bit) chunk for the output value
        buf = d._checkResultPtr(d._lib.indigoSymmetryClasses(this.id, size));
        res = new Array();
        for (i = 0; i < size.deref(); i++) {
            res.push(buf[i]);
        }
        return res;
    }
    
    this.hasCoord = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoHasCoord(this.id));
    }

    this.hasZCoord = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoHasZCoord(this.id));
    }
    
    this.isChiral = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoIsChiral(this.id));
    }
    
    this.createSubmolecule = function (vertices) {
        d._setSessionId();
        arr2 = new IntArray(vertices.length);
        for (i = 0; i < vertices.length; i++) {
            arr2[i] = vertices[i];
        }
        return IndigoObject(d, d._checkResult(d._lib.indigoCreateSubmolecule(this.id, vertices.length, arr2)));
    }

    this.createEdgeSubmolecule = function (vertices, edges) {
        d._setSessionId();
        arr2 = new IntArray(vertices.length);
        for (i = 0; i < vertices.length; i++) {
            arr2[i] = vertices[i];
        }
        arr4 = new IntArray(edges.length);
        for (i = 0; i < edges.length; i++) {
            arr4[i] = edges[i];
        }
        return IndigoObject(d, d._checkResult(d._lib.indigoCreateEdgeSubmolecule(this.id, vertices.length, arr2, edges.length, arr4)));
    }
    
    this.getSubmolecule = function (vertices) {
        d._setSessionId();
        arr2 = new IntArray(vertices.length);
        for (i = 0; i < vertices.length; i++) {
            arr2[i] = vertices[i];
        }
        return IndigoObject(d, d._checkResult(d._lib.indigoGetSubmolecule(this.id, vertices.length, arr2)));
    }
    
    this.removeAtoms = function (vertices) {
        d._setSessionId();
        arr2 = new IntArray(vertices.length);
        for (i = 0; i < vertices.length; i++) {
            arr2[i] = vertices[i];
        }
        return IndigoObject(d, d._checkResult(d._lib.indigoRemoveAtoms(this.id, vertices.length, arr2)));
    }

    this.removeBonds = function (bonds) {
        d._setSessionId();
        arr2 = new IntArray(bonds.length);
        for (i = 0; i < bonds.length; i++) {
            arr2[i] = bonds[i];
        }
        return IndigoObject(d, d._checkResult(d._lib.indigoRemoveBonds(this.id, bonds.length, arr2)));
    }

    this.aromatize = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoAromatize(this.id));
    }

    this.dearomatize = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoDearomatize(this.id));
    }
    
    this.foldHydrogens = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoFoldHydrogens(this.id));
    }
  
    this.unfoldHydrogens = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoUnfoldHydrogens(this.id));
    }

    this.layout = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoLayout(this.id));
    }
    
    this.smiles = function () {
        d._setSessionId();
        return d._checkResultString(d._lib.indigoSmiles(this.id));
    }
    
    this.name = function () {
        d._setSessionId();
        return d._checkResultString(d._lib.indigoName(this.id));
    }
    
    this.setName = function (name) {
        d._setSessionId();
        return d._checkResultString(d._lib.indigoSetName(this.id, name));
    }
    
    this.serialize = function () {
        d._setSessionId();
        var size = ref.alloc('int'); // allocate a 4-byte (32-bit) chunk for the output value
        buf = new ByteArray();
        out_res = d._checkResult(d._lib.indigoSerialize(this.id, buf, size));
        res = new Array();
        for (i = 0; i < size.deref(); i++) {
            res.push(buf[i]);
        }
        return res;
    }
    
    this.hasProperty = function (prop) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoHasProperty(this.id, prop));
    }
    
    this.getProperty = function (prop) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoGetProperty(this.id, prop));
    }
    
    this.setProperty = function (prop, value) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSetProperty(this.id, prop, value));
    }
    
    this.removeProperty = function (prop) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoRemoveProperty(this.id, prop));
    }
    
    this.iterateProperties = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoIterateProperties(this.id)));
    }
    
    this.clearProperties = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoClearProperties(this.id));
    }
    
    this.checkBadValence = function () {
        d._setSessionId();
        return d._checkResultString(d._lib.indigoCheckBadValence(this.id));
    }
    
    this.checkAmbiguousH = function () {
        d._setSessionId();
        return d._checkResultString(d._lib.indigoCheckAmbiguousH(this.id));
    }
    
    this.fingerprint = function (type) {
        d._setSessionId();
        newobj = d._checkResult(d._lib.indigoFingerprint(this.id, type));
        if (newobj == null)
            return null;
        else
            return IndigoObject(d, newobj, this);
    }
    
    this.countBits = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCountBits(this.id));
    }

    this.rawData = function () {
        d._setSessionId();
        return d._checkResultString(d._lib.indigoRawData(this.id));
    }
    
    this.tell = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoTell(this.id));
    }
    
    this.sdfAppend = function (item) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSdfAppend(this.id, item.id));
    }
    
    this.smilesAppend = function (item) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoSmilesAppend(this.id, item.id));
    }
    
    this.rdfHeader = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoRdfHeader(this.id));
    }
    
    this.rdfAppend = function (item) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoRdfAppend(this.id, item.id));
    }

    this.cmlHeader = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCmlHeader(this.id));
    }
    
    this.cmlAppend = function (item) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCmlAppend(this.id, item.id));
    }
    
    this.cmlFooter = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCmlFooter(this.id));
    }
    
    this.append = function (object) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoAppend(this.id, object.id));
    }
    
    this.arrayAdd = function (object) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoArrayAdd(this.id, object.id));
    }

    this.at = function (index) {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoAt(this.id, index)));
    }

    this.count = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCount(this.id));
    }
    
    this.clear = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoClear(this.id));
    }
        
    this.iterateArray = function () {
        d._setSessionId();
        newobj = d._checkResult(d._lib.indigoIterateArray(this.id));
        if (newobj == 0)
            return null;
        else
            return IndigoObject(d, newobj, this);
    }
    
    this.ignoreAtom = function (atom_object) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoIgnoreAtom(this.id, atom_object.id));
    }
    
    this.unignoreAtom = function (atom_object) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoUnignoreAtom(this.id, atom_object.id));
    }

    this.unignoreAllAtoms = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoUnignoreAllAtoms(this.id));
    }
    
    this.match = function (query) {
        d._setSessionId();
        newobj = d._checkResult(d._lib.indigoMatch(this.id, query.id));
        if (newobj == null)
            return null;
        else
            return IndigoObject(d, newobj, this);
    }
    
    this.countMatches = function (query) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCountMatches(this.id, query.id));
    }
 
    this.countMatchesWithLimit = function (query, embeddings_limit) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoCountMatchesWithLimit(this.id, query.id, embeddings_limit));
    }
    
    this.iterateMatches = function (query) {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoIterateMatches(this.id, query.id)));
    }
    
    this.highlightedTarget = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoHighlightedTarget(this.id)));
    }

    this.mapAtom = function (atom) {
        d._setSessionId();
        newobj = d._checkResult(d._lib.indigoMapAtom(this.id, atom.id));
        if (newobj == null)
            return null;
        else
            return IndigoObject(d, newobj, this);
    }
    
    this.mapBond = function (bond) {
        d._setSessionId();
        newobj = d._checkResult(d._lib.indigoMapBond(this.id, bond.id));
        if (newobj == null)
            return null;
        else
            return IndigoObject(d, newobj, this);
    }
    
    this.mapMolecule = function (molecule) {
        d._setSessionId();
        newobj = d._checkResult(d._lib.indigoMapMolecule(this.id, molecule.id));
        if (newobj == null)
            return null;
        else
            return IndigoObject(d, newobj, this);
    }

    this.allScaffolds = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoAllScaffolds(this.id)));
    }
    
    this.decomposedMoleculeScaffold = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoDecomposedMoleculeScaffold(this.id)));
    }

    this.iterateDecomposedMolecules = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoIterateDecomposedMolecules(this.id)));
    }

    this.decomposedMoleculeHighlighted = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoDecomposedMoleculeHighlighted(this.id)));
    }

    this.decomposedMoleculeWithRGroups = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoDecomposedMoleculeWithRGroups(this.id)));
    }

    this.decomposeMolecule = function (mol) {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoDecomposeMolecule(this.id, mol.id)));
    }
    
    this.iterateDecompositions = function () {
        d._setSessionId();
        return IndigoObject(d, d._checkResult(d._lib.indigoIterateDecompositions(this.id)));
    }
    
    this.addDecomposition = function (q_match) {
        d._setSessionId();
        return d._checkResult(d._lib.indigoAddDecomposition(this.id, q_match.id));
    }
    
    this.toString = function () {
        d._setSessionId();
        return d._checkResultString(d._lib.indigoToString(this.id));
    }
    
    this.toBuffer = function () {
        d._setSessionId();
        var size = ref.alloc('int'); // allocate a 4-byte (32-bit) chunk for the output value
        buf = new ByteArray();
        out_res = d._checkResult(d._lib.indigoToBuffer(this.id, buf, size));
        res = new Array();
        for (i = 0; i < size.deref(); i++) {
            res.push(buf[i]);
        }
        return res;
    }
    
    this.stereocenterPyramid = function () {
        d._setSessionId();
        ptr = d._checkResultPtr(d._lib.indigoStereocenterPyramid(this.id));
        res = new Array();
        for (i = 0; i < 4; i++) {
            res.push(ptr[i]);
        }
        return res;
    }

    this.expandAbbreviations = function () {
        d._setSessionId();
        return d._checkResult(d._lib.indigoExpandAbbreviations(this.id));
    }
    
    this.dbgInternalType = function () {
        d._setSessionId();
        return d._checkResultString(d._lib.indigoDbgInternalType(this.id));
    }
    

}

function Indigo(options) {
    options = options || {};
    var libpath = './indigo-libs/shared/' + process.platform + '/' + process.arch + '/indigo';
    this.libpath = options.libpath || libpath;
    qword = "ulonglong";
    if (process.platform == "win32") {
        qword = "uint64";
    }
    
    int_ptr = ref.refType('int');
    byte_ptr = ref.refType('byte');
    float_ptr = ref.refType('float');

    this._lib = ffi.Library(libpath, {
        "indigoDbgBreakpoint": ["void", []],
        "indigoVersion": ["string", []], 
        "indigoAllocSessionId": [qword, []],
        "indigoSetSessionId": ["void", [qword]],
        "indigoReleaseSessionId": ["void", [qword]],
        "indigoGetLastError": ["string", []],
        "indigoFree": ["int", ["int"]],
        "indigoCountReferences": ["int", []],
        "indigoFreeAllObjects": ["int", []],
        "indigoWriteBuffer": ["int", []],
        "indigoCreateMolecule": ["int", []],
        "indigoCreateQueryMolecule": ["int", []],
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
        "indigoXYZ": [float_ptr, ["int"]],
        "indigoSetXYZ": ["int", ["int", "float", "float", "float"]],
        "indigoCountSuperatoms": ["int", ["int"]],
        "indigoCountDataSGroups": ["int", ["int"]],
        "indigoCountRepeatingUnits": ["int", ["int"]],
        "indigoCountMultipleGroups": ["int", ["int"]],
        "indigoCountGenericSGroups": ["int", ["int"]],
        "indigoIterateDataSGroups": ["int", ["int"]],
        "indigoIterateSuperatoms": ["int", ["int"]],
        "indigoIterateGenericSGroups": ["int", ["int"]],
        "indigoIterateRepeatingUnits": ["int", ["int"]],
        "indigoIterateMultipleGroups": ["int", ["int"]],
        "indigoGetSuperatom": ["int", ["int", "int"]],
        "indigoGetDataSGroup": ["int", ["int", "int"]],
        "indigoGetGenericSGroup": ["int", ["int", "int"]],
        "indigoGetMultipleGroup": ["int", ["int", "int"]],
        "indigoGetRepeatingUnit": ["int", ["int", "int"]],
        "indigoDescription": ["string", ["int"]],
        "indigoData": ["string", ["int"]],
        "indigoAddDataSGroup": ["int", ["int", "int", int_ptr, "int", int_ptr, "string", "string"]],
        "indigoAddSuperatom": ["int", ["int", "int", int_ptr, "string"]],
        "indigoSetDataSGroupXY": ["int", ["int", "float", "float", "string"]],
        "indigoSetSGroupData": ["int", ["int", "string"]],
        "indigoSetSGroupCoords": ["int", ["int", "float", "float"]],
        "indigoSetSGroupDescription": ["int", ["int", "string"]],
        "indigoSetSGroupFieldName": ["int", ["int", "string"]],
        "indigoSetSGroupQueryCode": ["int", ["int", "string"]],
        "indigoSetSGroupQueryOper": ["int", ["int", "string"]],
        "indigoSetSGroupDisplay": ["int", ["int", "string"]],
        "indigoSetSGroupLocation": ["int", ["int", "string"]],
        "indigoSetSGroupTag": ["int", ["int", "string"]],
        "indigoSetSGroupTagAlign": ["int", ["int", "string"]],
        "indigoSetSGroupDataType": ["int", ["int", "string"]],
        "indigoSetSGroupXCoord": ["int", ["int", "float"]],
        "indigoSetSGroupYCoord": ["int", ["int", "float"]],
        "indigoCreateSGroup": ["int", ["string", "int", "string"]],
        "indigoSetSGroupClass": ["int", ["int", "string"]],
        "indigoSetSGroupName": ["int", ["int", "string"]],
        "indigoGetSGroupClass": ["string", ["int"]],
        "indigoGetSGroupName": ["string", ["int"]],
        "indigoGetSGroupNumCrossBonds": ["int", ["int"]],
        "indigoAddSGroupAttachmentPoint": ["int", ["int", "int", "int", "string"]],
        "indigoDeleteSGroupAttachmentPoint": ["int", ["int", "int"]],
        "indigoGetSGroupDisplayOption": ["int", ["int"]],
        "indigoSetSGroupDisplayOption": ["int", ["int", "int"]],
        "indigoGetSGroupMultiplier": ["int", ["int"]],
        "indigoSetSGroupMultiplier": ["int", ["int", "int"]],
        "indigoSetSGroupBrackets": ["int", ["int", "int", "float", "float", "float", "float", "float", "float", "float", "float"]],
        "indigoFindSGroups": ["int", ["int", "string", "string"]],
        "indigoGetSGroupType": ["int", ["int"]],
        "indigoGetSGroupIndex": ["int", ["int"]],
        "indigoTransformSCSRtoCTAB": ["int", ["int"]],
        "indigoTransformCTABtoSCSR": ["int", ["int", "int"]],
        "indigoResetCharge": ["int", ["int"]],
        "indigoResetExplicitValence": ["int", ["int"]],
        "indigoResetRadical": ["int", ["int"]],
        "indigoResetIsotope": ["int", ["int"]],
        "indigoSetAttachmentPoint": ["int", ["int", "int"]],
        "indigoClearAttachmentPoints": ["int", ["int"]],
        "indigoRemoveConstraints": ["int", ["int", "string"]],
        "indigoAddConstraint": ["int", ["int", "string", "string"]],
        "indigoAddConstraintNot": ["int", ["int", "string", "string"]],
        "indigoAddConstraintOr": ["int", ["int", "string", "string"]],
        "indigoResetStereo": ["int", ["int"]],
        "indigoInvertStereo": ["int", ["int"]],
        "indigoCountAtoms": ["int", ["int"]],
        "indigoCountBonds": ["int", ["int"]],
        "indigoCountPseudoatoms": ["int", ["int"]],
        "indigoCountRSites": ["int", ["int"]],
        "indigoIterateBonds": ["int", ["int"]],
        "indigoBondOrder": ["int", ["int"]],
        "indigoBondStereo": ["int", ["int"]],
        "indigoTopology": ["int", ["int"]],
        "indigoIterateNeighbors": ["int", ["int"]],
        "indigoBond": ["int", ["int"]],
        "indigoGetAtom": ["int", ["int", "int"]],
        "indigoGetBond": ["int", ["int", "int"]],
        "indigoSource": ["int", ["int"]],
        "indigoDestination": ["int", ["int"]],
        "indigoClearCisTrans": ["int", ["int"]],
        "indigoClearStereocenters": ["int", ["int"]],
        "indigoCountStereocenters": ["int", ["int"]],
        "indigoClearAlleneCenters": ["int", ["int"]],
        "indigoCountAlleneCenters": ["int", ["int"]],
        "indigoResetSymmetricCisTrans": ["int", ["int"]],
        "indigoResetSymmetricStereocenters": ["int", ["int"]],
        "indigoMarkEitherCisTrans": ["int", ["int"]],
        "indigoMarkStereobonds": ["int", ["int"]],
        "indigoAddAtom": ["int", ["int", "string"]],
        "indigoResetAtom": ["int", ["int", "string"]],
        "indigoAddRSite": ["int", ["int", "string"]],
        "indigoSetRSite": ["int", ["int", "string"]],
        "indigoSetCharge": ["int", ["int", "int"]],
        "indigoSetIsotope": ["int", ["int", "int"]],
        "indigoSetImplicitHCount": ["int", ["int", "int"]],
        "indigoAddBond": ["int", ["int", "int", "int"]],
        "indigoSetBondOrder": ["int", ["int", "int"]],
        "indigoMerge": ["int", ["int", "int"]],
        "indigoHighlight": ["int", ["int"]],
        "indigoUnhighlight": ["int", ["int"]],
        "indigoIsHighlighted": ["int", ["int"]],
        "indigoCountComponents": ["int", ["int"]],
        "indigoComponentIndex": ["int", ["int"]],
        "indigoIterateComponents": ["int", ["int"]],
        "indigoComponent": ["int", ["int", "int"]],
        "indigoCountSSSR": ["int", ["int"]],
        "indigoIterateSSSR": ["int", ["int"]],
        "indigoIterateSubtrees": ["int", ["int", "int", "int"]],
        "indigoIterateRings": ["int", ["int", "int", "int"]],
        "indigoIterateEdgeSubmolecules": ["int", ["int", "int", "int"]],
        "indigoCountHeavyAtoms": ["int", ["int"]],
        "indigoGrossFormula": ["int", ["int"]],
        "indigoMolecularWeight": ["float", ["int"]],
        "indigoMostAbundantMass": ["float", ["int"]],
        "indigoMonoisotopicMass": ["float", ["int"]],
        "indigoCanonicalSmiles": ["string", ["int"]],
        "indigoLayeredCode": ["string", ["int"]],
        "indigoSymmetryClasses": [int_ptr, ["int", int_ptr]],
        "indigoHasCoord": ["int", ["int"]],
        "indigoHasZCoord": ["int", ["int"]],
        "indigoIsChiral": ["int", ["int"]],
        "indigoCreateSubmolecule": ["int", ["int", "int", int_ptr]],
        "indigoCreateEdgeSubmolecule": ["int", ["int", "int", int_ptr, "int", int_ptr]],
        "indigoGetSubmolecule": ["int", ["int", "int", int_ptr]],
        "indigoRemoveAtoms": ["int", ["int", "int", int_ptr]],
        "indigoRemoveBonds": ["int", ["int", "int", int_ptr]],
        "indigoAlignAtoms": ["float", ["int", "int", int_ptr, float_ptr]],
        "indigoAromatize": ["int", ["int"]],
        "indigoDearomatize": ["int", ["int"]],
        "indigoFoldHydrogens": ["int", ["int"]],
        "indigoUnfoldHydrogens": ["int", ["int"]],
        "indigoLayout": ["int", ["int"]],
        "indigoSmiles": ["string", ["int"]], 
        "indigoName": ["string", ["int"]], 
        "indigoSetName": ["int", ["int", "string"]],
        "indigoSerialize": ["int", ["int", byte_ptr, int_ptr]],
        "indigoHasProperty": ["int", ["int", "string"]],
        "indigoGetProperty": ["int", ["int", "string"]],
        "indigoSetProperty": ["int", ["int", "string", "string"]],
        "indigoRemoveProperty": ["int", ["int", "string"]],
        "indigoIterateProperties": ["int", ["int"]],
        "indigoClearProperties": ["int", ["int"]],
        "indigoCheckBadValence": ["string", ["int"]], 
        "indigoCheckAmbiguousH": ["string", ["int"]],         
        "indigoFingerprint": ["int", ["int", "string"]],
        "indigoCountBits": ["int", ["int"]],
        "indigoRawData": ["string", ["int"]], 
        "indigoTell": ["int", ["int"]],
        "indigoSdfAppend": ["int", ["int", "int"]],
        "indigoSmilesAppend": ["int", ["int", "int"]],
        "indigoRdfHeader": ["int", ["int"]],
        "indigoRdfAppend": ["int", ["int", "int"]],
        "indigoCmlHeader": ["int", ["int"]],
        "indigoCmlAppend": ["int", ["int", "int"]],
        "indigoCmlFooter": ["int", ["int"]],
        "indigoAppend": ["int", ["int", "int"]],
        "indigoArrayAdd": ["int", ["int", "int"]],
        "indigoAt": ["int", ["int", "int"]],
        "indigoCount": ["int", ["int"]],
        "indigoClear": ["int", ["int"]],
        "indigoIterateArray": ["int", ["int"]],
        "indigoIgnoreAtom": ["int", ["int", "int"]],
        "indigoUnignoreAtom": ["int", ["int", "int"]],
        "indigoUnignoreAllAtoms": ["int", ["int"]],
        "indigoMatch": ["int", ["int", "int"]],
        "indigoCountMatches": ["int", ["int", "int"]],
        "indigoCountMatchesWithLimit": ["int", ["int", "int", "int"]],
        "indigoIterateMatches": ["int", ["int", "int"]],
        "indigoHighlightedTarget": ["int", ["int"]],
        "indigoMapAtom": ["int", ["int", "int"]],
        "indigoMapBond": ["int", ["int", "int"]],
        "indigoMapMolecule": ["int", ["int", "int"]],
        "indigoAllScaffolds": ["int", ["int"]],
        "indigoDecomposedMoleculeScaffold": ["int", ["int"]],
        "indigoIterateDecomposedMolecules": ["int", ["int"]],
        "indigoDecomposedMoleculeHighlighted": ["int", ["int"]],
        "indigoDecomposedMoleculeWithRGroups": ["int", ["int"]],
        "indigoDecomposeMolecule": ["int", ["int", "int"]],
        "indigoIterateDecompositions": ["int", ["int"]],
        "indigoAddDecomposition": ["int", ["int", "int"]],
        "indigoToString": ["string", ["int"]],
        "indigoToBuffer": ["int", ["int", byte_ptr, int_ptr]],
        "indigoStereocenterPyramid": [int_ptr, ["int"]],
        "indigoExpandAbbreviations": ["int", ["int"]],
        "indigoDbgInternalType": ["string", ["int"]],
        "indigoOneBitsList": ["string", ["int"]],
        "indigoLoadMoleculeFromString": ["int", ["string"]],
        "indigoLoadMoleculeFromFile": ["int", ["string"]],
        "indigoLoadQueryMoleculeFromString": ["int", ["string"]],
        "indigoLoadQueryMoleculeFromFile": ["int", ["string"]],
        "indigoLoadSmartsFromString": ["int", ["string"]],
        "indigoLoadSmartsFromFile": ["int", ["string"]],
        "indigoLoadReactionFromString": ["int", ["string"]],
        "indigoLoadReactionFromFile": ["int", ["string"]],
        "indigoLoadQueryReactionFromString": ["int", ["string"]],
        "indigoLoadQueryReactionFromFile": ["int", ["string"]],
        "indigoLoadReactionSmartsFromString": ["int", ["string"]],
        "indigoLoadReactionSmartsFromFile": ["int", ["string"]],
        "indigoCreateReaction": ["int", []],
        "indigoCreateQueryReaction": ["int", []], 
        "indigoExactMatch": ["int", ["int", "int", "string"]],
        "indigoSetTautomerRule": ["int", ["int", "string", "string"]],
        "indigoRemoveTautomerRule": ["int", ["int"]], 
        "indigoClearTautomerRules": ["int", []], 
        "indigoUnserialize": ["int", [byte_ptr, "int"]],
        "indigoCommonBits": ["int", ["int", "int"]], 
        "indigoSimilarity": ["float", ["int", "int", "string"]], 
        "indigoIterateSDFile": ["int", ["string"]],
        "indigoIterateRDFile": ["int", ["string"]],
        "indigoIterateSmilesFile": ["int", ["string"]],
        "indigoIterateCMLFile": ["int", ["string"]],
        "indigoIterateCDXFile": ["int", ["string"]], 
        "indigoCreateFileSaver": ["int", ["string", "string"]],
        "indigoCreateSaver": ["int", ["int", "string"]],
        "indigoCreateArray": ["int", []], 
        "indigoSubstructureMatcher": ["int", ["int", "string"]], 
        "indigoExtractCommonScaffold": ["int", ["int", "string"]], 
        "indigoDecomposeMolecules": ["int", ["int", "int"]], 
        "indigoCreateDecomposer": ["int", ["int"]], 
        "indigoReactionProductEnumerate": ["int", ["int", "int"]], 
        "indigoTransform": ["int", ["int", "int"]],
        "indigoLoadBuffer": ["int", [byte_ptr, "int"]],
        "indigoLoadString": ["int", ["string"]],
        "indigoIterateSDF": ["int", ["int"]], 
        "indigoIterateSmiles": ["int", ["int"]],
        "indigoIterateCML": ["int", ["int"]],
        "indigoIterateCDX": ["int", ["int"]],
        "indigoIterateRDF": ["int", ["int"]], 
        "indigoWriteFile": ["int", ["string"]]
/*        "indigoIterateTautomers": ["int", ["int", "string"]] */

    });
    
    this._sid = this._lib.indigoAllocSessionId();
}


var IVars = {
    ABS: 1, OR: 2, AND: 3,  EITHER: 4, UP: 5, 
    DOWN: 6,  CIS: 7,  TRANS: 8, CHAIN:9, RING: 10,
    ALLENE: 11,  SINGLET:101, DOUBLET: 102, TRIPLET:103,
    RC_NOT_CENTER:-1, RC_UNMARKED: 0, RC_CENTER: 1, RC_UNCHANGED: 2, 
    RC_MADE_OR_BROKEN: 4, RC_ORDER_CHANGED : 8 };

Indigo.prototype.version = function () {
        return "Node (" + process.version + "); Indigo (" + this._lib.indigoVersion() + ");";
    }
    

Indigo.prototype._setSessionId = function () { this._lib.indigoSetSessionId(this._sid) };
Indigo.prototype.release = function () {
        if (this._lib)
            this._lib.indigoReleaseSessionId(this._sid);
    }

Indigo.prototype.writeBuffer = function () {
        this._setSessionId();
        id = this._checkResult(this._lib.indigoWriteBuffer());
        return IndigoObject(this, id);
    }
    
Indigo.prototype.writeFile = function (filename) {
        this._setSessionId();
        id = this._checkResult(this._lib.indigoWriteFile(filename));
        return IndigoObject(this, id);
    }
    
Indigo.prototype.unserialize = function (arr) {
        this._setSessionId();
        values = new ByteArray(arr.length);
        for (i = 0; i < arr.length; i++)
            values[i] = arr[i];
        res = Indigo._lib.indigoUnserialize(values, arr.length);
        return IndigoObject(this, this._checkResult(res));
    }


Indigo.prototype._checkResult = function (result) {
    if (result < 0) {
        var msg = this._lib.indigoGetLastError();
        throw Error('indigo:res < 0[' + result + ']: ' + msg);
    } return result;
}

Indigo.prototype._checkResultFloat = function (result) {
    if (result < -0.5) {
        var msg = this._lib.indigoGetLastError();
        throw Error('indigo:res < -0.5[' + result + ']: ' + msg);
    } return result;
}

Indigo.prototype._checkResultPtr = function (result) {
    if (result == null) {
        var msg = this._lib.indigoGetLastError();
        throw Error('indigo:res_ptr == 0[' + result + ']: ' + msg);
    } return result;
}

Indigo.prototype._checkResultString = function (result) {
    console.log(result); return result;
}
        
Indigo.prototype.dbgBreakpoint = function () {
        this._setSessionId();
        return this._lib.indigoDbgBreakpoint();
    }
    
Indigo.prototype.countReferences = function () {
        this._setSessionId();
        return this._checkResult(this._lib.indigoCountReferences());
    }
    
Indigo.prototype.createMolecule = function () {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoCreateMolecule()));
    }
    
Indigo.prototype.createQueryMolecule = function () {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoCreateQueryMolecule()));
    }
    
Indigo.prototype.loadMolecule = function (string) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoLoadMoleculeFromString(string)));
    }
    
Indigo.prototype.loadMoleculeFromFile = function (filename) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoLoadMoleculeFromFile(filename)));
    }
    
Indigo.prototype.loadQueryMolecule = function (string) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoLoadQueryMoleculeFromString(string)));
    }
    
Indigo.prototype.loadQueryMoleculeFromFile = function (filename) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoLoadQueryMoleculeFromFile(filename)));
    }
    
Indigo.prototype.loadSmarts = function (string) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoLoadSmartsFromString(string)));
    }
    
Indigo.prototype.loadSmartsFromFile = function (filename) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoLoadSmartsFromFile(filename)));
    }
    
Indigo.prototype.loadReaction = function (string) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoLoadReactionFromString(string)));
    }
    
Indigo.prototype.loadReactionFromFile = function (filename) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoLoadReactionFromFile(filename)));
    }
    
Indigo.prototype.loadQueryReaction = function (string) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoLoadQueryReactionFromString(string)));
    }
    
Indigo.prototype.loadQueryReactionFromFile = function (filename) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoLoadQueryReactionFromFile(filename)));
    }
    
Indigo.prototype.loadReactionSmarts = function (string) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoLoadReactionSmartsFromString(string)));
    }
    
Indigo.prototype.loadReactionSmartsFromFile = function (filename) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoLoadReactionSmartsFromFile(filename)));
    }
       
Indigo.prototype.createReaction = function () {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoCreateReaction()));
    }
    
Indigo.prototype.createQueryReaction = function () {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoCreateQueryReaction()));
    }
    
Indigo.prototype.exactMatch = function (item1, item2, flags) {
        this._setSessionId();
        if (flags === undefined || flags === null) {
            flags = '';
        }
        newobj = this._checkResult(this._lib.indigoExactMatch(item1.id, item2.id, flags));
        if (newobj == null)
            return null;
        else
            return IndigoObject(this, newobj, [item1, item2, this]);
    }
    
Indigo.prototype.setTautomerRule = function (id, beg, end) {
        this._setSessionId();
        return this._checkResult(this._lib.indigoSetTautomerRule(id, beg, end));
    }
    
Indigo.prototype.removeTautomerRule = function (id) {
        this._setSessionId();
        return this._checkResult(this._lib.indigoRemoveTautomerRule(id));
    }
    
Indigo.prototype.clearTautomerRules = function () {
        this._setSessionId();
        return this._checkResult(this._lib.indigoClearTautomerRules());
    }
    
Indigo.prototype.commonBits = function (fingerprint1, fingerprint2) {
        this._setSessionId();
        return this._checkResult(this._lib.indigoCommonBits(fingerprint1.id, fingerprint2.id));
    }
    
Indigo.prototype.similarity = function (item1, item2, metrics) {
        this._setSessionId();
        if (metrics === undefined || metrics === null) {
            metrics = '';
        }
        return this._checkResultFloat(this._lib.indigoSimilarity(item1.id, item2.id, metrics));
    }
    
Indigo.prototype.iterateSDFile = function (filename) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoIterateSDFile(filename)));
    }
    
Indigo.prototype.iterateRDFile = function (filename) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoIterateRDFile(filename)));
    }
    
Indigo.prototype.iterateSmilesFile = function (filename) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoIterateSmilesFile(filename)));
    }
    
Indigo.prototype.iterateCMLFile = function (filename) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoIterateCMLFile(filename)));
    }
    
Indigo.prototype.iterateCDXFile = function (filename) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoIterateCDXFile(filename)));
    }
    
Indigo.prototype.createFileSaver = function (filename, format) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoCreateFileSaver(filename, format)));
    }
    
Indigo.prototype.createSaver = function (obj, format) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoCreateSaver(obj.id, format)));
    }
    
Indigo.prototype.createArray = function () {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoCreateArray()));
    }
    
Indigo.prototype.substructureMatcher = function (target, mode) {
        this._setSessionId();
        if (mode === undefined || mode === null) {
            mode = '';
        }
        return IndigoObject(this, this._checkResult(this._lib.indigoSubstructureMatcher(target.id, mode)), target);
    }
/*    
    def convertToArray(self, iteratable):
    if isinstance(iteratable, IndigoObject):
    return iteratable
    try:
        some_object_iterator = iter(iteratable)
        res = self.createArray()
        for obj in some_object_iterator:
                 res.arrayAdd(self.convertToArray(obj))
            return res
        except TypeError:
            raise IndigoException("Cannot convert object %s to an array" % (iteratable))
*/
Indigo.prototype.extractCommonScaffold = function (structures, options) {
        this._setSessionId();
        if (options === undefined || options === null) {
            options = '';
        }
        structures = this.convertToArray(structures);
        newobj = this._checkResult(this._lib.indigoExtractCommonScaffold(structures.id, options));
        if (newobj == null)
            return null;
        else
            return IndigoObject(this, newobj, this);
    }
    
Indigo.prototype.decomposeMolecules = function (scaffold, structures) {
        this._setSessionId();
        structures = this.convertToArray(structures);
        return IndigoObject(this, this._checkResult(this._lib.indigoDecomposeMolecules(scaffold.id, structures.id)), scaffold);
    }
    
Indigo.prototype.createDecomposer = function (scaffold) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoCreateDecomposer(scaffold.id)), scaffold);
    }
    
Indigo.prototype.reactionProductEnumerate = function (replacedaction, monomers) {
        this._setSessionId();
        structures = this.convertToArray(monomers);
        return IndigoObject(this, this._checkResult(this._lib.indigoReactionProductEnumerate(replacedaction.id, monomers.id)), replacedaction);
    }
    
Indigo.prototype.transform = function (reaction, monomers) {
        this._setSessionId();
        newobj = this._checkResult(this._lib.indigoTransform(reaction.id, monomers.id));
        if (newobj == null)
            return null;
        else
            return IndigoObject(this, newobj, this);
    }
    
Indigo.prototype.loadBuffer = function (buf) {
        this._setSessionId();
        arr = buf.split('');
        values = new ByteArray(arr.length);
        for (i = 0; i < arr.length; i++)
            values[i] = arr[i];
        res = Indigo._lib.indigoLoadBuffer(values, arr.length);
        return IndigoObject(this, this._checkResult(res));
    }
    
Indigo.prototype.loadString = function (string) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoLoadString(string)));
    }
    
Indigo.prototype.iterateSDF = function (reader) {
        this._setSessionId();
        result = this._checkResult(this._lib.indigoIterateSDF(reader.id));
        if (result == null)
            return null;
        else
            return IndigoObject(this, result, reader);
    }
    
Indigo.prototype.iterateSmiles = function (reader) {
        this._setSessionId();
        result = this._checkResult(this._lib.indigoIterateSmiles(reader.id));
        if (result == null)
            return null;
        else
            return IndigoObject(this, result, reader);
    }
    
Indigo.prototype.iterateCML = function (reader) {
        this._setSessionId();
        result = this._checkResult(this._lib.indigoIterateCML(reader.id));
        if (result == null)
            return null;
        else
            return IndigoObject(this, result, reader);
    }
    
Indigo.prototype.iterateCDX = function (reader) {
        this._setSessionId();
        result = this._checkResult(this._lib.indigoIterateCDX(reader.id));
        if (result == null)
            return null;
        else
            return IndigoObject(this, result, reader);
    }

Indigo.prototype.iterateRDF = function (reader) {
        this._setSessionId();
        result = this._checkResult(this._lib.indigoIterateRDF(reader.id));
        if (result == null)
            return null;
        else
            return IndigoObject(this, result, reader);
    }
    
Indigo.prototype.iterateTautomers = function (molecule, params) {
        this._setSessionId();
        result = this._checkResult(this._lib.indigoIterateTautomers(molecule.id, params));
        if (result == null)
            return null;
        else
            return IndigoObject(this, result, molecule);
    }
    
Indigo.prototype.next = function () {
        this._setSessionId();
        newobj = this._checkResult(this._lib.indigoNext(this.id))
        if (newobj !== 0) {
            this.id = newobj;
            return { value: IndigoObject(this, newobj), done: false }
        } else { return { done: true }; }
    }


function IndigoStat() {
    if (!(this instanceof IndigoStat)) {
        return new IndigoStat();
    }
    
    qword = "ulonglong";
    if (process.platform == "win32") {
        qword = "uint64";
    }
    
    int_ptr = ref.refType('int');
    byte_ptr = ref.refType('byte');
    float_ptr = ref.refType('float');
    
    ABS = 1;
    OR = 2;
    AND = 3;
    EITHER = 4;
    UP = 5;
    DOWN = 6;
    CIS = 7;
    TRANS = 8;
    CHAIN = 9;
    RING = 10;
    ALLENE = 11;
    
    SINGLET = 101;
    DOUBLET = 102;
    TRIPLET = 103;
    RC_NOT_CENTER = -1;
    RC_UNMARKED = 0;
    RC_CENTER = 1;
    RC_UNCHANGED = 2;
    RC_MADE_OR_BROKEN = 4;
    RC_ORDER_CHANGED = 8;
    
    
    var libpath = './indigo-libs/shared/' + process.platform + '/' + process.arch + '/indigo';
    this._lib = ffi.Library(libpath, {
        "indigoDbgBreakpoint": ["void", []],
        "indigoVersion": ["string", []], 
        "indigoAllocSessionId": [qword, []],
        "indigoSetSessionId": ["void", [qword]],
        "indigoReleaseSessionId": ["void", [qword]],
        "indigoGetLastError": ["string", []],
        "indigoFree": ["int", ["int"]],
        "indigoCountReferences": ["int", []],
        "indigoFreeAllObjects": ["int", []],
        "indigoWriteBuffer": ["int", []],
        "indigoCreateMolecule": ["int", []],
        "indigoCreateQueryMolecule": ["int", []],
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
        "indigoXYZ": [float_ptr, ["int"]],
        "indigoSetXYZ": ["int", ["int", "float", "float", "float"]],
        "indigoCountSuperatoms": ["int", ["int"]],
        "indigoCountDataSGroups": ["int", ["int"]],
        "indigoCountRepeatingUnits": ["int", ["int"]],
        "indigoCountMultipleGroups": ["int", ["int"]],
        "indigoCountGenericSGroups": ["int", ["int"]],
        "indigoIterateDataSGroups": ["int", ["int"]],
        "indigoIterateSuperatoms": ["int", ["int"]],
        "indigoIterateGenericSGroups": ["int", ["int"]],
        "indigoIterateRepeatingUnits": ["int", ["int"]],
        "indigoIterateMultipleGroups": ["int", ["int"]],
        "indigoGetSuperatom": ["int", ["int", "int"]],
        "indigoGetDataSGroup": ["int", ["int", "int"]],
        "indigoGetGenericSGroup": ["int", ["int", "int"]],
        "indigoGetMultipleGroup": ["int", ["int", "int"]],
        "indigoGetRepeatingUnit": ["int", ["int", "int"]],
        "indigoDescription": ["string", ["int"]],
        "indigoData": ["string", ["int"]],
        "indigoAddDataSGroup": ["int", ["int", "int", int_ptr, "int", int_ptr, "string", "string"]],
        "indigoAddSuperatom": ["int", ["int", "int", int_ptr, "string"]],
        "indigoSetDataSGroupXY": ["int", ["int", "float", "float", "string"]],
        "indigoSetSGroupData": ["int", ["int", "string"]],
        "indigoSetSGroupCoords": ["int", ["int", "float", "float"]],
        "indigoSetSGroupDescription": ["int", ["int", "string"]],
        "indigoSetSGroupFieldName": ["int", ["int", "string"]],
        "indigoSetSGroupQueryCode": ["int", ["int", "string"]],
        "indigoSetSGroupQueryOper": ["int", ["int", "string"]],
        "indigoSetSGroupDisplay": ["int", ["int", "string"]],
        "indigoSetSGroupLocation": ["int", ["int", "string"]],
        "indigoSetSGroupTag": ["int", ["int", "string"]],
        "indigoSetSGroupTagAlign": ["int", ["int", "string"]],
        "indigoSetSGroupDataType": ["int", ["int", "string"]],
        "indigoSetSGroupXCoord": ["int", ["int", "float"]],
        "indigoSetSGroupYCoord": ["int", ["int", "float"]],
        "indigoCreateSGroup": ["int", ["string", "int", "string"]],
        "indigoSetSGroupClass": ["int", ["int", "string"]],
        "indigoSetSGroupName": ["int", ["int", "string"]],
        "indigoGetSGroupClass": ["string", ["int"]],
        "indigoGetSGroupName": ["string", ["int"]],
        "indigoGetSGroupNumCrossBonds": ["int", ["int"]],
        "indigoAddSGroupAttachmentPoint": ["int", ["int", "int", "int", "string"]],
        "indigoDeleteSGroupAttachmentPoint": ["int", ["int", "int"]],
        "indigoGetSGroupDisplayOption": ["int", ["int"]],
        "indigoSetSGroupDisplayOption": ["int", ["int", "int"]],
        "indigoGetSGroupMultiplier": ["int", ["int"]],
        "indigoSetSGroupMultiplier": ["int", ["int", "int"]],
        "indigoSetSGroupBrackets": ["int", ["int", "int", "float", "float", "float", "float", "float", "float", "float", "float"]],
        "indigoFindSGroups": ["int", ["int", "string", "string"]],
        "indigoGetSGroupType": ["int", ["int"]],
        "indigoGetSGroupIndex": ["int", ["int"]],
        "indigoTransformSCSRtoCTAB": ["int", ["int"]],
        "indigoTransformCTABtoSCSR": ["int", ["int", "int"]],
        "indigoResetCharge": ["int", ["int"]],
        "indigoResetExplicitValence": ["int", ["int"]],
        "indigoResetRadical": ["int", ["int"]],
        "indigoResetIsotope": ["int", ["int"]],
        "indigoSetAttachmentPoint": ["int", ["int", "int"]],
        "indigoClearAttachmentPoints": ["int", ["int"]],
        "indigoRemoveConstraints": ["int", ["int", "string"]],
        "indigoAddConstraint": ["int", ["int", "string", "string"]],
        "indigoAddConstraintNot": ["int", ["int", "string", "string"]],
        "indigoAddConstraintOr": ["int", ["int", "string", "string"]],
        "indigoResetStereo": ["int", ["int"]],
        "indigoInvertStereo": ["int", ["int"]],
        "indigoCountAtoms": ["int", ["int"]],
        "indigoCountBonds": ["int", ["int"]],
        "indigoCountPseudoatoms": ["int", ["int"]],
        "indigoCountRSites": ["int", ["int"]],
        "indigoIterateBonds": ["int", ["int"]],
        "indigoBondOrder": ["int", ["int"]],
        "indigoBondStereo": ["int", ["int"]],
        "indigoTopology": ["int", ["int"]],
        "indigoIterateNeighbors": ["int", ["int"]],
        "indigoBond": ["int", ["int"]],
        "indigoGetAtom": ["int", ["int", "int"]],
        "indigoGetBond": ["int", ["int", "int"]],
        "indigoSource": ["int", ["int"]],
        "indigoDestination": ["int", ["int"]],
        "indigoClearCisTrans": ["int", ["int"]],
        "indigoClearStereocenters": ["int", ["int"]],
        "indigoCountStereocenters": ["int", ["int"]],
        "indigoClearAlleneCenters": ["int", ["int"]],
        "indigoCountAlleneCenters": ["int", ["int"]],
        "indigoResetSymmetricCisTrans": ["int", ["int"]],
        "indigoResetSymmetricStereocenters": ["int", ["int"]],
        "indigoMarkEitherCisTrans": ["int", ["int"]],
        "indigoMarkStereobonds": ["int", ["int"]],
        "indigoAddAtom": ["int", ["int", "string"]],
        "indigoResetAtom": ["int", ["int", "string"]],
        "indigoAddRSite": ["int", ["int", "string"]],
        "indigoSetRSite": ["int", ["int", "string"]],
        "indigoSetCharge": ["int", ["int", "int"]],
        "indigoSetIsotope": ["int", ["int", "int"]],
        "indigoSetImplicitHCount": ["int", ["int", "int"]],
        "indigoAddBond": ["int", ["int", "int", "int"]],
        "indigoSetBondOrder": ["int", ["int", "int"]],
        "indigoMerge": ["int", ["int", "int"]],
        "indigoHighlight": ["int", ["int"]],
        "indigoUnhighlight": ["int", ["int"]],
        "indigoIsHighlighted": ["int", ["int"]],
        "indigoCountComponents": ["int", ["int"]],
        "indigoComponentIndex": ["int", ["int"]],
        "indigoIterateComponents": ["int", ["int"]],
        "indigoComponent": ["int", ["int", "int"]],
        "indigoCountSSSR": ["int", ["int"]],
        "indigoIterateSSSR": ["int", ["int"]],
        "indigoIterateSubtrees": ["int", ["int", "int", "int"]],
        "indigoIterateRings": ["int", ["int", "int", "int"]],
        "indigoIterateEdgeSubmolecules": ["int", ["int", "int", "int"]],
        "indigoCountHeavyAtoms": ["int", ["int"]],
        "indigoGrossFormula": ["int", ["int"]],
        "indigoMolecularWeight": ["float", ["int"]],
        "indigoMostAbundantMass": ["float", ["int"]],
        "indigoMonoisotopicMass": ["float", ["int"]],
        "indigoCanonicalSmiles": ["string", ["int"]],
        "indigoLayeredCode": ["string", ["int"]],
        "indigoSymmetryClasses": [int_ptr, ["int", int_ptr]],
        "indigoHasCoord": ["int", ["int"]],
        "indigoHasZCoord": ["int", ["int"]],
        "indigoIsChiral": ["int", ["int"]],
        "indigoCreateSubmolecule": ["int", ["int", "int", int_ptr]],
        "indigoCreateEdgeSubmolecule": ["int", ["int", "int", int_ptr, "int", int_ptr]],
        "indigoGetSubmolecule": ["int", ["int", "int", int_ptr]],
        "indigoRemoveAtoms": ["int", ["int", "int", int_ptr]],
        "indigoRemoveBonds": ["int", ["int", "int", int_ptr]],
        "indigoAlignAtoms": ["float", ["int", "int", int_ptr, float_ptr]],
        "indigoAromatize": ["int", ["int"]],
        "indigoDearomatize": ["int", ["int"]],
        "indigoFoldHydrogens": ["int", ["int"]],
        "indigoUnfoldHydrogens": ["int", ["int"]],
        "indigoLayout": ["int", ["int"]],
        "indigoSmiles": ["string", ["int"]], 
        "indigoName": ["string", ["int"]], 
        "indigoSetName": ["int", ["int", "string"]],
        "indigoSerialize": ["int", ["int", byte_ptr, int_ptr]],
        "indigoHasProperty": ["int", ["int", "string"]],
        "indigoGetProperty": ["int", ["int", "string"]],
        "indigoSetProperty": ["int", ["int", "string", "string"]],
        "indigoRemoveProperty": ["int", ["int", "string"]],
        "indigoIterateProperties": ["int", ["int"]],
        "indigoClearProperties": ["int", ["int"]],
        "indigoCheckBadValence": ["string", ["int"]], 
        "indigoCheckAmbiguousH": ["string", ["int"]],         
        "indigoFingerprint": ["int", ["int", "string"]],
        "indigoCountBits": ["int", ["int"]],
        "indigoRawData": ["string", ["int"]], 
        "indigoTell": ["int", ["int"]],
        "indigoSdfAppend": ["int", ["int", "int"]],
        "indigoSmilesAppend": ["int", ["int", "int"]],
        "indigoRdfHeader": ["int", ["int"]],
        "indigoRdfAppend": ["int", ["int", "int"]],
        "indigoCmlHeader": ["int", ["int"]],
        "indigoCmlAppend": ["int", ["int", "int"]],
        "indigoCmlFooter": ["int", ["int"]],
        "indigoAppend": ["int", ["int", "int"]],
        "indigoArrayAdd": ["int", ["int", "int"]],
        "indigoAt": ["int", ["int", "int"]],
        "indigoCount": ["int", ["int"]],
        "indigoClear": ["int", ["int"]],
        "indigoIterateArray": ["int", ["int"]],
        "indigoIgnoreAtom": ["int", ["int", "int"]],
        "indigoUnignoreAtom": ["int", ["int", "int"]],
        "indigoUnignoreAllAtoms": ["int", ["int"]],
        "indigoMatch": ["int", ["int", "int"]],
        "indigoCountMatches": ["int", ["int", "int"]],
        "indigoCountMatchesWithLimit": ["int", ["int", "int", "int"]],
        "indigoIterateMatches": ["int", ["int", "int"]],
        "indigoHighlightedTarget": ["int", ["int"]],
        "indigoMapAtom": ["int", ["int", "int"]],
        "indigoMapBond": ["int", ["int", "int"]],
        "indigoMapMolecule": ["int", ["int", "int"]],
        "indigoAllScaffolds": ["int", ["int"]],
        "indigoDecomposedMoleculeScaffold": ["int", ["int"]],
        "indigoIterateDecomposedMolecules": ["int", ["int"]],
        "indigoDecomposedMoleculeHighlighted": ["int", ["int"]],
        "indigoDecomposedMoleculeWithRGroups": ["int", ["int"]],
        "indigoDecomposeMolecule": ["int", ["int", "int"]],
        "indigoIterateDecompositions": ["int", ["int"]],
        "indigoAddDecomposition": ["int", ["int", "int"]],
        "indigoToString": ["string", ["int"]],
        "indigoToBuffer": ["int", ["int", byte_ptr, int_ptr]],
        "indigoStereocenterPyramid": [int_ptr, ["int"]],
        "indigoExpandAbbreviations": ["int", ["int"]],
        "indigoDbgInternalType": ["string", ["int"]],
        "indigoOneBitsList": ["string", ["int"]],
        "indigoLoadMoleculeFromString": ["int", ["string"]],
        "indigoLoadMoleculeFromFile": ["int", ["string"]],
        "indigoLoadQueryMoleculeFromString": ["int", ["string"]],
        "indigoLoadQueryMoleculeFromFile": ["int", ["string"]],
        "indigoLoadSmartsFromString": ["int", ["string"]],
        "indigoLoadSmartsFromFile": ["int", ["string"]],
        "indigoLoadReactionFromString": ["int", ["string"]],
        "indigoLoadReactionFromFile": ["int", ["string"]],
        "indigoLoadQueryReactionFromString": ["int", ["string"]],
        "indigoLoadQueryReactionFromFile": ["int", ["string"]],
        "indigoLoadReactionSmartsFromString": ["int", ["string"]],
        "indigoLoadReactionSmartsFromFile": ["int", ["string"]],
        "indigoCreateReaction": ["int", []],
        "indigoCreateQueryReaction": ["int", []], 
        "indigoExactMatch": ["int", ["int", "int", "string"]],
        "indigoSetTautomerRule": ["int", ["int", "string", "string"]],
        "indigoRemoveTautomerRule": ["int", ["int"]], 
        "indigoClearTautomerRules": ["int", []], 
        "indigoUnserialize": ["int", [byte_ptr, "int"]],
        "indigoCommonBits": ["int", ["int", "int"]], 
        "indigoSimilarity": ["float", ["int", "int", "string"]], 
        "indigoIterateSDFile": ["int", ["string"]],
        "indigoIterateRDFile": ["int", ["string"]],
        "indigoIterateSmilesFile": ["int", ["string"]],
        "indigoIterateCMLFile": ["int", ["string"]],
        "indigoIterateCDXFile": ["int", ["string"]], 
        "indigoCreateFileSaver": ["int", ["string", "string"]],
        "indigoCreateSaver": ["int", ["int", "string"]],
        "indigoCreateArray": ["int", []], 
        "indigoSubstructureMatcher": ["int", ["int", "string"]], 
        "indigoExtractCommonScaffold": ["int", ["int", "string"]], 
        "indigoDecomposeMolecules": ["int", ["int", "int"]], 
        "indigoCreateDecomposer": ["int", ["int"]], 
        "indigoReactionProductEnumerate": ["int", ["int", "int"]], 
        "indigoTransform": ["int", ["int", "int"]],
        "indigoLoadBuffer": ["int", [byte_ptr, "int"]],
        "indigoLoadString": ["int", ["string"]],
        "indigoIterateSDF": ["int", ["int"]], 
        "indigoIterateSmiles": ["int", ["int"]],
        "indigoIterateCML": ["int", ["int"]],
        "indigoIterateCDX": ["int", ["int"]],
        "indigoIterateRDF": ["int", ["int"]], 
        "indigoWriteFile": ["int", ["string"]]

/*        "indigoIterateTautomers": ["int", ["int", "string"]] */

    });
    
    /* function indigo.vesrion() gets node +indigo versions*/
    this.version = function () {
        return "Node (" + process.version + "); Indigo (" + this._lib.indigoVersion() + ");";
    }
    
    
    this._sid = this._lib.indigoAllocSessionId();
    this._setSessionId = function () { this._lib.indigoSetSessionId(this._sid) };
    this.release = function () {
        if (this._lib)
            this._lib.indigoReleaseSessionId(this._sid);
    }
    
    this.writeBuffer = function () {
        this._setSessionId();
        id = this._checkResult(this._lib.indigoWriteBuffer());
        return IndigoObject(this, id);
    }
    
    this.writeFile = function (filename) {
        this._setSessionId();
        id = this._checkResult(this._lib.indigoWriteFile(filename));
        return IndigoObject(this, id);
    }
    
    this.unserialize = function (arr) {
        this._setSessionId();
        values = new ByteArray(arr.length);
        for (i = 0; i < arr.length; i++)
            values[i] = arr[i];
        res = Indigo._lib.indigoUnserialize(values, arr.length);
        return IndigoObject(this, this._checkResult(res));
    }
    
    
    this._checkResult = function (result) { if (result < 0) { throw new Error('indigo:res < 0[' + result + ']') } return result; }
    this._checkResultFloat = function (result) { if (result < -0.5) { throw new Error('indigo:res < -0.5[' + result + ']') } return result; }
    this._checkResultPtr = function (result) { if (result == null) { throw new Error('indigo:res_ptr == 0[' + result + ']') } return result; }
    this._checkResultString = function (result) { console.log(result); return result; }
    
    
    this.dbgBreakpoint = function () {
        this._setSessionId();
        return this._lib.indigoDbgBreakpoint();
    }
    
    this.countReferences = function () {
        this._setSessionId();
        return this._checkResult(this._lib.indigoCountReferences());
    }
    
    this.createMolecule = function () {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoCreateMolecule()));
    }
    
    this.createQueryMolecule = function () {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoCreateQueryMolecule()));
    }
    
    this.loadMolecule = function (string) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoLoadMoleculeFromString(string)));
    }
    
    this.loadMoleculeFromFile = function (filename) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoLoadMoleculeFromFile(filename)));
    }
    
    this.loadQueryMolecule = function (string) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoLoadQueryMoleculeFromString(string)));
    }
    
    this.loadQueryMoleculeFromFile = function (filename) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoLoadQueryMoleculeFromFile(filename)));
    }
    
    this.loadSmarts = function (string) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoLoadSmartsFromString(string)));
    }
    
    this.loadSmartsFromFile = function (filename) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoLoadSmartsFromFile(filename)));
    }
    
    this.loadReaction = function (string) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoLoadReactionFromString(string)));
    }
    
    this.loadReactionFromFile = function (filename) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoLoadReactionFromFile(filename)));
    }
    
    this.loadQueryReaction = function (string) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoLoadQueryReactionFromString(string)));
    }
    
    this.loadQueryReactionFromFile = function (filename) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoLoadQueryReactionFromFile(filename)));
    }
    
    this.loadReactionSmarts = function (string) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoLoadReactionSmartsFromString(string)));
    }
    
    this.loadReactionSmartsFromFile = function (filename) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoLoadReactionSmartsFromFile(filename)));
    }
    
    this.createReaction = function () {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoCreateReaction()));
    }
    
    this.createQueryReaction = function () {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoCreateQueryReaction()));
    }
    
    this.exactMatch = function (item1, item2, flags) {
        this._setSessionId();
        if (flags === undefined || flags === null) {
            flags = '';
        }
        newobj = this._checkResult(this._lib.indigoExactMatch(item1.id, item2.id, flags));
        if (newobj == null)
            return null;
        else
            return IndigoObject(this, newobj, [item1, item2, this]);
    }
    
    this.setTautomerRule = function (id, beg, end) {
        this._setSessionId();
        return this._checkResult(this._lib.indigoSetTautomerRule(id, beg, end));
    }
    
    this.removeTautomerRule = function (id) {
        this._setSessionId();
        return this._checkResult(this._lib.indigoRemoveTautomerRule(id));
    }
    
    this.clearTautomerRules = function () {
        this._setSessionId();
        return this._checkResult(this._lib.indigoClearTautomerRules());
    }
    
    this.commonBits = function (fingerprint1, fingerprint2) {
        this._setSessionId();
        return this._checkResult(this._lib.indigoCommonBits(fingerprint1.id, fingerprint2.id));
    }
    
    this.similarity = function (item1, item2, metrics) {
        this._setSessionId();
        if (metrics === undefined || metrics === null) {
            metrics = '';
        }
        return this._checkResultFloat(this._lib.indigoSimilarity(item1.id, item2.id, metrics));
    }
    
    this.iterateSDFile = function (filename) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoIterateSDFile(filename)));
    }
    
    this.iterateRDFile = function (filename) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoIterateRDFile(filename)));
    }
    
    this.iterateSmilesFile = function (filename) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoIterateSmilesFile(filename)));
    }
    
    this.iterateCMLFile = function (filename) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoIterateCMLFile(filename)));
    }
    
    this.iterateCDXFile = function (filename) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoIterateCDXFile(filename)));
    }
    
    this.createFileSaver = function (filename, format) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoCreateFileSaver(filename, format)));
    }
    
    this.createSaver = function (obj, format) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoCreateSaver(obj.id, format)));
    }
    
    this.createArray = function () {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoCreateArray()));
    }
    
    this.substructureMatcher = function (target, mode) {
        this._setSessionId();
        if (mode === undefined || mode === null) {
            mode = '';
        }
        return IndigoObject(this, this._checkResult(this._lib.indigoSubstructureMatcher(target.id, mode)), target);
    }
    /*    
    def convertToArray(self, iteratable):
    if isinstance(iteratable, IndigoObject):
    return iteratable
    try:
        some_object_iterator = iter(iteratable)
        res = self.createArray()
        for obj in some_object_iterator:
                 res.arrayAdd(self.convertToArray(obj))
            return res
        except TypeError:
            raise IndigoException("Cannot convert object %s to an array" % (iteratable))
*/
    this.extractCommonScaffold = function (structures, options) {
        this._setSessionId();
        if (options === undefined || options === null) {
            options = '';
        }
        structures = this.convertToArray(structures);
        newobj = this._checkResult(this._lib.indigoExtractCommonScaffold(structures.id, options));
        if (newobj == null)
            return null;
        else
            return IndigoObject(this, newobj, this);
    }
    
    this.decomposeMolecules = function (scaffold, structures) {
        this._setSessionId();
        structures = this.convertToArray(structures);
        return IndigoObject(this, this._checkResult(this._lib.indigoDecomposeMolecules(scaffold.id, structures.id)), scaffold);
    }
    
    this.createDecomposer = function (scaffold) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoCreateDecomposer(scaffold.id)), scaffold);
    }
    
    this.reactionProductEnumerate = function (replacedaction, monomers) {
        this._setSessionId();
        structures = this.convertToArray(monomers);
        return IndigoObject(this, this._checkResult(this._lib.indigoReactionProductEnumerate(replacedaction.id, monomers.id)), replacedaction);
    }
    
    this.transform = function (reaction, monomers) {
        this._setSessionId();
        newobj = this._checkResult(this._lib.indigoTransform(reaction.id, monomers.id));
        if (newobj == null)
            return null;
        else
            return IndigoObject(this, newobj, this);
    }
    
    this.loadBuffer = function (buf) {
        this._setSessionId();
        arr = buf.split('');
        values = new ByteArray(arr.length);
        for (i = 0; i < arr.length; i++)
            values[i] = arr[i];
        res = Indigo._lib.indigoLoadBuffer(values, arr.length);
        return IndigoObject(this, this._checkResult(res));
    }
    
    this.loadString = function (string) {
        this._setSessionId();
        return IndigoObject(this, this._checkResult(this._lib.indigoLoadString(string)));
    }
    
    this.iterateSDF = function (reader) {
        this._setSessionId();
        result = this._checkResult(this._lib.indigoIterateSDF(reader.id));
        if (result == null)
            return null;
        else
            return IndigoObject(this, result, reader);
    }
    
    this.iterateSmiles = function (reader) {
        this._setSessionId();
        result = this._checkResult(this._lib.indigoIterateSmiles(reader.id));
        if (result == null)
            return null;
        else
            return IndigoObject(this, result, reader);
    }
    
    this.iterateCML = function (reader) {
        this._setSessionId();
        result = this._checkResult(this._lib.indigoIterateCML(reader.id));
        if (result == null)
            return null;
        else
            return IndigoObject(this, result, reader);
    }
    
    this.iterateCDX = function (reader) {
        this._setSessionId();
        result = this._checkResult(this._lib.indigoIterateCDX(reader.id));
        if (result == null)
            return null;
        else
            return IndigoObject(this, result, reader);
    }
    
    this.iterateRDF = function (reader) {
        this._setSessionId();
        result = this._checkResult(this._lib.indigoIterateRDF(reader.id));
        if (result == null)
            return null;
        else
            return IndigoObject(this, result, reader);
    }
    
    this.iterateTautomers = function (molecule, params) {
        this._setSessionId();
        result = this._checkResult(this._lib.indigoIterateTautomers(molecule.id, params));
        if (result == null)
            return null;
        else
            return IndigoObject(this, result, molecule);
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
exports.indigoStat = IndigoStat;

/* ----------------------------------------- */

/*end of file ->*/
exports.done = true;
console.log('['+__filename + ']' + ": done.");
/*end of file <-*/
