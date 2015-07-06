/* start of file ->*/
ls = __filename.lastIndexOf('/');
rs = __filename.lastIndexOf('\\');
__filename = __filename.substring((((ls >= 0)? ls + 1: 0) | ((rs >= 0)? rs + 1: 0)), __filename.length);
console.log('[' + __filename + ']' + ": starting");
exports.done = false;
/* start of file <- */
/* ----------------------------------------- */


function route(handle, pathname) {
    console.log('[' + __filename + ']' + "{export}: About to route a request for " + pathname);
    if (typeof handle[pathname] === 'function') {
          handle[pathname]();
    } else {
           console.log('[' + __filename + ']' + "{export}: No request handler found for " + pathname);
    }
}

exports.route = route;


/* ----------------------------------------- */
/*end of file ->*/
exports.done = true;
console.log('[' + __filename + ']' + ": done.");
/*end of file <-*/