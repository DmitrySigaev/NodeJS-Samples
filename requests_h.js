/* start of file ->*/
ls = __filename.lastIndexOf('/');
rs = __filename.lastIndexOf('\\');
__filename = __filename.substring((((ls >= 0)? ls + 1: 0) | ((rs >= 0)? rs + 1: 0)), __filename.length);
console.log('[' + __filename + ']' + ": starting");
exports.done = false;
/* start of file <- */
/* ----------------------------------------- */


function start() {
    console.log('[' + __filename + ']' + "{export}:Request handler \'start\' was called.");
}

function upload() {
    console.log('[' + __filename + ']' + "{export}:Request handler 'upload' was called.");
}

exports.start = start;
exports.upload = upload;


/* ----------------------------------------- */
/*end of file ->*/
exports.done = true;
console.log('[' + __filename + ']' + ": done.");
/*end of file <-*/
