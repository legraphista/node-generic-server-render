/**
 * @typedef {String} key
 */
/**
 * @typedef {String} html
 */


/** @type {Nightmare} */
const Nightmare = require("nightmare");
require('nightmare-load-filter')(Nightmare);

const fs = require('fs');
const async = require('async');

/**
 * @typedef {function(html)} grabHtml
 * @lends Nightmare
 */
/**
 * @desc defines grabHtml
 */
Nightmare.action('grabHtml', function(querySelector, done) {
  this.evaluate_now(function(querySelector) {
    const docs = document.querySelectorAll(querySelector);
    const strings = new Array(docs.length);
    for (var i = 0; i < docs.length; i++) {
      strings[i] = docs[i].outerHTML;
    }
    return strings;
  }, done, querySelector);
});

/**
 * @typedef {function(html)} inject
 * @lends Nightmare
 */
/**
 * @desc defines inject
 */
Nightmare.action('inject', function(html, done) {
  this.evaluate_now(function(html) {
    return document.documentElement.innerHTML = html;
  }, done, html)
});

/**
 * @typedef {Object} RenderProperties
 * @property {String} url
 * @property {String|Number|function} [wait=html]
 * @property {function} [jsAfter=null]
 * @property {String|Number|function} [jsAfterWait=null]
 * @property {String} [querySelector=html]
 */

/**
 * @type {Renderer}
 */
module.exports = class Renderer {
  /**
   * @param {Object} options
   * @param {Number} [options.width=1280]
   * @param {Number} [options.height=720]
   * @param {String=} [options.agent]
   * @param {Object=} [options.nightmare]
   * @param {{options: {urls: String[]}, fn: function(Object, function)}=} [options.filter] see https://github.com/rosshinkley/nightmare-load-filter
   * @param {Number} [options.poolSize=4]
   */
  constructor(options) {

    this._pool = new Array(options.poolSize);

    for (let i = 0; i < options.poolSize; i++) {
      const renderer = Nightmare(Object.assign({
        show: false,
        width: options.width || 1280,
        height: options.height || 720
      }, options.nightmare || {}));

      if (options.agent) {
        renderer.useragent(options.agent);
      }

      if (options.filter) {
        renderer.filter(options.filter.options, options.filter.fn);
      }

      this._pool[i] = renderer;
    }

    this._queue = async.queue(this._render.bind(this), options.poolSize);
  }

  /**
   *
   * @param {RenderProperties} options
   * @param callback
   */
  render(options, callback) {
    this._queue.push(options, callback);
  }

  /**
   *
   * @param {RenderProperties} options
   * @param callback
   */
  _render(options, callback) {
    const renderer = this._pool.pop();

    renderer.goto(options.url);

    renderer
      .wait(options.wait || "html");

    if (options.jsAfter) {
      renderer.evaluate(options.jsAfter || function() {
        })
    }

    if (options.jsAfterWait) {
      renderer.wait(options.jsAfterWait || "html")
    }

    renderer
      .grabHtml(options.querySelector || "html")
      .then(
        (html) => {
          this._pool.push(renderer);
          renderer.goto('about:blank').then(_ => _);
          return callback(null, html);
        },
        (err) => {
          this._pool.push(renderer);
          renderer.goto('about:blank').then(_ => _);
          return callback(err);
        }
      );
  }

  close() {
    return this._pool.forEach(renderer => renderer.end(_ => _));
  }
};
