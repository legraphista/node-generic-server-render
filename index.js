/**
 * @typedef {String} key
 */
/**
 * @typedef {String} html
 */

/**
 * @typedef {Object} File
 * @property {String} file
 */
/**
 * @typedef {Object} URL
 * @property {String} url
 */
/**
 * @typedef {Object} HTML
 * @property {String} html
 */

/**
 * @callback renderCallback
 * @param {Error|null} err
 * @param {String} html
 */


/** @type {Nightmare} */
var Nightmare = require("nightmare");

var path = require("path");

/**
 * @typedef {function(html)} grabHtml
 * @lends Nightmare
 */
/**
 * @desc defines grabHtml
 */
Nightmare.action('grabHtml', function (done) {
    this.evaluate_now(function () {
        return "<html>" + document.documentElement.innerHTML + "</html>";
    }, done)
});

/**
 * @typedef {function(html)} inject
 * @lends Nightmare
 */
/**
 * @desc defines inject
 */
Nightmare.action('inject', function (html, done) {
    this.evaluate_now(function (html) {
        return document.documentElement.innerHTML = html;
    }, done, html)
});

/**
 * Rendered HTML
 * @param {URL|File|HTML} options
 * @param {Cache} [options.cache=null]
 * @param {Number} [options.width=1280]
 * @param {Number} [options.height=720]
 * @param {renderCallback} callback
 */
var serverRender = function serverRender (options, callback) {
    "use strict";

    if (options.cache) {
        options.cache.get(options.url || options.file || options.html, function (err, html) {
            if (err) return callback(err);

            if (!html) return coldRender();

            return callback(null, html);
        });
    } else {
        return coldRender();
    }


    function coldRender () {
        var nightmare = Nightmare({
            show: false,
            width: options.width || 1280,
            height: options.height || 720
        });

        if (options.url) {
            nightmare = nightmare.goto(options.url);
        } else if (options.file) {
            nightmare = nightmare.goto("file://" + path.resolve(options.file));
        } else if (options.html) {
            nightmare = nightmare
                .goto("about:blank")
                .inject(options.html);
        } else {
            nightmare.end();
            return callback(module.exports.Errors.noInput);
        }

        nightmare
            .wait("html")
            .grabHtml()
            .then(
                function (html) {
                    if (options.cache) options.cache.set(options.url || options.file || options.html, html, new Function);

                    return callback(null, html);
                },
                function (err) {
                    if (!(err instanceof Error)) err = new Error(err);
                    return callback(err);
                }
            );
        nightmare.end();
    }
};

module.exports = serverRender;

module.exports.Errors = {};
module.exports.Errors.noInput = new Error("You havent provided URL, file or HTML");