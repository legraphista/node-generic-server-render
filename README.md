# generic-server-render
Render output html at an url.

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
const Renderer = require('generic-server-render');

// Full costumization
const renderer = new Renderer({
  poolSize: 2,
  width: 1000,
  height: 500,
  agent: 'My Awesome Renderer',
  nightmare: {
    webPreferences: {
      images: false
    },
    show: true,
    openDevTools: {
      mode: 'detach'
    }
  },
  filter: {
    options: {
      urls: ['*']
    },
    fn: function(details, cb) {
      //cancel a specific file

      const type = details.resourceType;
      const url = details.url;
      if (url.indexOf('chrome-devtools') === 0) return cb({ cancel: false });

      switch (type) {
        case "mainFrame" :
          return cb({ cancel: false });
        case "stylesheet":
          return cb({ cancel: true });
        case "script":
          return cb({ cancel: false });
        case "xhr":
          return cb({ cancel: true });
      }

      return cb({ cancel: true });
    }
  }
});

renderer.render(option, function(err, html) {
  if (err) {
      return console.error(err);
  }

  console.log(html[0].replace(/\n/g, "").substr(0, 79) + "…");
})

```
___
## Options
### New render instance

    [Optional]
        - width {Number} : width of the viewport
        - height {Number} : height of the viewport
        - poolSize {Number} : number of opened browsers
        - nightmare {Object} : extra nightmare options, see [nightmare documentation](https://github.com/segmentio/nightmare)
        - filter {Object} : filter requests, see [nightmare-load-filter documentation](https://github.com/rosshinkley/nightmare-load-filter)
            - options : {Object}
                - urls : String[]
            - fn : {function}

### Posting a render job

    [Options]
        - querySelector {String} : query to the the element(s) desired (default is 'html')
        - url {String} : website location
        - wait {String|Number|function} : wait for elemnt / time / function to be ready
        - jsAfter {function} : run a function in the context of the browser
        - jsAfterWait {String|Number|function} : wait for jsAfter for finish (if any)

    [Callback]
        - Error / null
        - String[]

___
# License
Code is licensed under MIT
