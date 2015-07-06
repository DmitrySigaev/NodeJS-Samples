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

/* ----------------------------------------- */

/* declaration of modules  */
var server = require("./server");
var router = require("./router");
var requests_h = require("./requests_h");



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
