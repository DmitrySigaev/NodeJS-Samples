console.log("process.platform: " + process.platform);
console.log("process.version: " + process.version);
console.log("show arguments:");
process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
});

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

console.log('Standard ECMA-262 3rd Edition - December 1999:');
console.log('Variable object:');
/*
 * Always in programs we declare functions and variables which then successfully use building our systems.
 * But how and where the interpreter finds our data (functions, variable)?
 *  What occurs, when we reference to needed objects?
 *  Many ECMAScript programmers know that variables are closely related with the execution context:
 * */

var a = 10; // variable of the global context

(function () {
    var b = 20; // local variable of the function context
})();

console.log(a); // 10
// check: console.log(b); // "b" is not defined
/*
 * Also, many programmers know that the isolated scope in the current version of specification is created 
 * only by execution contexts with “function” code type. I.e., in contrast with C/C++, for example
 *  the block of for loop in ECMAScript does not create a local context:
 *  */

for (var k in { a: 1, b: 2 }) {
    console.log('k'+ k);
}

console.log('k' + k); // variable "k" still in scope even the loop is finished

/*
 * Variable object in global context
*/

var a = new String('test');

console.log(a); // напрямую, будет найдено в VO(globalContext): "test"

//node.js fix console.log(window['a']); // косвенно через global === VO(globalContext): "test"
console.log(a === this.a); // true(browser) : false in node.js this.a is undefined

exports.a = a;
console.log(a === this.a); // true beacause this is exports;

// var aKey = 'a';
// console.log(window[aKey]); // косвенно, имя свойства сформировано налету: "test"


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
