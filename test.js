var render = require("./index");
var ExampleMemoryCache = require("./cache/ExampleMemoryCache");
var cache = new ExampleMemoryCache();

var async = require("async");

async.waterfall([
  function(cb) {
    "use strict";

    console.time("Cold URL render");

    render({ url: "https://github.com", cache: cache }, function(err, html) {
      if (err) return console.error(err);
      console.timeEnd("Cold URL render");

      console.log(html[0].replace(/\n/g, "").substr(0, 79) + "…");
      setTimeout(function() {
        cb()
      }, 1000);
    });
  },
  function(cb) {
    "use strict";

    console.time("Cached URL render");

    render({ url: "https://github.com", cache: cache }, function(err, html) {
      if (err) return console.error(err);
      console.timeEnd("Cached URL render");

      console.log(html[0].replace(/\n/g, "").substr(0, 79) + "…");
      setTimeout(function() {
        cb()
      }, 1000);
    });
  },
  function(cb) {
    "use strict";
    console.time("Cold file render");

    render({ file: "test.html", cache: cache }, function(err, html) {
      if (err) return console.error(err);
      console.timeEnd("Cold file render");

      console.log(html[0].replace(/\n/g, "").substr(0, 79) + "…");
      setTimeout(function() {
        cb()
      }, 1000);
    });
  },
  function(cb) {
    "use strict";
    console.time("Cached file render");

    render({ file: "test.html", cache: cache }, function(err, html) {
      if (err) return console.error(err);
      console.timeEnd("Cached file render");

      console.log(html[0].replace(/\n/g, "").substr(0, 79) + "…");
      setTimeout(function() {
        cb()
      }, 1000);
    });
  },
  function(cb) {
    "use strict";
    console.time("Cold HTML render");

    render({ html: "<html><body>Hello World!</body></html>", cache: cache }, function(err, html) {
      if (err) return console.error(err);
      console.timeEnd("Cold HTML render");

      console.log(html[0].replace(/\n/g, "").substr(0, 79) + "…");
      setTimeout(function() {
        cb()
      }, 1000);
    });
  },
  function(cb) {
    "use strict";
    console.time("Cached HTML render");

    render({ html: "<html><body>Hello World!</body></html>", cache: cache }, function(err, html) {
      if (err) return console.error(err);
      console.timeEnd("Cached HTML render");

      console.log(html[0].replace(/\n/g, "").substr(0, 79) + "…");
      setTimeout(function() {
        cb()
      }, 1000);
    });
  },
  function(cb) {
    "use strict";
    console.time("QuerySelector HTML render");

    render({ html: "<html><body><p>Hello World!</p></body></html>", cache: cache, querySelector: 'p' }, function(err, html) {
      if (err) return console.error(err);
      console.timeEnd("QuerySelector HTML render");

      console.log(html[0], '=== <p>Hello World!</p>');
      setTimeout(function() {
        cb()
      }, 1000);
    });
  },
  function(cb) {
    "use strict";

    render({ html: '<html><head></head><body><script>document.write(\'test\');</script></body></html>' }, function(err, html) {
      if (html === '<html><head></head><body><script>document.write(\'test\');</script>test</body></html>') {
        console.log('Injected HTML is rendered properly');
      } else {
        console.error('Injected HTML does not render JS');
      }
    });
  }
], function() {
  "use strict";
  console.log("Done!");
});
