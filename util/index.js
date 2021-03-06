/* start of file ->*/
ls = __filename.lastIndexOf('/');
rs = __filename.lastIndexOf('\\');
__filename = __filename.substring((((ls >= 0)? ls + 1: 0) | ((rs >= 0)? rs + 1: 0)), __filename.length);
console.log('[' + __filename + ']' + ": starting");
exports.done = false;
/* start of file <- */
/* ----------------------------------------- */

/*
var util = {};
util.Set = require('./set.js').Set;
util.Map = require('./map.js').Map;
util.Pool = require('./pool.js').Pool;
util.Vec2 = require('./vec2.js').Vec2;
util.Box2Abs = require('./vec2.js').Box2Abs;
*/

var EventMap = {
    mousemove: 'mousemove',
    mousedown: 'mousedown',
    mouseup  : 'mouseup'
};

Array.prototype.swap = function (i1, i2) { //eslint-disable-line
	var tmp = this[i1];
	this[i1] = this[i2];
	this[i2] = tmp;
};

String.prototype.strip = function () {
    return this.replace(/^\s+/, "").replace(/\s+$/, "");
};

var tfx = function (v) {
	return (v - 0).toFixed(8);
};

// "each" function for an array
var each = function (array, func, context) {
	assert(!isNullOrUndefined(array), 'array must be defined');
	for (var i = 0; i < array.length; ++i) {
		func.call(context, array[i], i);
	}
};

var map_each = function (map, func, context) {
	assert(!isNullOrUndefined(map), 'map must be defined');
	for (var key in map) {
		if (map.hasOwnProperty(key)) {
			func.call(context, key, map[key]);
		}
	}
};

var find = function (array, func, context) {
	for (var i = 0; i < array.length; ++i) {
		if (func.call(context, array[i], i)) {
			return i;
		}
	}
	return -1;
};

var findAll = function (array, func, context) {
	var i;
	var ret = [];
	for (i = 0; i < array.length; ++i) {
		if (func.call(context, array[i], i)) {
			ret.push(array[i]);
		}
	}
	return ret;
};

var array = function (arrayLike) {
	var a = [];
	var i = arrayLike.length;
	while (--i >= 0) {
		a[i] = arrayLike[i];
	}
	return a;
};

var isEmpty = function (obj) {
	for (var v in obj) {
		if (obj.hasOwnProperty(v)) {
			return false;
		}
	}
	return true;
};

var stopEventPropagation = function (event) {
	if ('stopPropagation' in event) {// Mozilla, Opera, Safari
		event.stopPropagation();
	} else if ('cancelBubble' in event) {// IE
		event.cancelBubble = true;
	} else {
		throw Error('Browser unrecognized');
	}
};

var preventDefault = function (event) {
	if ('preventDefault' in event) {
		event.preventDefault();
	}
	if (Prototype.Browser.IE) {
		event.returnValue = false;
		event.keyCode = 0;
	}
	return false;
};

var setElementTextContent = function (element, text) {
	if ('textContent' in element) {// Mozilla, Opera, Safari
		element.textContent = text;
	} else if ('innerText' in element) {// IE and others (except Mozilla)
		element.innerText = text;
	} else {
		throw Error('Browser unrecognized');
	}
};

var getElementTextContent = function (element) {
	if ('textContent' in element) {// Mozilla, Opera, Safari
		return element.textContent;
	} else if ('innerText' in element) {// IE and others (except Mozilla)
		return element.innerText;
	}

	throw Error('Browser unrecognized');
};

var stringPadded = function (string, width, leftAligned) {
	var str = string + '';
	var space = '';
	while (str.length + space.length < width) {
		space += ' ';
	}

	return (leftAligned) ? string + space : space + string;
};

var idList = function (object) {
	var list = [];
	for (var aid in object) {
		if (object.hasOwnProperty(aid)) {
			list.push(aid);
		}
	}
	return list;
};

var mapArray = function (src, map) {
	var dst = [];
	for (var i = 0; i < src.length; ++i) {
		dst.push(map[src[i]]);
	}
	return dst;
};

var arrayMax = function (array) {
	return Math.max.apply(Math, array);
};

var arrayMin = function (array) {
	return Math.min.apply(Math, array);
};

var map = function (src, func, context) {
	var dst = [];
	for (var i = 0; i < src.length; ++i) {
		dst.push(func.call(context, src[i]));
	}
	return dst;
};

var apply = function (array, func) {
	for (var i = 0; i < array.length; ++i) {
		array[i] = func(array[i]);
	}
};

var ifDef = function (dst, src, prop, def) {
	dst[prop] = (typeof(src[prop]) !== 'undefined') ? src[prop] : def;
};

var ifDefList = function (dst, src, prop, def) {
	dst[prop] = ((typeof (src[prop]) !== 'undefined') && src[prop] !== null )? array(src[prop]) : def;
};

var identityMap = function (array) {
	var map = {};
	for (var i = 0; i < array.length; ++i) {
		map[array[i]] = array[i];
	}
	return map;
};

var strip = function (src) {
	return src.replace(/\s*$/, '').replace(/^\s*/, '');
};

var stripRight = function (src) {
	return src.replace(/\s*$/, '');
};

var stripQuotes = function (str) {
	if (str[0] === '"' && str[str.length - 1] === '"') {
		return str.substr(1, str.length - 2);
	}
	return str;
};

var paddedFloat = function (number, width, precision) {
	var numStr = number.toFixed(precision).replace(',', '.');
	if (numStr.length > width) {
		throw new Error('number does not fit');
	}
	return stringPadded(numStr, width);
};

var paddedInt = function (number, width) {
	var numStr = number.toFixed(0);
	if (numStr.length > width) {
		throw new Error('number does not fit');
	}
	return stringPadded(numStr, width);
};

var arrayAddIfMissing = function (array, item) {
	for (var i = 0; i < array.length; ++i) {
		if (array[i] === item) {
			return false;
		}
	}
	array.push(item);
	return true;
};

var assert = function (condition, comment) {
	if (!condition) {
		throw new Error(comment ? ('Assertion failed: ' + comment) : 'Assertion failed');
	}
};

var assertDefined = function(v) {
	assert(!isNullOrUndefined(v));
};

var isUndefined = function (variable) {
	return (typeof (variable) === 'undefined'); 
};

var isNull = function (variable) {
	return variable === null;
};

var isNullOrUndefined = function (v) {
	return isUndefined(v) || isNull(v);
};

var arrayRemoveByValue = function (array, item) {
	assert(!isUndefined(array) && !isNull(array), 'array must be defined');
	var idx = array.indexOf(item);
	var cnt = 0;
	while (idx >= 0) {
		array.splice(idx, 1);
		cnt += 1;
		idx = array.indexOf(item);
	}
	return cnt;
};

var listNextRotate = function (list, value) {
	return list[(list.indexOf(value) + 1) % list.length];
};

// similar to Object.assign
// http://www.2ality.com/2014/01/object-assign.html
var extend = function (dest, src) {
	for (var prop in src) {
		if (src.hasOwnProperty(prop)) {
			dest[prop] = src[prop];
		}
	}
	return dest;
};

var isObject = function (obj) {
	return obj === Object(obj);
};

var eachAsync = function(list, process, timeGap, startTimeGap) {
	return new Promise(function (resolve, _) {
		var i = 0,
		    n = list.length;
		function iterate() {
			if (i < n) {
				process(list[i], i++);
				setTimeout(iterate, timeGap);
			}
			else
				resolve();
		}
		setTimeout(iterate, startTimeGap || timeGap);
	});
};
module.exports = {
        EventMap:EventMap,
	tfx: tfx,
	each: each,
	find: find,
	findAll: findAll,
	array: array,
	isEmpty: isEmpty,
	stopEventPropagation: stopEventPropagation,
	preventDefault: preventDefault,
	setElementTextContent: setElementTextContent,
	getElementTextContent: getElementTextContent,
	stringPadded: stringPadded,
	idList: idList,
	mapArray: mapArray,
	arrayMax: arrayMax,
	arrayMin: arrayMin,
	map: map,
	apply: apply,
	ifDef: ifDef,
	ifDefList: ifDefList,
	identityMap: identityMap,
	strip: strip,
	stripRight: stripRight,
	stripQuotes: stripQuotes,
	paddedFloat: paddedFloat,
	paddedInt: paddedInt,
	arrayAddIfMissing: arrayAddIfMissing,
	assert: assert,
	assertDefined: assertDefined,
	isUndefined: isUndefined,
	isNull: isNull,
	isNullOrUndefined: isNullOrUndefined,
	arrayRemoveByValue: arrayRemoveByValue,
	listNextRotate: listNextRotate,
	extend: extend,
	isObject: isObject,
	eachAsync: eachAsync
};

/* ----------------------------------------- */

/*end of file ->*/
exports.done = true;
console.log('[' + __filename + ']' + ": done.");
/*end of file <-*/
