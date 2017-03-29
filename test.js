process.env.DEBUG = 'nightmare*,electron*';

const Renderer = require("./index");

const filter = {
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
};

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
  filter
});

const async = require("async");

const options = [
  { url: 'https://github.com' },
  { url: 'https://github.com' },
  { url: 'https://github.com' },
  { url: 'https://github.com' },
  { url: 'https://github.com' },
  { url: 'https://github.com' },
  { url: 'https://github.com' },
  { url: 'https://github.com' },
  { url: 'https://github.com' }
];

async.each(
  options,
  (option, cb) =>
    renderer.render(option, function(err, html) {
      if (err) return cb(err);

      console.log(html[0].replace(/\n/g, "").substr(0, 79) + "…");
      return cb()
    }),
  err => {
    if (err) {
      console.error(err);
    }
    console.log("Done!");
    renderer.close();
  });
