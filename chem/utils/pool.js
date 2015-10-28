/* start of file ->*/
ls = __filename.lastIndexOf('/');
rs = __filename.lastIndexOf('\\');
__filename = __filename.substring((((ls >= 0)? ls + 1: 0) | ((rs >= 0)? rs + 1: 0)), __filename.length);
console.log('[' + __filename + ']' + ": starting");
exports.done = false;
/* start of file <- */
/* ----------------------------------------- */
var util = {};

util.Pool = function ()
{
    this._map = new util.Map();
    this._nextId = 0;
};

util.Pool.prototype.newId = function ()
{
    return this._nextId++;
};

util.Pool.prototype.add = function (obj)
{
    var id = this._nextId++;
    this._map.set(id, obj);
    return id;
};

util.Pool.prototype.set = function (id, obj)
{
    this._map.set(id, obj);
};

util.Pool.prototype.get = function (id)
{
    return this._map.get(id);
};

util.Pool.prototype.has = function (id) {
    return this._map.has(id);
};

util.Pool.prototype.remove = function (id)
{
    return this._map.unset(id);
};

util.Pool.prototype.clear = function ()
{
    this._map.clear();
};

util.Pool.prototype.keys = function ()
{
	return this._map.keys();
};

util.Pool.prototype.ikeys = function ()
{
	return this._map.ikeys();
};

util.Pool.prototype.each = function (func, context)
{
    this._map.each(func, context);
};

util.Pool.prototype.map = function (func, context)
{
    return this._map.map(func, context);
};

util.Pool.prototype.find = function (func, context)
{
    return this._map.find(func, context);
};

util.Pool.prototype.count = function ()
{
    return this._map.count();
};

util.Pool.prototype.keyOf = function(value) {
    return this._map.keyOf(value);
};


exports.Pool = util.Pool;

/* ----------------------------------------- */

/*end of file ->*/
exports.done = true;
console.log('[' + __filename + ']' + ": done.");
/*end of file <-*/
