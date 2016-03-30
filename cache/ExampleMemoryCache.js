/**
 * @class ExampleMemoryCache
 * @type Cache
 * @constructor
 */
var ExampleMemoryCache = function ExampleMemoryCache () {
    "use strict";

    /**
     * internal cache
     * @type {Object.<key, html>}}
     * @private
     */
    this._cache = {};

    return this;
};

/**
 * @lends ExampleMemoryCache
 * @param {key} key
 * @param {cacheGetCallback} callback
 */
ExampleMemoryCache.prototype.get = function _get (key, callback) {
    "use strict";
    return process.nextTick(function () {
        callback(null, this._cache[key]);
    }.bind(this));
};

/**
 * @lends ExampleMemoryCache
 * @param {key} key
 * @param {html} html
 * @param {cacheSetCallback} callback
 */
ExampleMemoryCache.prototype.set = function _set (key, html, callback) {
    "use strict";
    this._cache[key] = html;

    process.nextTick(function () {
        callback(null);
    });
};

module.exports = ExampleMemoryCache;