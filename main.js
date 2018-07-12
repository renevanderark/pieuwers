const {app, BrowserWindow} = require('electron')

  function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({fullscreen: true, autoHideMenuBar: true})

    // and load the index.html of the app.
    if (process.env.NODE_ENV === 'development') {
      win.loadURL(`file://${__dirname}/index.html`);
    } else {
      win.loadURL(`https://renevanderark.github.io/pieuwers/?${new Date().getTime()}`);
    }
  }

  app.on('ready', createWindow)
