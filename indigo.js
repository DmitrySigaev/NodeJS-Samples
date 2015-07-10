/* start of file ->*/
ls = __filename.lastIndexOf('/');
rs = __filename.lastIndexOf('\\');
__filename = __filename.substring((((ls>=0)? ls + 1: 0 )| ((rs >= 0)? rs + 1: 0)), __filename.length); 
console.log('['+__filename +']'+ ": starting");
exports.done = false;
/* start of file <- */
/* ----------------------------------------- */

IndigoObject = function (d, id, parent) {
    if (!(this instanceof IndigoObject)) {
        return new IndigoObject(d, id);
    }
    this.id = id;
    this.d = d;
}

function Indigo() {
    if (!(this instanceof Indigo)) {
        return new Indigo();
    }
    this.version = function () { return "0.1.0"; }
 
    qword = "ulonglong";
    if (process.platform == "win32") {
        qword = "uint64";
    }
}
      
exports.indigo = Indigo;

/* ----------------------------------------- */

/*end of file ->*/
exports.done = true;
console.log('['+__filename + ']' + ": done.");
/*end of file <-*/
