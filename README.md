# generic-server-render
Render output html at an url, from a file or from an html string.

## Why?
 *Easy to use server-side rendering to aid crawlers better "see" your site*

_example:  Search engine optimization_

## Troubleshooting

Rendering hangs and the callback is never called with an error or the result? Are you running in a headless environment? If so [here's the solution](https://github.com/segmentio/nightmare/issues/224)

For other issues, you can add `DEBUG=nightmare*,electron:*` as an environment variable for your application and submit the log [here](https://github.com/legraphista/node-generic-server-render/issues/new).

___
## Install
 `npm i --save generic-server-render`

## Up to speed:

```javascript
var render = require("generic-server-render");

render({url: "https://github.com"}, console.log);

render({file: "./path/to/my/file.html"}, console.log);

render({html : "<html><body>Hello world</body></html>"}, console.log)
```
___
## Options

    - url {String} : website location
    - file {String} : file absolute / relative ocation
    - html {String} : actual html
    [NOTE] url, file and html are mutually exclusive
           and will be prioritized as follows: url, file, html

    [Optional]
    - width {Number} : width of the viewport
    - height {Number} : height of the viewport

    - cache {Cache} : an object of type/class Cache
    - querySelector {String} : query to the the element(s) desired (default is 'html')
    - nightmare {Object} : extra nightmare options, see [nightmare documentation](https://github.com/segmentio/nightmare)
    - filter {Object} : filter requests, see [nightmare-load-filter documentation](https://github.com/rosshinkley/nightmare-load-filter)
        - options : {Object}
            - urls : String[]
        - fn : {function}

    [Callback]
    - Error / null
    - String[]
___
## Caching

Caching makes so that the server will not have to render the page more than once.

You can implement a Cache adapter of your own (or use the example one in `generic-server-render/cache/ExampleMemoryCache`.

### Implementing your own cache adaptor
All you need is an `Object`, `Class`, or `Function` with the following methods:
 - `get (/**String*/ key, /**function(err, html)*/ callback)` - get cached page
 - `set (/**String*/ key, /**String*/ html, /**function(err)*/ callback)` - set cached page

#### Example:
```javascript
var ExampleMemoryCache = function ExampleMemoryCache () {
    this._cache = {};
};
ExampleMemoryCache.prototype.get = function _get (key, callback) {
    return process.nextTick(function () {
        callback(null, this._cache[key]);
    }.bind(this));
};
ExampleMemoryCache.prototype.set = function _set (key, html, callback) {
    this._cache[key] = html;
    process.nextTick(function () {
        callback(null);
    });
};
```
___
# License
Code is licensed under MIT
