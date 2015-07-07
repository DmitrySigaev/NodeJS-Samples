/* start of file ->*/
ls = __filename.lastIndexOf('/');
rs = __filename.lastIndexOf('\\');
__filename = __filename.substring((((ls>=0)? ls + 1: 0 )| ((rs >= 0)? rs + 1: 0)), __filename.length); 
console.log('['+__filename +']'+ ": starting");
exports.done = false;
/* start of file <- */
/* ----------------------------------------- */

var http = require("http");
var url = require("url");

function start(route, handle) {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        console.log('[' + __filename + ']' + "{export: onRequest:start}: Request for " + pathname + " received.");
        response.writeHead(200, { "Content-Type": "text/plain" });
        route(handle, pathname, response);
        console.log('[' + __filename + ']' + "{export: onRequest:end}: Request for " + pathname + " end.");
    }

    http.createServer(onRequest).listen(8888);

    console.log('[' + __filename + ']' + "{export}: Server has started.");

}

exports.start = start;

/* ----------------------------------------- */

/*end of file ->*/
exports.done = true;
console.log('['+__filename + ']' + ": done.");
/*end of file <-*/
