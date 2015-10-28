/* start of file ->*/
ls = __filename.lastIndexOf('/');
rs = __filename.lastIndexOf('\\');
__filename = __filename.substring((((ls >= 0)? ls + 1: 0) | ((rs >= 0)? rs + 1: 0)), __filename.length);
console.log('[' + __filename + ']' + ": starting");
exports.done = false;
/* start of file <- */
/* ----------------------------------------- */
var util = {};

util.Map = function (obj) {
    if (typeof(obj) !== 'undefined' && obj.constructor !== Object)
        throw Error("Passed object is not an instance of 'Object'!");
    this._obj = obj || {};
    this._count = 0;
};

util.Map.prototype.each = function(func, context) {
    for (var v in this._obj) {
        var v_int = parseInt(v);
        var value = this._obj[v];
        
        if (!isNaN(v_int))
            v = v_int;
        func.call(context, v, value)
    }
};

util.Map.prototype.map = function(func, context) {
    var ret = new util.Map();
    this.each(function(v, value){
        ret.set(v, func.call(context, v, value));
    }, this);
    return ret;
};

util.Map.prototype.find = function(func, context) {
    for (var v in this._obj) {
        var v_int = parseInt(v);
        var value = this._obj[v];
        
        if (!isNaN(v_int))
            v = v_int;
        if (func.call(context, v, value))
            return v;
    }
};

util.Map.prototype.findAll = function(func, context) {
    var vv = [];
    for (var v in this._obj) {
        var v_int = parseInt(v);
        var value = this._obj[v];
        if (!isNaN(v_int))
            v = v_int;
        if (func.call(context, v, value))
            vv.push(v);
    }
    return vv;
};

util.Map.prototype.keys = function() {
    var keys = [];
    for (var v in this._obj) {
        keys.push(v);
    }
    return keys;
};

util.Map.prototype.ikeys = function() {
    var keys = [];
    for (var v in this._obj) {
        keys.push(v - 0);
    }
    return keys;
};

util.Map.prototype.set = function (key, value) {
    this._count += (typeof(value) !== 'undefined' ? 1 : 0)
        - (typeof(this._obj[key]) !== 'undefined' ? 1 : 0);
    if (typeof(value) === 'undefined') {
        var val = this._obj[key];
        delete this._obj[key];
        return val;
    } else {
        return this._obj[key] = value;
    }
};

util.Map.prototype.get = function (key) {
    if (this._obj[key] !== Object.prototype[key])
        return this._obj[key];
    return undefined;
};

util.Map.prototype.has = function (key) {
    return (this._obj[key] !== Object.prototype[key]);
};

util.Map.prototype.unset = function (key) {
    return this.set(key, undefined);
};

util.Map.prototype.update = function (object) {
    for (var v in object)
        this.set(v, object[v]);
};

util.Map.prototype.clear = function () {
    this._obj = {};
    this._count = 0;
};

util.Map.prototype.count = function () {
    return this._count;
};

util.Map.prototype.idList = function () {
    return util.idList(this._obj);
};

util.Map.prototype.keyOf = function(value) {
    for (var key in this._obj) if (this._obj[key] === value) return key;
};

exports.Map = util.Map;

/* ----------------------------------------- */

/*end of file ->*/
exports.done = true;
console.log('[' + __filename + ']' + ": done.");
/*end of file <-*/
