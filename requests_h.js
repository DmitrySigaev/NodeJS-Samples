/* start of file ->*/
ls = __filename.lastIndexOf('/');
rs = __filename.lastIndexOf('\\');
__filename = __filename.substring((((ls >= 0)? ls + 1: 0) | ((rs >= 0)? rs + 1: 0)), __filename.length);
console.log('[' + __filename + ']' + ": starting");
exports.done = false;
/* start of file <- */
/* ----------------------------------------- */
var exec = require("child_process").exec;


function start(response) {
    console.log('[' + __filename + ']' + "{export}:Request handler \'start\' was called.");
    exec("find /",
    { timeout: 10000, maxBuffer: 20000 * 1024 },
    function (error, stdout, stderr) {
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.write(stdout);
        response.end();
    });
    
    /*
    function sleep(milliSeconds) {
        var startTime = new Date().getTime();
        while (new Date().getTime() < startTime + milliSeconds)        ;
    }
    
    sleep(10000);
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.write("Hello Start");
    response.end();*/
}

function upload(response) {
    console.log('[' + __filename + ']' + "{export}:Request handler 'upload' was called.");
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.write("Hello Upload");
    response.end();
}

exports.start = start;
exports.upload = upload;


/* ----------------------------------------- */
/*end of file ->*/
exports.done = true;
console.log('[' + __filename + ']' + ": done.");
/*end of file <-*/
