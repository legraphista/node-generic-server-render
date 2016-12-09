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
var fs = require('fs');
var os = require('os');
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

var getTempFilePath = function() {
    return path.join((os.tmpdir || os.tmpDir)(), Math.random().toString().replace('.', '') + '.html');
};

/**
 * Rendered HTML
 * @param {URL|File|HTML} options
 * @param {Cache} [options.cache=null]
 * @param {Number} [options.width=1280]
 * @param {Number} [options.height=720]
 * @param {String|Number|function} [options.wait=html]
 * @param {function} [options.jsAfter=null]
 * @param {function} [options.jsAfterWait=html]
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

        var tempPath = null;

        if (options.url) {
            nightmare = nightmare.goto(options.url);
            return _doRender();
        }
        if (options.file) {
            nightmare = nightmare.goto("file://" + path.resolve(options.file));
            return _doRender();
        }

        if (options.html) {
            tempPath = getTempFilePath();
            return fs.writeFile(tempPath, options.html, function(err) {
                if(err){
                  return callback(err);
                }

                nightmare = nightmare.goto("file://" + tempPath);
                return _doRender();
            });
        }

        nightmare.end();
        return callback(module.exports.Errors.noInput);

        function _doRender() {
          nightmare
            .wait(options.wait || "html")
            .evaluate(options.jsAfter || function(){})
            .wait(options.jsAfterWait || "html")
            .grabHtml()
            .then(
              function(html) {
                if (options.cache) {
                  return options.cache.set(options.url || options.file || options.html, html, function(err){
                    return callback(err, html);
                  });
                }

                if(tempPath){
                  fs.unlink(tempPath, function(){});
                }

                return callback(null, html);
              },
              function(err) {
                if(tempPath){
                  fs.unlink(tempPath, function(){});
                }

                return callback(err);
              }
            );
          nightmare.end();
        }
    }
};

module.exports = serverRender;

module.exports.Errors = {};
module.exports.Errors.noInput = new Error("You haven't provided URL, file or HTML");