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

var countRegExpEntry = function (re, str) {
	var count = 0;
	var count2 = 0;
	var count3 = 0;
	var index1 = str.search(re);
	var index2 = str.search(re); //don't use glogal flag
	
	while (re.test(str)) {
		count++;
	}
	if (re.test(str)) {
		count2++;
		while ((myArray = re.exec(str)) !== null) {
			count2++;
		}
		str.replace(re, function (match) { count3++; });
	}
	return count;
}


/* declaration of modules  */
var assert = require('assert');
assert.equal(4, countRegExpEntry(/@1/g,'1@12@1 ` ~@1 02 @1@2'));


var array = function (arrayLike) {
    var a = [];
    var i = arrayLike.length;
    while (--i >= 0) {
        a[i] = arrayLike[i];
    }
    return a;
};

var record = {test:"21", "23": "3422"};
var record2 = {"21":[]};

var testar = [record, "test", , false, [0, 1], { array_empty: function () { return [] }}, 3];

var testnew = array(testar);
var testnew2 = [].concat(testnew);
var testnew3 = [].concat(testar);
var testnew4 = [].slice.call(testar);
var testnew2_ = testar.concat(testnew);
var testnew3_ = testar.concat(testar);
testar[1] = "change";
var testnew4_ = testnew2_.slice.call(testar);

testar[5].array_empty = array;
testar[0] = record2;

if (true) {
// polyfill
// Шаги алгоритма ECMA-262, 6-е издание, 22.1.2.1
// Ссылка: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
	if (!Array.from) {
		Array.from = (function () {
			var toStr = Object.prototype.toString;
			var isCallable = function (fn) {
				return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
			};
			var toInteger = function (value) {
				var number = Number(value);
				if (isNaN(number)) { return 0; }
				if (number === 0 || !isFinite(number)) { return number; }
				return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
			};
			var maxSafeInteger = Math.pow(2, 53) - 1;
			var toLength = function (value) {
				var len = toInteger(value);
				return Math.min(Math.max(len, 0), maxSafeInteger);
			};
		
			// Свойство length метода from равно 1.
			return function from(arrayLike/*, mapFn, thisArg */) {
				// 1. Положим C равным значению this.
				var C = this;
			
				// 2. Положим items равным ToObject(arrayLike).
				var items = Object(arrayLike);
			
				// 3. ReturnIfAbrupt(items).
				if (arrayLike == null) {
					throw new TypeError('Array.from requires an array-like object - not null or undefined');
				}
			
				// 4. Если mapfn равен undefined, положим mapping равным false.
				var mapFn = arguments[1];
				if (typeof mapFn !== 'undefined') {
					mapFn = arguments.length > 1 ? arguments[1] : void undefined;
					// 5. иначе
					// 5. a. Если вызов IsCallable(mapfn) равен false, выкидываем исключение TypeError.
					if (!isCallable(mapFn)) {
						throw new TypeError('Array.from: when provided, the second argument must be a function');
					}
				
					// 5. b. Если thisArg присутствует, положим T равным thisArg; иначе положим T равным undefined.
					if (arguments.length > 2) {
						T = arguments[2];
					}
				}
			
				// 10. Положим lenValue равным Get(items, "length").
				// 11. Положим len равным ToLength(lenValue).
				var len = toLength(items.length);
			
				// 13. Если IsConstructor(C) равен true, то
				// 13. a. Положим A равным результату вызова внутреннего метода [[Construct]]
				//     объекта C со списком аргументов, содержащим единственный элемент len.
				// 14. a. Иначе, положим A равным ArrayCreate(len).
				var A = isCallable(C) ? Object(new C(len)) : new Array(len);
			
				// 16. Положим k равным 0.
				var k = 0;
				// 17. Пока k < len, будем повторять... (шаги с a по h)
				var kValue;
				while (k < len) {
					kValue = items[k];
					if (mapFn) {
						A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
					} else {
						A[k] = kValue;
					}
					k += 1;
				}
				// 18. Положим putStatus равным Put(A, "length", len, true).
				A.length = len;
				// 20. Вернём A.
				return A;
			};
		}());
	}
}

var ObjA = function (params) {
    var init = { copy: 1 };
    this.copy = this.copy + 1 || init.copy;
    var local_copy = this.copy;
    return {
        copy : local_copy,
        constructor: ObjA
    };
};


var copy_objA = ObjA();
var copy_objA_ = new copy_objA.constructor();
var copy_objA__ =  copy_objA.constructor();
var copy_objA__ = new copy_objA_.constructor();

var ObjB = function (params) {
    var init = { copy: 1 };
    this.copy = this.copy + 1 || init.copy;
    return this;
};

var copy_objB = new ObjB();
var copy_objB_ = new copy_objB.constructor();
// var copy_objB__ = new ( copy_objB.constructor());
var copy_objB__ = new copy_objB_.constructor();


var Test12 = function (params) {
    var init = { copy: 1, close: 2 };
    if (this.copy != undefined)
        init.copy = this.copy;
    this.copy = params || init.copy - 1;
    return {
        copy: params + 1 || init.copy,
        constructor : Test12
    };
}; 

var TestedObject12 = Test12();
var TestedObject123 = TestedObject12.constructor();
var TestedObject1234 = new TestedObject12.constructor();

var TestedObject12_new = new Test12();
var TestedObject123_new = TestedObject12_new.constructor();
var TestedObject1234_new = new TestedObject12_new.constructor();

var TestedObject12_ = Test12(22);
var TestedObject123_ = TestedObject12.constructor(22);
var TestedObject1234_ = new TestedObject12.constructor(22);

var TestedObject12_new_ = new Test12(22);
var TestedObject123_new_ = TestedObject12_new_.constructor(22);
var TestedObject1234_new_ = new TestedObject12_new_.constructor(22);

var Test = function (params){
    var init = { copy: 1, close: 2 };
    
    this.copy = params || init.copy;
}



var Test2 = function (params) {
    var init = { copy: 1, close: 2 };
    
    return { copy: params || init.copy }
}

console.log(":undefined:");
var TestedObject1 = Test();
console.log(TestedObject1);
var TestedObject2 = new Test();
console.log(TestedObject2);

var TestedObject3 = Test2();
console.log(TestedObject3);
var TestedObject4 = new Test2();
console.log(TestedObject4);

console.log(":out:");

var TestedObject1 = Test("out");
console.log(TestedObject1);
var TestedObject2 = new Test("out");
console.log(TestedObject2);

var TestedObject3 = Test2("out");
console.log(TestedObject3);
var TestedObject4 = new Test2("out");
console.log(TestedObject4);

console.log(":null:");

var TestedObject1 = Test(null);
console.log(TestedObject1);
var TestedObject2 = new Test(null);
console.log(TestedObject2);

var TestedObject3 = Test2(null);
console.log(TestedObject3);
var TestedObject4 = new Test2(null);
console.log(TestedObject4);

console.log(":0:");

var TestedObject1 = Test(0);
console.log(TestedObject1);
var TestedObject2 = new Test(0);
console.log(TestedObject2);

var TestedObject3 = Test2(0);
console.log(TestedObject3);
var TestedObject4 = new Test2(0);
console.log(TestedObject4);


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

//m = indigo.iterateSDFile("./mols.sdf");
//console.log("molobject: " + m.id);////ind._lib.indigoSaveMolfileToFile(m.id, "aaa.mol");


require('./chem');
Molfile = require('./chem/molfile.js');

var fs = require('fs');
var file_data = fs.readFileSync('./accholine.mol', 'utf8').split('\n');

var mol = new Molfile().parseCTFile(file_data);
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
