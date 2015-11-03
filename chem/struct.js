

/* start of file ->*/
ls = __filename.lastIndexOf('/');
rs = __filename.lastIndexOf('\\');
__filename = __filename.substring((((ls >= 0)? ls + 1: 0) | ((rs >= 0)? rs + 1: 0)), __filename.length);
console.log('[' + __filename + ']' + ": starting");
exports.done = false;
/* start of file <- */
/* ----------------------------------------- */


var util = require('./utils');
var Map = require('./utils/map');
var Set = require('./utils/set');
var Vec2 = require('./utils/vec2');
var Pool = require('./utils/pool');

var chem = {};
chem.SGroupForest = require('./sgroup.js').SGG;


var Struct = function () {
	this.atoms = new Pool();
	this.bonds = new Pool();
	this.sgroups = new Pool();
	this.halfBonds = new Map();
	this.loops = new Pool();
	this.isChiral = false;
	this.isReaction = false;
	this.rxnArrows = new Pool();
	this.rxnPluses = new Pool();
	this.frags = new Pool();
	this.rgroups = new Map();
	this.name = '';
	this.sGroupForest = new chem.SGroupForest(this);
};

Struct.prototype.hasRxnProps = function () {
	return this.atoms.find(function (aid, atom) {
		return atom.hasRxnProps();
	}, this) >= 0 || this.bonds.find(function (bid, bond) {
		return bond.hasRxnProps();
	}, this) >= 0;
};

Struct.prototype.hasRxnArrow = function () {
	return this.rxnArrows.count() > 0;
};

Struct.prototype.addRxnArrowIfNecessary = function () {
	var implicitReaction = !this.hasRxnArrow() && this.hasRxnProps();
	if (implicitReaction) {
		this.rxnArrows.add(new Struct.RxnArrow());
	}
	return implicitReaction;
};

// returns a list of id's of s-groups, which contain only atoms in the given list
Struct.prototype.getSGroupsInAtomSet = function (atoms/*Array*/) {
	var sgroupCounts = new Hash();

	util.each(atoms, function (aid) {
		var sg = Set.list(this.atoms.get(aid).sgs);

		sg.each(function (sid) {
			var n = sgroupCounts.get(sid);
			if ((typeof (n) === 'undefined')) {
				n = 1;
			} else {
				n++;
			}
			sgroupCounts.set(sid, n);
		}, this);
	}, this);

	var sgroupList = [];
	sgroupCounts.each(function (sg) {
		var sid = parseInt(sg.key, 10);
		var sgroup = this.sgroups.get(sid);
		var sgAtoms = chem.SGroup.getAtoms(this, sgroup);
		if (sg.value == sgAtoms.length) {
			sgroupList.push(sid);
		}
	}, this);
	return sgroupList;
};

Struct.prototype.isBlank = function () {
	return this.atoms.count() === 0 &&
	this.rxnArrows.count() === 0 &&
	this.rxnPluses.count() === 0 && !this.isChiral;
};

Struct.prototype.toLists = function () {
	var aidMap = {};
	var atomList = [];
	this.atoms.each(function (aid, atom) {
		aidMap[aid] = atomList.length;
		atomList.push(atom);
	});

	var bondList = [];
	this.bonds.each(function (bid, bond) {
		var b = new Struct.Bond(bond);
		b.begin = aidMap[bond.begin];
		b.end = aidMap[bond.end];
		bondList.push(b);
	});

	return {
		'atoms': atomList,
		'bonds': bondList
	};
};

Struct.prototype.clone = function (atomSet, bondSet, dropRxnSymbols, aidMap) {
	var cp = new Struct();
	return this.mergeInto(cp, atomSet, bondSet, dropRxnSymbols, false, aidMap);
};

Struct.prototype.getScaffold = function () {
	var atomSet = Set.empty();
	this.atoms.each(function (aid) {
		Set.add(atomSet, aid);
	}, this);
	this.rgroups.each(function (rgid, rg) {
		rg.frags.each(function (fnum, fid) {
			this.atoms.each(function (aid, atom) {
				if (atom.fragment == fid) {
					Set.remove(atomSet, aid);
				}
			}, this);
		}, this);
	}, this);
	return this.clone(atomSet);
};

Struct.prototype.getFragmentIds = function (fid) {
	var atomSet = Set.empty();
	this.atoms.each(function (aid, atom) {
		if (atom.fragment == fid) {
			Set.add(atomSet, aid);
		}
	}, this);
	return atomSet;
};

Struct.prototype.getFragment = function (fid) {
	return this.clone(this.getFragmentIds(fid));
};

Struct.prototype.mergeInto = function (cp, atomSet, bondSet, dropRxnSymbols, keepAllRGroups, aidMap) {
	atomSet = atomSet || Set.keySetInt(this.atoms);
	bondSet = bondSet || Set.keySetInt(this.bonds);
	bondSet = Set.filter(bondSet, function (bid){
		var bond = this.bonds.get(bid);
		return Set.contains(atomSet, bond.begin) && Set.contains(atomSet, bond.end);
	}, this);

	var fidMask = {};
	this.atoms.each(function (aid, atom) {
		if (Set.contains(atomSet, aid))
			fidMask[atom.fragment] = 1;
	});
	var fidMap = {};
	this.frags.each(function (fid, frag) {
		if (fidMask[fid])
			fidMap[fid] = cp.frags.add(frag.clone());
	});

	this.rgroups.each(function (rgid, rgroup) {
		var keepGroup = keepAllRGroups;
		if (!keepGroup) {
			rgroup.frags.each(function (fnum, fid) {
				if (fidMask[fid])
					keepGroup = true;
			});
			if (!keepGroup)
				return;
		}
		var rg = cp.rgroups.get(rgid);
		if (rg) {
			rgroup.frags.each(function (fnum, fid) {
				if (fidMask[fid])
					rg.frags.add(fidMap[fid]);
			});
		} else {
			cp.rgroups.set(rgid, rgroup.clone(fidMap));
		}
	});

	if (typeof aidMap === 'undefined' || aidMap === null)
		aidMap = {};
	this.atoms.each(function (aid, atom) {
		if (Set.contains(atomSet, aid))
			aidMap[aid] = cp.atoms.add(atom.clone(fidMap));
	});

	var bidMap = {};
	this.bonds.each(function (bid, bond) {
		if (Set.contains(bondSet, bid))
			bidMap[bid] = cp.bonds.add(bond.clone(aidMap));
	});

	this.sgroups.each(function (sid, sg) {
		var i;
		for (i = 0; i < sg.atoms.length; ++i)
			if (!Set.contains(atomSet, sg.atoms[i]))
				return;
		sg = chem.SGroup.clone(sg, aidMap, bidMap);
		var id = cp.sgroups.add(sg);
		sg.id = id;
		for (i = 0; i < sg.atoms.length; ++i) {
			Set.add(cp.atoms.get(sg.atoms[i]).sgs, id);
		}
		cp.sGroupForest.insert(sg.id);
	});
	cp.isChiral = this.isChiral;
	if (!dropRxnSymbols) {
		cp.isReaction = this.isReaction;
		this.rxnArrows.each(function (id, item) {
			cp.rxnArrows.add(item.clone());
		});
		this.rxnPluses.each(function (id, item) {
			cp.rxnPluses.add(item.clone());
		});
	}
	return cp;
};

Struct.prototype.findBondId = function (begin, end)
{
	var id = -1;

	this.bonds.find(function (bid, bond)
	{
		if ((bond.begin == begin && bond.end == end) ||
		(bond.begin == end && bond.end == begin))
		{
			id = bid;
			return true;
		}
		return false;
	}, this);

	return id;
};



Struct.radicalElectrons = function (radical)
{
	radical = radical - 0;
	if (radical == Struct.ATOM.RADICAL.NONE)
		return 0;
	else if (radical == Struct.ATOM.RADICAL.DOUPLET)
		return 1;
	else if (radical == Struct.ATOM.RADICAL.SINGLET ||
		radical == Struct.ATOM.RADICAL.TRIPLET)
		return 2;
	throw new Error('Unknown radical value');
};


Struct.ATOM =
{
    RADICAL:
 {
        NONE: 0,
        SINGLET: 1,
        DOUPLET: 2,
        TRIPLET: 3
    }
};

Struct.Atom = function (params) {
	var def = Struct.Atom.attrGetDefault;
	if (!params || !('label' in params))
		throw new Error('label must be specified!');

	this.label = params.label;
	this.fragment = (!(typeof (params.fragment) === 'undefined')) ? params.fragment : -1;
	util.ifDef(this, params, 'isotope', def('isotope'));
	util.ifDef(this, params, 'radical', def('radical'));
	util.ifDef(this, params, 'charge', def('charge'));
	util.ifDef(this, params, 'rglabel', def('rglabel')); // r-group index mask, i-th bit stands for i-th r-site
	util.ifDef(this, params, 'attpnt', def('attpnt')); // attachment point
	util.ifDef(this, params, 'explicitValence', def('explicitValence'));

	this.valence = 0;
	this.implicitH = 0; // implicitH is not an attribute
	if (!(typeof (params.pp) === 'undefined'))
		this.pp = new Vec2(params.pp);
	else
		this.pp = new Vec2();

	// sgs should only be set when an atom is added to an s-group by an appropriate method,
	//   or else a copied atom might think it belongs to a group, but the group be unaware of the atom
	// TODO: make a consistency check on atom/s-group assignments
	this.sgs = {};

	// query
	util.ifDef(this, params, 'ringBondCount', def('ringBondCount'));
	util.ifDef(this, params, 'substitutionCount', def('substitutionCount'));
	util.ifDef(this, params, 'unsaturatedAtom', def('unsaturatedAtom'));
	util.ifDef(this, params, 'hCount', def('hCount'));

	// reaction
	util.ifDef(this, params, 'aam', def('aam'));
	util.ifDef(this, params, 'invRet', def('invRet'));
	util.ifDef(this, params, 'exactChangeFlag', def('exactChangeFlag'));
	util.ifDef(this, params, 'rxnFragmentType', -1); // this isn't really an attribute

	this.atomList = (!(typeof (params.atomList) === 'undefined') && params.atomList != null ) ? new chem.Struct.AtomList(params.atomList) : null;
	this.neighbors = []; // set of half-bonds having this atom as their origin
	this.badConn = false;
};

Struct.Atom.getAttrHash = function (atom) {
	var attrs = new Hash();
	for (var attr in Struct.Atom.attrlist) {
		if (typeof(atom[attr]) != 'undefined') {
			attrs.set(attr, atom[attr]);
		}
	}
	return attrs;
};

Struct.Atom.attrGetDefault = function (attr) {
	if (attr in Struct.Atom.attrlist)
		return Struct.Atom.attrlist[attr];
	throw new Error('Attribute unknown');
};

Struct.Atom.attrlist = {
	'label': 'C',
	'isotope': 0,
	'radical': 0,
	'charge': 0,
	'explicitValence': -1,
	'ringBondCount': 0,
	'substitutionCount': 0,
	'unsaturatedAtom': 0,
	'hCount': 0,
	'atomList': null,
	'invRet': 0,
	'exactChangeFlag': 0,
	'rglabel': null,
	'attpnt': null,
	'aam': 0
};

Struct.Atom.prototype.clone = function (fidMap)
{
	var ret = new Struct.Atom(this);
	if (fidMap && this.fragment in fidMap) {
		ret.fragment = fidMap[this.fragment];
	}
	return ret;
};

Struct.Atom.prototype.isQuery =  function ()
{
	return this.atomList != null || this.label == 'A' || this.attpnt || this.hCount;
};

Struct.Atom.prototype.pureHydrogen =  function ()
{
	return this.label == 'H' && this.isotope == 0;
};

Struct.Atom.prototype.isPlainCarbon =  function ()
{
	return this.label == 'C' && this.isotope == 0 && this.radical == 0 && this.charge == 0
		 && this.explicitValence < 0 && this.ringBondCount == 0 && this.substitutionCount == 0
		 && this.unsaturatedAtom == 0 && this.hCount == 0 && !this.atomList;
};

Struct.Atom.prototype.isPseudo =  function ()
{
	// TODO: handle reaxys generics separately
	return !this.atomList && !this.rglabel && !element.getElementByLabel(this.label);
};

Struct.Atom.prototype.hasRxnProps =  function ()
{
	return !!(this.invRet || this.exactChangeFlag || !util.isNull(this.attpnt) || this.aam);
};

Struct.AtomList = function (params)
{
	if (!params || !('notList' in params) || !('ids' in params))
		throw new Error('\'notList\' and \'ids\' must be specified!');

	this.notList = params.notList; /*boolean*/
	this.ids = params.ids; /*Array of integers*/
};

Struct.AtomList.prototype.labelList = function ()
{
	var labels = [];
	for (var i = 0; i < this.ids.length; ++i)
		labels.push(element.get(this.ids[i]).label);
	return labels;
};

Struct.AtomList.prototype.label = function ()
{
	var label = '[' + this.labelList().join(',') + ']';
	if (this.notList)
		label = '!' + label;
	return label;
};

Struct.AtomList.prototype.equals = function (x)
{
	return this.notList == x.notList && (this.ids || []).sort().toString() == (x.ids || []).sort().toString();
};

Struct.BOND =
{
    TYPE:
 {
        SINGLE: 1,
        DOUBLE: 2,
        TRIPLE: 3,
        AROMATIC: 4,
        SINGLE_OR_DOUBLE: 5,
        SINGLE_OR_AROMATIC: 6,
        DOUBLE_OR_AROMATIC: 7,
        ANY: 8
    },
    
    STEREO:
 {
        NONE: 0,
        UP: 1,
        EITHER: 4,
        DOWN: 6,
        CIS_TRANS: 3
    },
    
    TOPOLOGY:
 {
        EITHER: 0,
        RING: 1,
        CHAIN: 2
    },
    
    REACTING_CENTER:
 {
        NOT_CENTER: -1,
        UNMARKED: 0,
        CENTER: 1,
        UNCHANGED: 2,
        MADE_OR_BROKEN: 4,
        ORDER_CHANGED: 8,
        MADE_OR_BROKEN_AND_CHANGED: 12
    }
};

Struct.Bond = function (params)
{
	if (!params || !('begin' in params) || !('end' in params) || !('type' in params))
		throw new Error('\'begin\', \'end\' and \'type\' properties must be specified!');

	this.begin = params.begin;
	this.end = params.end;
	this.type = params.type;
	util.ifDef(this, params, 'stereo', Struct.BOND.STEREO.NONE);
	util.ifDef(this, params, 'topology', Struct.BOND.TOPOLOGY.EITHER);
	util.ifDef(this, params, 'reactingCenterStatus', 0);
	this.hb1 = null; // half-bonds
	this.hb2 = null;
	this.len = 0;
	this.center = new Vec2();
	this.sb = 0;
	this.sa = 0;
	this.angle = 0;
};

Struct.Bond.attrlist = {
	'type': Struct.BOND.TYPE.SINGLE,
	'stereo': Struct.BOND.STEREO.NONE,
	'topology': Struct.BOND.TOPOLOGY.EITHER,
	'reactingCenterStatus': 0
};

Struct.Bond.getAttrHash = function (bond) {
	var attrs = new Hash();
	for (var attr in Struct.Bond.attrlist) {
		if (typeof(bond[attr]) !== 'undefined') {
			attrs.set(attr, bond[attr]);
		}
	}
	return attrs;
};

Struct.Bond.attrGetDefault = function (attr) {
	if (attr in Struct.Bond.attrlist)
		return Struct.Bond.attrlist[attr];
	throw new Error('Attribute unknown');
}

Struct.Bond.prototype.hasRxnProps =  function ()
{
	return !!this.reactingCenterStatus;
};

Struct.Bond.prototype.getCenter = function (struct) {
	var p1 = struct.atoms.get(this.begin).pp;
	var p2 = struct.atoms.get(this.end).pp;
	return Vec2.lc2(p1, 0.5, p2, 0.5);
}

Struct.Bond.prototype.getDir = function (struct) {
	var p1 = struct.atoms.get(this.begin).pp;
	var p2 = struct.atoms.get(this.end).pp;
	return p2.sub(p1).normalized();
}

Struct.Bond.prototype.clone = function (aidMap)
{
	var cp = new Struct.Bond(this);
	if (aidMap) {
		cp.begin = aidMap[cp.begin];
		cp.end = aidMap[cp.end];
	}
	return cp;
};

Struct.Bond.prototype.findOtherEnd = function (i)
{
	if (i == this.begin)
		return this.end;
	if (i == this.end)
		return this.begin;
	throw new Error('bond end not found');
};

chem.HalfBond = function (/*num*/begin, /*num*/end, /*num*/bid)
{
	if (arguments.length != 3)
		throw new Error('Invalid parameter number!');

	this.begin = begin - 0;
	this.end = end - 0;
	this.bid = bid - 0;

	// rendering properties
	this.dir = new Vec2(); // direction
	this.norm = new Vec2(); // left normal
	this.ang = 0; // angle to (1,0), used for sorting the bonds
	this.p = new Vec2(); // corrected origin position
	this.loop = -1; // left loop id if the half-bond is in a loop, otherwise -1
	this.contra = -1; // the half bond contrary to this one
	this.next = -1; // the half-bond next ot this one in CCW order
	this.leftSin = 0;
	this.leftCos = 0;
	this.leftNeighbor = 0;
	this.rightSin = 0;
	this.rightCos = 0;
	this.rightNeighbor = 0;
};

Struct.prototype.initNeighbors = function ()
{
	this.atoms.each(function (aid, atom){
		atom.neighbors = [];
	});
	this.bonds.each(function (bid, bond){
		var a1 = this.atoms.get(bond.begin);
		var a2 = this.atoms.get(bond.end);
		a1.neighbors.push(bond.hb1);
		a2.neighbors.push(bond.hb2);
	}, this);
};

Struct.prototype.bondInitHalfBonds = function (bid, /*opt*/ bond)
{
	bond = bond || this.bonds.get(bid);
	bond.hb1 = 2 * bid;
	bond.hb2 = 2 * bid + 1;
	this.halfBonds.set(bond.hb1, new chem.HalfBond(bond.begin, bond.end, bid));
	this.halfBonds.set(bond.hb2, new chem.HalfBond(bond.end, bond.begin, bid));
	var hb1 = this.halfBonds.get(bond.hb1);
	var hb2 = this.halfBonds.get(bond.hb2);
	hb1.contra = bond.hb2;
	hb2.contra = bond.hb1;
};

Struct.prototype.halfBondUpdate = function (hbid)
{
	var hb = this.halfBonds.get(hbid);
	var p1 = this.atoms.get(hb.begin).pp;
	var p2 = this.atoms.get(hb.end).pp;
	var d = Vec2.diff(p2, p1).normalized();
	hb.dir = Vec2.dist(p2, p1) > 1e-4 ? d : new Vec2(1, 0);
	hb.norm = hb.dir.turnLeft();
	hb.ang = hb.dir.oxAngle();
	if (hb.loop < 0)
		hb.loop = -1;
};

Struct.prototype.initHalfBonds = function ()
{
	this.halfBonds.clear();
	this.bonds.each(this.bondInitHalfBonds, this);
};

Struct.prototype.setHbNext = function (hbid, next)
{
	this.halfBonds.get(this.halfBonds.get(hbid).contra).next = next;
};

Struct.prototype.halfBondSetAngle = function (hbid, left)
{
	var hb = this.halfBonds.get(hbid);
	var hbl = this.halfBonds.get(left);
	hbl.rightCos = hb.leftCos = Vec2.dot(hbl.dir, hb.dir);
	hbl.rightSin = hb.leftSin = Vec2.cross(hbl.dir, hb.dir);
	hb.leftNeighbor = left;
	hbl.rightNeighbor = hbid;
};

Struct.prototype.atomAddNeighbor = function (hbid)
{
	var hb = this.halfBonds.get(hbid);
	var atom = this.atoms.get(hb.begin);
	var i = 0;
	for (i = 0; i < atom.neighbors.length; ++i)
		if (this.halfBonds.get(atom.neighbors[i]).ang > hb.ang)
			break;
	atom.neighbors.splice(i, 0, hbid);
	var ir = atom.neighbors[(i + 1) % atom.neighbors.length];
	var il = atom.neighbors[(i + atom.neighbors.length - 1)
			 % atom.neighbors.length];
	this.setHbNext(il, hbid);
	this.setHbNext(hbid, ir);
	this.halfBondSetAngle(hbid, il);
	this.halfBondSetAngle(ir, hbid);
};

Struct.prototype.atomSortNeighbors = function (aid) {
	var atom = this.atoms.get(aid);
	atom.neighbors = atom.neighbors.sortBy(function (nei){
		return this.halfBonds.get(nei).ang;
	}, this);

	var i;
	for (i = 0; i < atom.neighbors.length; ++i)
		this.halfBonds.get(this.halfBonds.get(atom.neighbors[i]).contra).next =
			atom.neighbors[(i + 1) % atom.neighbors.length];
	for (i = 0; i < atom.neighbors.length; ++i)
		this.halfBondSetAngle(atom.neighbors[(i + 1) % atom.neighbors.length],
			atom.neighbors[i]);
};

Struct.prototype.sortNeighbors = function (list) {
	var f = function (aid) { this.atomSortNeighbors(aid); };
	if (util.isNullOrUndefined(list))
		this.atoms.each(f, this);
	else
		util.each(list, f, this);
};

Struct.prototype.atomUpdateHalfBonds = function (aid) {
	var nei = this.atoms.get(aid).neighbors;
	for (var i = 0; i < nei.length; ++i) {
		var hbid = nei[i];
		this.halfBondUpdate(hbid);
		this.halfBondUpdate(this.halfBonds.get(hbid).contra);
	}
};

Struct.prototype.updateHalfBonds = function (list) {
	var f = function (aid) { this.atomUpdateHalfBonds(aid); };
	if (util.isNullOrUndefined(list))
		this.atoms.each(f, this);
	else
		util.each(list, f, this);
};

Struct.prototype.sGroupsRecalcCrossBonds = function () {
	this.sgroups.each(function (sgid, sg){
		sg.xBonds = [];
		sg.neiAtoms = [];
	},this);
	this.bonds.each(function (bid, bond){
		var a1 = this.atoms.get(bond.begin);
		var a2 = this.atoms.get(bond.end);
		Set.each(a1.sgs, function (sgid){
			if (!Set.contains(a2.sgs, sgid)) {
				var sg = this.sgroups.get(sgid);
				sg.xBonds.push(bid);
				util.arrayAddIfMissing(sg.neiAtoms, bond.end);
			}
		}, this);
		Set.each(a2.sgs, function (sgid){
			if (!Set.contains(a1.sgs, sgid)) {
				var sg = this.sgroups.get(sgid);
				sg.xBonds.push(bid);
				util.arrayAddIfMissing(sg.neiAtoms, bond.begin);
			}
		}, this);
	},this);
};

Struct.prototype.sGroupDelete = function (sgid)
{
	var sg = this.sgroups.get(sgid);
	for (var i = 0; i < sg.atoms.length; ++i) {
		Set.remove(this.atoms.get(sg.atoms[i]).sgs, sgid);
	}
	this.sGroupForest.remove(sgid);
	this.sgroups.remove(sgid);
};

Struct.itemSetPos = function (item, pp) // TODO: remove
{
	item.pp = pp;
};

Struct.prototype._itemSetPos = function (map, id, pp, scaleFactor)
{
	Struct.itemSetPos(this[map].get(id), pp, scaleFactor);
};

Struct.prototype._atomSetPos = function (id, pp, scaleFactor)
{
	this._itemSetPos('atoms', id, pp, scaleFactor);
};

Struct.prototype._rxnPlusSetPos = function (id, pp, scaleFactor)
{
	this._itemSetPos('rxnPluses', id, pp, scaleFactor);
};

Struct.prototype._rxnArrowSetPos = function (id, pp, scaleFactor)
{
	this._itemSetPos('rxnArrows', id, pp, scaleFactor);
};

Struct.prototype.getCoordBoundingBox = function (atomSet)
{
	var bb = null;
	var extend = function (pp) {
		if (!bb)
			bb = {
				min: pp,
				max: pp
			};
		else {
			bb.min = Vec2.min(bb.min, pp);
			bb.max = Vec2.max(bb.max, pp);
		}
	};

	var global = typeof(atomSet) == 'undefined';

	this.atoms.each(function (aid, atom) {
		if (global || Set.contains(atomSet, aid))
			extend(atom.pp);
	});
	if (global) {
		this.rxnPluses.each(function (id, item) {
			extend(item.pp);
		});
		this.rxnArrows.each(function (id, item) {
			extend(item.pp);
		});
	}
	if (!bb && global)
		bb = {
			min: new Vec2(0, 0),
			max: new Vec2(1, 1)
		};
	return bb;
};

Struct.prototype.getCoordBoundingBoxObj = function ()
{
	var bb = null;
	var extend = function (pp) {
		if (!bb)
			bb = {
				min: new Vec2(pp),
				max: new Vec2(pp)
			};
		else {
			bb.min = Vec2.min(bb.min, pp);
			bb.max = Vec2.max(bb.max, pp);
		}
	};

	this.atoms.each(function (aid, atom) {
		extend(atom.pp);
	});
	return bb;
};

Struct.prototype.getBondLengthData = function ()
{
	var totalLength = 0;
	var cnt = 0;
	this.bonds.each(function (bid, bond){
		totalLength += Vec2.dist(
			this.atoms.get(bond.begin).pp,
			this.atoms.get(bond.end).pp);
		cnt++;
	}, this);
	return {cnt:cnt, totalLength:totalLength};
};

Struct.prototype.getAvgBondLength = function ()
{
	var bld = this.getBondLengthData();
	return bld.cnt > 0 ? bld.totalLength / bld.cnt : -1;
};

Struct.prototype.getAvgClosestAtomDistance = function ()
{
	var totalDist = 0, minDist, dist = 0;
	var keys = this.atoms.keys(), k, j;
	for (k = 0; k < keys.length; ++k) {
		minDist = -1;
		for (j = 0; j < keys.length; ++j) {
			if (j == k)
				continue;
			dist = Vec2.dist(this.atoms.get(keys[j]).pp, this.atoms.get(keys[k]).pp);
			if (minDist < 0 || minDist > dist)
				minDist = dist;
		}
		totalDist += minDist;
	}

	return keys.length > 0 ? totalDist / keys.length : -1;
};

Struct.prototype.checkBondExists = function (begin, end)
{
	var bondExists = false;
	this.bonds.each(function (bid, bond){
		if ((bond.begin == begin && bond.end == end) ||
		(bond.end == begin && bond.begin == end))
			bondExists = true;
	}, this);
	return bondExists;
};

chem.Loop = function (/*Array of num*/hbs, /*Struct*/struct, /*bool*/convex)
{
	this.hbs = hbs; // set of half-bonds involved
	this.dblBonds = 0; // number of double bonds in the loop
	this.aromatic = true;
	this.convex = convex || false;

	hbs.each(function (hb){
		var bond = struct.bonds.get(struct.halfBonds.get(hb).bid);
		if (bond.type != Struct.BOND.TYPE.AROMATIC)
			this.aromatic = false;
		if (bond.type == Struct.BOND.TYPE.DOUBLE)
			this.dblBonds++;
	}, this);
};

Struct.RxnPlus = function (params)
{
	params = params || {};
	this.pp = params.pp ? new Vec2(params.pp) : new Vec2();
};

Struct.RxnPlus.prototype.clone = function ()
{
	return new Struct.RxnPlus(this);
};

Struct.RxnArrow = function (params)
{
	params = params || {};
	this.pp = params.pp ? new Vec2(params.pp) : new Vec2();
};

Struct.RxnArrow.prototype.clone = function ()
{
	return new Struct.RxnArrow(this);
};

Struct.prototype.findConnectedComponent = function (aid) {
	var map = {};
	var list = [aid];
	var ids = Set.empty();
	while (list.length > 0) {
		(function () {
			var aid = list.pop();
			map[aid] = 1;
			Set.add(ids, aid);
			var atom = this.atoms.get(aid);
			for (var i = 0; i < atom.neighbors.length; ++i) {
				var neiId = this.halfBonds.get(atom.neighbors[i]).end;
				if (!Set.contains(ids, neiId))
					list.push(neiId);
			}
		}).apply(this);
	}
	return ids;
};

Struct.prototype.findConnectedComponents = function (discardExistingFragments) {
	// NB: this is a hack
	// TODO: need to maintain half-bond and neighbor structure permanently
	if (!this.halfBonds.count()) {
		this.initHalfBonds();
		this.initNeighbors();
		this.updateHalfBonds(this.atoms.keys());
		this.sortNeighbors(this.atoms.keys());
	}

	var map = {};
	this.atoms.each(function (aid) {
		map[aid] = -1;
	}, this);
	var components = [];
	this.atoms.each(function (aid,atom){
		if ((discardExistingFragments || atom.fragment < 0) && map[aid] < 0) {
			var component = this.findConnectedComponent(aid);
			components.push(component);
			Set.each(component, function (aid){
				map[aid] = 1;
			}, this);
		}
	}, this);
	return components;
};

Struct.prototype.markFragment = function (ids) {
	var fid = this.frags.add(new Struct.Fragment());
	Set.each(ids, function (aid){
		this.atoms.get(aid).fragment = fid;
	}, this);
};

Struct.prototype.markFragmentByAtomId = function (aid) {
	this.markFragment(this.findConnectedComponent(aid));
};

Struct.prototype.markFragments = function () {
	var components = this.findConnectedComponents();
	for (var i = 0; i < components.length; ++i) {
		this.markFragment(components[i]);
	}
};

Struct.Fragment = function () {
};
Struct.Fragment.prototype.clone = function () {
	return Object.clone(this);
};

Struct.Fragment.getAtoms = function (struct, frid) {
	var atoms = [];
	struct.atoms.each(function (aid, atom) {
		if (atom.fragment == frid)
			atoms.push(aid);
	}, this);
	return atoms;
}

Struct.RGroup = function (logic) {
	logic = logic || {};
	this.frags = new Pool();
	this.resth = logic.resth || false;
	this.range = logic.range || '';
	this.ifthen = logic.ifthen || 0;
};

Struct.RGroup.prototype.getAttrs = function () {
	return {
		resth: this.resth,
		range: this.range,
		ifthen: this.ifthen
	};
};

Struct.RGroup.findRGroupByFragment = function (rgroups, frid) {
	var ret;
	rgroups.each(function (rgid, rgroup) {
		if (!(typeof(rgroup.frags.keyOf(frid)) === 'undefined')) ret = rgid;
	});
	return ret;
};
Struct.RGroup.prototype.clone = function (fidMap) {
	var ret = new Struct.RGroup(this);
	this.frags.each(function (fnum, fid) {
		ret.frags.add(fidMap ? fidMap[fid] : fid);
	});
	return ret;
};

Struct.prototype.scale = function (scale)
{
	if (scale != 1) {
		this.atoms.each(function (aid, atom){
			atom.pp = atom.pp.scaled(scale);
		}, this);
		this.rxnPluses.each(function (id, item){
			item.pp = item.pp.scaled(scale);
		}, this);
		this.rxnArrows.each(function (id, item){
			item.pp = item.pp.scaled(scale);
		}, this);
		this.sgroups.each(function (id, item){
			item.pp = item.pp ? item.pp.scaled(scale) : null;
		}, this);
	}
};

Struct.prototype.rescale = function ()
{
	var avg = this.getAvgBondLength();
	if (avg < 0 && !this.isReaction) // TODO [MK] this doesn't work well for reactions as the distances between
		// the atoms in different components are generally larger than those between atoms of a single component
		// (KETCHER-341)
		avg = this.getAvgClosestAtomDistance();
	if (avg < 1e-3)
		avg = 1;
	var scale = 1 / avg;
	this.scale(scale);
};

Struct.prototype.loopHasSelfIntersections = function (hbs)
{
	for (var i = 0; i < hbs.length; ++i) {
		var hbi = this.halfBonds.get(hbs[i]);
		var ai = this.atoms.get(hbi.begin).pp;
		var bi = this.atoms.get(hbi.end).pp;
		var set = Set.fromList([hbi.begin, hbi.end]);
		for (var j = i + 2; j < hbs.length; ++j) {
			var hbj = this.halfBonds.get(hbs[j]);
			if (Set.contains(set, hbj.begin) || Set.contains(set, hbj.end))
				continue; // skip edges sharing an atom
			var aj = this.atoms.get(hbj.begin).pp;
			var bj = this.atoms.get(hbj.end).pp;
			if (Vec2.segmentIntersection(ai, bi, aj, bj)) {
				return true;
			}
		}
	}
	return false;
}

// partition a cycle into simple cycles
// TODO: [MK] rewrite the detection algorithm to only find simple ones right away?
Struct.prototype.partitionLoop = function (loop) {
	var subloops = [];
	var continueFlag = true;
	search: while (continueFlag) {
			var atomToHalfBond = {}; // map from every atom in the loop to the index of the first half-bond starting from that atom in the uniqHb array
			for (var l = 0; l < loop.length; ++l) {
				var hbid = loop[l];
				var aid1 = this.halfBonds.get(hbid).begin;
				var aid2 = this.halfBonds.get(hbid).end;
				if (aid2 in atomToHalfBond) { // subloop found
					var s = atomToHalfBond[aid2]; // where the subloop begins
					var subloop = loop.slice(s, l + 1);
					subloops.push(subloop);
					if (l < loop.length) // remove half-bonds corresponding to the subloop
						loop.splice(s, l - s + 1);
					continue search;
				}
				atomToHalfBond[aid1] = l;
			}
			continueFlag = false; // we're done, no more subloops found
			subloops.push(loop);
		}
	return subloops;
}

Struct.prototype.halfBondAngle = function (hbid1, hbid2) {
	var hba = this.halfBonds.get(hbid1);
	var hbb = this.halfBonds.get(hbid2);
	return Math.atan2(
	Vec2.cross(hba.dir, hbb.dir),
	Vec2.dot(hba.dir, hbb.dir));
}

Struct.prototype.loopIsConvex = function (loop) {
	for (var k = 0; k < loop.length; ++k) {
		var angle = this.halfBondAngle(loop[k], loop[(k + 1) % loop.length]);
		if (angle > 0)
			return false;
	}
	return true;
}

// check whether a loop is on the inner or outer side of the polygon
//  by measuring the total angle between bonds
Struct.prototype.loopIsInner = function (loop) {
	var totalAngle = 2 * Math.PI;
	for (var k = 0; k < loop.length; ++k) {
		var hbida = loop[k];
		var hbidb = loop[(k + 1) % loop.length];
		var hbb = this.halfBonds.get(hbidb);
		var angle = this.halfBondAngle(hbida, hbidb);
		if (hbb.contra == loop[k]) // back and forth along the same edge
			totalAngle += Math.PI;
		else
			totalAngle += angle;
	}
	return Math.abs(totalAngle) < Math.PI;
}

Struct.prototype.findLoops = function ()
{
	var newLoops = [];
	var bondsToMark = Set.empty();

	// Starting from each half-bond not known to be in a loop yet,
	//  follow the 'next' links until the initial half-bond is reached or
	//  the length of the sequence exceeds the number of half-bonds available.
	// In a planar graph, as long as every bond is a part of some "loop" -
	//  either an outer or an inner one - every iteration either yields a loop
	//  or doesn't start at all. Thus this has linear complexity in the number
	//  of bonds for planar graphs.
	var j, c, loop, loopId;
	this.halfBonds.each(function (i, hb) {
		if (hb.loop == -1) {
			for (j = i, c = 0, loop = [];
				c <= this.halfBonds.count();
				j = this.halfBonds.get(j).next, ++c) {
				if (c > 0 && j == i) { // loop found
					var subloops = this.partitionLoop(loop);
					util.each(subloops, function (loop) {
						if (this.loopIsInner(loop) && !this.loopHasSelfIntersections(loop)) { // loop is internal
							// use lowest half-bond id in the loop as the loop id
							// this ensures that the loop gets the same id if it is discarded and then recreated,
							// which in turn is required to enable redrawing while dragging, as actions store item id's
							loopId = util.arrayMin(loop);
							this.loops.set(loopId, new chem.Loop(loop, this, this.loopIsConvex(loop)));
						} else {
							loopId = -2;
						}
						loop.each(function (hbid){
							this.halfBonds.get(hbid).loop = loopId;
							Set.add(bondsToMark, this.halfBonds.get(hbid).bid);
						}, this);
						if (loopId >= 0) {
							newLoops.push(loopId);
						}
					}, this);
					break;
				} else {
					loop.push(j);
				}
			}
		}
	}, this);
	return {
		newLoops: newLoops,
		bondsToMark: Set.list(bondsToMark)
	};
};

// NB: this updates the structure without modifying the corresponding ReStruct.
//  To be applied to standalone structures only.
Struct.prototype.prepareLoopStructure = function () {
    this.initHalfBonds();
    this.initNeighbors();
    this.updateHalfBonds(this.atoms.keys());
    this.sortNeighbors(this.atoms.keys());
    this.findLoops();
};

Struct.prototype.atomAddToSGroup = function (sgid, aid) {
    // TODO: [MK] make sure the addition does not break the hierarchy?
    chem.SGroup.addAtom(this.sgroups.get(sgid), aid);
    Set.add(this.atoms.get(aid).sgs, sgid);
};

Struct.prototype.calcConn = function (aid) {
    var conn = 0;
    var atom = this.atoms.get(aid);
    var hasAromatic = false;
    for (var i = 0; i < atom.neighbors.length; ++i) {
        var hb = this.halfBonds.get(atom.neighbors[i]);
        var bond = this.bonds.get(hb.bid);
        switch (bond.type) {
            case Struct.BOND.TYPE.SINGLE:
                conn += 1;
                break;
            case Struct.BOND.TYPE.DOUBLE:
                conn += 2;
                break;
            case Struct.BOND.TYPE.TRIPLE:
                conn += 3;
                break;
            case Struct.BOND.TYPE.AROMATIC:
                conn += 1;
                hasAromatic = true;
                break;
            default:
                return -1;
        }
    }
    if (hasAromatic)
        conn += 1;
    return conn;
};

Struct.Atom.prototype.calcValence = function (conn) {
    var atom = this;
    var charge = atom.charge;
    var label = atom.label;
    if (atom.isQuery()) {
        this.implicitH = 0;
        return true;
    }
    var elem = element.getElementByLabel(label);
    if (elem == null) {
        this.implicitH = 0;
        return true;
    }
    
    var groupno = element.get(elem).group;
    var rad = Struct.radicalElectrons(atom.radical);
    
    var valence = conn;
    var hyd = 0;
    var absCharge = Math.abs(charge);
    
    switch (groupno) {
        case 1:
            if (label == 'H' ||
			label == 'Li' || label == 'Na' || label == 'K' ||
			label == 'Rb' || label == 'Cs' || label == 'Fr') {
                valence = 1;
                hyd = 1 - rad - conn - absCharge;
            }
            break;
        case 3:
            if (label == 'B' || label == 'Al' || label == 'Ga' || label == 'In') {
                if (charge == -1) {
                    valence = 4;
                    hyd = 4 - rad - conn;
                }
                else {
                    valence = 3;
                    hyd = 3 - rad - conn - absCharge;
                }
            } 
            else {
                if (label == 'Tl') {
                    if (charge == -1) {
                        if (rad + conn <= 2) {
                            valence = 2;
                            hyd = 2 - rad - conn;
                        }
                        else {
                            valence = 4;
                            hyd = 4 - rad - conn;
                        }
                    }
                    else {
                        if (charge == -2) {
                            if (rad + conn <= 3) {
                                valence = 3;
                                hyd = 3 - rad - conn;
                            }
                            else {
                                valence = 5;
                                hyd = 5 - rad - conn;
                            }
                        }
                        else {
                            if (rad + conn + absCharge <= 1) {
                                valence = 1;
                                hyd = 1 - rad - conn - absCharge;
                            }
                            else {
                                valence = 3;
                                hyd = 3 - rad - conn - absCharge;
                            }
                        }
                    }
                }
            }
            break;
        case 4:
            if (label == 'C' || label == 'Si' || label == 'Ge') {
                valence = 4;
                hyd = 4 - rad - conn - absCharge;
            }
            else {
                if (label == 'Sn' || label == 'Pb') {
                    if (conn + rad + absCharge <= 2) {
                        valence = 2;
                        hyd = 2 - rad - conn - absCharge;
                    }
                    else {
                        valence = 4;
                        hyd = 4 - rad - conn - absCharge;
                    }
                }
            }
            break;
        case 5:
            if (label == 'N' || label == 'P') {
                if (charge == 1) {
                    valence = 4;
                    hyd = 4 - rad - conn;
                }
                else {
                    if (charge == 2) {
                        valence = 3;
                        hyd = 3 - rad - conn;
                    }
                    else {
                        if (label == 'N' || rad + conn + absCharge <= 3) {
                            valence = 3;
                            hyd = 3 - rad - conn - absCharge;
                        }
                        else // ELEM_P && rad + conn + absCharge > 3
                        {
                            valence = 5;
                            hyd = 5 - rad - conn - absCharge;
                        }
                    }
                }
            }
            else {
                if (label == 'Bi' || label == 'Sb' || label == 'As') {
                    if (charge == 1) {
                        if (rad + conn <= 2 && label != 'As') {
                            valence = 2;
                            hyd = 2 - rad - conn;
                        }
                        else {
                            valence = 4;
                            hyd = 4 - rad - conn;
                        }
                    }
                    else {
                        if (charge == 2) {
                            valence = 3;
                            hyd = 3 - rad - conn;
                        }
                        else {
                            if (rad + conn <= 3) {
                                valence = 3;
                                hyd = 3 - rad - conn - absCharge;
                            }
                            else {
                                valence = 5;
                                hyd = 5 - rad - conn - absCharge;
                            }
                        }
                    }
                }
            }
            break;
        case 6:
            if (label == 'O') {
                if (charge >= 1) {
                    valence = 3;
                    hyd = 3 - rad - conn;
                }
                else {
                    valence = 2;
                    hyd = 2 - rad - conn - absCharge;
                }
            }
            else {
                if (label == 'S' || label == 'Se' || label == 'Po') {
                    if (charge == 1) {
                        if (conn <= 3) {
                            valence = 3;
                            hyd = 3 - rad - conn;
                        }
                        else {
                            valence = 5;
                            hyd = 5 - rad - conn;
                        }
                    }
                    else {
                        if (conn + rad + absCharge <= 2) {
                            valence = 2;
                            hyd = 2 - rad - conn - absCharge;
                        }
                        else {
                            if (conn + rad + absCharge <= 4) {
                                // See examples in PubChem
                                // [S] : CID 16684216
                                // [Se]: CID 5242252
                                // [Po]: no example, just following ISIS/Draw logic here {
                                valence = 4;
                                hyd = 4 - rad - conn - absCharge;
                            }
                            else {
                                // See examples in PubChem
                                // [S] : CID 46937044
                                // [Se]: CID 59786
                                // [Po]: no example, just following ISIS/Draw logic here {
                                valence = 6;
                                hyd = 6 - rad - conn - absCharge;
                            }
                        }
                    }
                }
                else {
                    if (label == 'Te') {
                        if (charge == -1) {
                            if (conn <= 2) {
                                valence = 2;
                                hyd = 2 - rad - conn - absCharge;
                            }
                        }
                        else {
                            if (charge == 0 || charge == 2) {
                                if (conn <= 2) {
                                    valence = 2;
                                    hyd = 2 - rad - conn - absCharge;
                                }
                                else {
                                    if (conn <= 4) {
                                        valence = 4;
                                        hyd = 4 - rad - conn - absCharge;
                                    }
                                    else {
                                        if (charge == 0 && conn <= 6) {
                                            valence = 6;
                                            hyd = 6 - rad - conn - absCharge;
                                        }
                                        else {
                                            hyd = -1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            break;
        case 7:
            if (label == 'F') {
                valence = 1;
                hyd = 1 - rad - conn - absCharge;
            }
            else {
                if (label == 'Cl' || label == 'Br' || label == 'I' || label == 'At') {
                    if (charge == 1) {
                        if (conn <= 2) {
                            valence = 2;
                            hyd = 2 - rad - conn;
                        }
                        else {
                            if (conn == 3 || conn == 5 || conn >= 7)
                                hyd = -1;
                        }
                    }
                    else {
                        if (charge == 0) {
                            if (conn <= 1) {
                                valence = 1;
                                hyd = 1 - rad - conn;
                            }
                             // While the halogens can have valence 3, they can not have    
                             // hydrogens in that case.
                            else {
                                if (conn == 2 || conn == 4 || conn == 6) {
                                    if (rad == 1) {
                                        valence = conn;
                                        hyd = 0;
                                    }
                                    else
                                        hyd = -1; // will throw an error in the end
                                }
                                else {
                                    if (conn > 7)
                                        hyd = -1; // will throw an error in the end
                                }
                            }
                        }
                    }
                }
            }
    }
                                               
    this.valence = valence;
    this.implicitH = hyd;
    if (this.implicitH < 0) {
        this.valence = conn;
        this.implicitH = 0;
        this.badConn = true;
        return false;
    }
    return true;
};

Struct.Atom.prototype.calcValenceMinusHyd = function (conn) {
    var atom = this;
    var charge = atom.charge;
    var label = atom.label;
    var elem = element.getElementByLabel(label);
    if (elem == null)
        throw new Error('Element ' + label + ' unknown');
    if (elem < 0) { // query atom, skip
        this.implicitH = 0;
        return null;
    }
    
    var groupno = element.get(elem).group;
    var rad = Struct.radicalElectrons(atom.radical);
    
    if (groupno == 3) {
        if (label == 'B' || label == 'Al' || label == 'Ga' || label == 'In') {
            if (charge == -1)
                if (rad + conn <= 4)
                    return rad + conn;
        }
    }
    else if (groupno == 5) {
        if (label == 'N' || label == 'P') {
            if (charge == 1)
                return rad + conn;
            if (charge == 2)
                return rad + conn;
        }
        else if (label == 'Sb' || label == 'Bi' || label == 'As') {
            if (charge == 1)
                return rad + conn;
            else if (charge == 2)
                return rad + conn;
        }
    }
    else if (groupno == 6) {
        if (label == 'O') {
            if (charge >= 1)
                return rad + conn;
        }
        else if (label == 'S' || label == 'Se' || label == 'Po') {
            if (charge == 1)
                return rad + conn;
        }
    }
    else if (groupno == 7) {
        if (label == 'Cl' || label == 'Br' ||
			label == 'I' || label == 'At') {
            if (charge == 1)
                return rad + conn;
        }
    }
    
    return rad + conn + Math.abs(charge);
};

Struct.prototype.calcImplicitHydrogen = function (aid) {
    var conn = this.calcConn(aid);
    var atom = this.atoms.get(aid);
    atom.badConn = false;
    if (conn < 0 || atom.isQuery()) {
        atom.implicitH = 0;
        return;
    }
    if (atom.explicitValence >= 0) {
        var elem = element.getElementByLabel(atom.label);
        atom.implicitH = 0;
        if (elem != null) {
            atom.implicitH = atom.explicitValence - atom.calcValenceMinusHyd(conn);
            if (atom.implicitH < 0) {
                atom.implicitH = 0;
                atom.badConn = true;
            }
        }
    } else {
        atom.calcValence(conn);
    }
};

Struct.prototype.setImplicitHydrogen = function (list) {
    var f = function (aid) { this.calcImplicitHydrogen(aid); };
    if (util.isNullOrUndefined(list))
        this.atoms.each(f, this);
    else
        util.each(list, f, this);
};

module.exports = Struct;
/*end of file ->*/
exports.done = true;
console.log('[' + __filename + ']' + ": done.");
/*end of file <-*/