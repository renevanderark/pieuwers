const {app, BrowserWindow} = require('electron')

  function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({fullscreen: true, autoHideMenuBar: true})

    // and load the index.html of the app.
    win.loadURL("https://renevanderark.github.io/pieuwers/")
  }

  app.on('ready', createWindow)
