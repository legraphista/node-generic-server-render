/**
 * @typedef {Object} Cache
 * @property {function(key, html, cacheSetCallback)} set
 * @property {function(key, cacheGetCallback)} get
 */

/**
 * @callback cacheGetCallback
 * @param {Error|null} err
 * @param {String} html
 */
/**
 * @callback cacheSetCallback
 * @param {Error|null} err
 */

/**
 * @class CacheInterface
 * @type Cache
 * @constructor
 */
var CacheInterface = function () {
};

/**
 * Set cache
 * @param {key} key
 * @param {html} html
 * @param {cacheSetCallback} callback
 */
CacheInterface.prototype.set = function _set (key, html, callback) {
    "use strict";
    throw new Error("this is an interface");
};

/**
 * Get cache
 * @param {key} key
 * @param {cacheGetCallback} callback
 */
CacheInterface.prototype.get = function _get (key, callback) {
    "use strict";
    throw new Error("this is an interface");
};

module.exports = CacheInterface;