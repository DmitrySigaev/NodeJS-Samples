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



function A() { y = 3; }
A.prototype.x = 1;
var y = new A();
A.prototype = {
    x : 2
}
console.log(y.x); // 1;
console.log(y.y); // 1;
function B() { y = 3; }
B.prototype.x = 1;
var b = new B();
B.prototype.y = 2;
console.log(b.x);
console.log(b.y);
 

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


console.log('[' + __filename + ']' + "Version:" + ind.indigo().version());
Inchi = inc.inchi(ind.indigo);
console.log('[' + __filename + ']' + "Inchi.version:" + Inchi.version());
console.log('[' + __filename + ']' + "Inchi.getWarning:" + Inchi.getWarning());
console.log('[' + __filename + ']' + "Inchi.getLog:" + Inchi.getLog());
console.log('[' + __filename + ']' + "Inchi.getAuxInfo:" + Inchi.getAuxInfo());

Render = ren.renderer(ind.indigo);

Bingo = bin.bingo(ind.indigo);
console.log('[' + __filename + ']' + "Bingo.version:" + Bingo.version());

m = ind.indigo().iterateSDFile("./mols.sdf");
console.log("molobject: " + m.id);////ind._lib.indigoSaveMolfileToFile(m.id, "aaa.mol");

//mol_stri = m.next().value.molfile();////t = m.next().value.saveMolfile("ttt.mol");
mol_stri = m.molfile();////t = m.next().value.saveMolfile("ttt.mol");


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
