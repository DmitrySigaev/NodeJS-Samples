console.log("process.platform: " + process.platform);
console.log("process.version: " + process.version);
console.log(process.versions);
console.log("process.config: ");
console.log(process.config);
console.log("process.release: ");
console.log(process.release);
console.log('This process is pid ' + process.pid);
console.log("process.title: ");
console.log(process.title);
console.log('This processor architecture is ' + process.arch);
console.log("show arguments:");
process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
});
console.log("process.memoryUsage(): ");
console.log(process.memoryUsage());

console.logd = function (TYPE, d) {
    process.stdout.write(__filename + ':' + d + '\n');
};

/* main code -------------------------------*/
/* start of file ->*/
ls = __filename.lastIndexOf('/');
rs = __filename.lastIndexOf('\\');
__filename = __filename.substring((((ls >= 0)? ls + 1: 0) | ((rs >= 0)? rs + 1: 0)), __filename.length);
console.log('[' + __filename + ']' + ": starting");
exports.done = false;
/* start of file <- */



String.prototype.strip = function () {
    return this.replace(/^\s+/, "").replace(/\s+$/, "");
};
/*
Object.prototype.supname = function () {
    return this.supname = "Hello";
};
*/

o = new Object();
s = new String();

var isEmpty = function (obj) {
    for (var v in obj) {
        if (obj.hasOwnProperty(v)) {
            return false;
        }
    }
    return true;
};
/* ---------- 
 * JQuery https://github.com/jquery/jquery 20151030 */

var isPlainObject = function (obj) {
    
    // Not plain objects:
    // - Any object or value whose internal [[Class]] property is not "[object Object]"
    // - DOM nodes
    // - window
    if (jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj)) {
        return false;
    }
    
    if (obj.constructor &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
        return false;
    }
    
    // If the function hasn't returned already, we're confident that
    // |obj| is a plain object, created by {} or constructed with new Object
    return true;
};

var isEmptyObject = function (obj) {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
};

/* ----------------------------*/
/*
 * http://stackoverflow.com/questions/4597900/checking-something-isempty-in-javascript
 * http://stackoverflow.com/questions/4994201/is-object-empty
 * 
 * */
t = isEmpty(o);
//o.supname();
console.log(t);
t = isEmpty(o);
console.log(t);


st = isEmpty(s);
// delete o.supname;
console.log(st);
st = isEmpty(s);
console.log(st);




console.log([] + 1 + 2);
var obj = {"0": 1,
    0 : 2, 
    1: 4,
    "1": 2
};

console.log(obj["0"] + obj[0]);

function Aa(){ };
Aa.prototype.x = 1;

var aa = new Aa();

Aapr = Aa.prototype;

var aa2 = new aa.constructor();
Aapr.x = 2;


console.log("Aa.x:" + aa.x);

function Bb() { };
Bb.prototype.x = 1;

var bb = new Bb();

Bb.prototype.x = 2;

console.log("Bb.x:" + bb.x);


function A() {
    this.x = 0;
    y = 3;
    z = 7;
    this.x = function (x) { this.x = x };
}

A.prototype.x = 1;


Aproto = A.prototype;
console.log("def A: y:" + y);
console.log("def A: z:" + z);
console.log("def A.x:" + A.x);

var y = new A();
y.x(5);
console.log("A->y.x:" + y.x);
console.log("A->y.y:" + y.y);

A.prototype = {
    x : 2
}

var yx2 = new A();
yx2.x(10);

console.log("y:" + y);
console.log("z:" + z);
console.log("A.x:" + A.x);

console.log("A->y.x:" + y.x); 
console.log("A->y.y:" + y.y);

A.prototype = function() {
    this.x = 2;
};

var yx22 = new A();

console.log("A->y.x:" + y.x); 
console.log("A->y.y:" + y.y);


function B() {
    var y =  4;
    z = 8;
    if (z > 10)
         var k = 12;
    return k;
}

var b = new B();
B.prototype.x = 2;
B.prototype.y = 2;

console.log("y:" + y);
console.log("z:" + z);
console.log("A.x:" + A.x);

  var z = -1;

console.log("z:" + z);

console.log("B->x:" + b.x);
console.log("B->y:" + b.y);
 


/* ----------------------------------------- */
/* todo
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
*/

/* declaration of modules  */
var ind = require("./indigo");
var inc = require("./indigo_inchi");
var ren = require("./indigo_renderer");
var bin = require("./bingo");
var server = require("./server");
var router = require("./router");
var requests_h = require("./requests_h");


// ----

var classifier = require('./classifier.js');
var Classifier = classifier.Classifier;
var DataSet = classifier.DataSet;
var Document = classifier.Document;
var assert = require('assert');

var data = new DataSet();

var item1 = new Document('item1');
item1.add(['a', 'b', 'c']);
var item2 = new Document('item2', ['a', 'b', 'c']);
var item3 = new Document('item3', ['a', 'd', 'e']);
data.add('bad', [item1, item2, item3]);

var itemA = new Document('itemA', ['c', 'd']);
var itemB = new Document('itemB', ['e']);
var itemC = new Document('itemC', ['b', 'd', 'e']);
data.add('good', [itemA, itemB, itemC]);

assert.equal(item1.id, "item1");
assert.equal(item1.tokens.length, 3);
assert.equal(data.categorizedItems.bad.length, 3);

console.log('Training data set: ' + JSON.stringify(data, null, 4));

var options = {
    applyInverse: true
};

var classifier1 = new Classifier(options);

classifier1.train(data);
console.log('Classifier trained.');
console.log(JSON.stringify(classifier1.probabilities, null, 4));

var testDoc = new Document('testDoc', ['b', 'd', 'e']);

var result1 = classifier1.classify(testDoc);
console.log(result1);
assert.equal(result1.category, "good");
assert.equal(result1.probability, 1);

var classifier2 = new Classifier();
classifier2.train(data);
console.log('Classifier trained.');
console.log(JSON.stringify(classifier2.probabilities, null, 4));
assert.equal((classifier2.probabilities.good.c < 1), true);

var result2 = classifier2.classify(testDoc);
console.log(result2);
assert.equal(result2.category, "good");
assert.equal((result2.probability < 1), true);

// ---
console.log('[' + __filename + ']' + "Version:" + ind.indigoStat().version());
indigo = new ind.indigo();

console.log('[' + __filename + ']' + "Version:" + indigo.version());
Inchi = inc.inchi(indigo);
console.log('[' + __filename + ']' + "Inchi.version:" + Inchi.version());
console.log('[' + __filename + ']' + "Inchi.getWarning:" + Inchi.getWarning());
console.log('[' + __filename + ']' + "Inchi.getLog:" + Inchi.getLog());
console.log('[' + __filename + ']' + "Inchi.getAuxInfo:" + Inchi.getAuxInfo());

Render = ren.renderer(indigo);

Bingo = bin.bingo(indigo);
console.log('[' + __filename + ']' + "Bingo.version:" + Bingo.version());

m = indigo.iterateSDFile("./mols.sdf");
console.log("molobject: " + m.id);////ind._lib.indigoSaveMolfileToFile(m.id, "aaa.mol");


chem = require('./chemtool.js').chem;

var fs = require('fs');
var file_data = fs.readFileSync('./accholine.mol', 'utf8').split('\n');

var mol = chem.Molfile.parseCTFile(file_data);
console.info(mol);

for (var i = 320; i < m.count(); i++) {
    snf = "./tests/ut_"+ i+".cml"
    saver = indigo.createFileSaver(snf, "cml");
    mol = m.at(i);
    saver.append(mol);
    saver.close();
    console.log('[' + __filename + '] ' + i + " was saved: " + snf);
}



s = m.at(15).smiles();

mol_n = m._next();
m_n_str = mol_n.molfile();////t = m.next().value.saveMolfile("ttt.mol");
mol_n = m._next();
m_n_str = mol_n.molfile();////t = m.next().value.saveMolfile("ttt.mol");




saver = indigo.writeFile("structures.sdf");

mol = indigo.loadMolecule("C1CCC1");
mol.setName("cyclobutane");
mol.setProperty("id", "8506");
saver.sdfAppend(mol);

mol = indigo.loadMolecule("C(NNN)C");
mol.setProperty("id", "42");
saver.sdfAppend(mol);
saver.close();


m_stat = ind.indigoStat().iterateSDFile("./mols.sdf");


//mol_stri = m.next().value.molfile();////t = m.next().value.saveMolfile("ttt.mol");
mol_stri = m_stat.molfile();////t = m.next().value.saveMolfile("ttt.mol");
m_stat_n = m_stat._next();////t = m.next().value.saveMolfile("ttt.mol");
m_stat_n_str = m_stat_n._next().molfile();

mol1 = indigo.loadMolecule("ONc1cccc1");
console.log(mol1.molfile());

qmol1 = indigo.loadQueryMolecule("C1-C-C-C-1");
console.log(qmol1.molfile())

console.log('[' +__filename + ']' + ": modules initialization");
/* initialization of modules */
var handle = {};

handle["/"] = requests_h.start;
handle["/start"] = requests_h.start;
handle["/upload"] = requests_h.upload;

server.start(router.route, handle);

/* ----------------------------------------- */

/*end of file ->*/
exports.done = true;
console.log('[' + __filename + ']' + ": done.");
/*end of file <-*/
