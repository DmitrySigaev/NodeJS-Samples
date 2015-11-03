/* start of file ->*/
ls = __filename.lastIndexOf('/');
rs = __filename.lastIndexOf('\\');
__filename = __filename.substring((((ls>=0)? ls + 1: 0 )| ((rs >= 0)? rs + 1: 0)), __filename.length); 
console.log('['+__filename +']'+ ": starting");
exports.done = false;
/* start of file <- */
/* ----------------------------------------- */


var Molfile = require('./chem/molfile.js');
chem = {};
chem.Molfile = Molfile;
exports.chem = chem;

/* ----------------------------------------- */

/*end of file ->*/
exports.done = true;
console.log('['+__filename + ']' + ": done.");
/*end of file <-*/
