const path = require('path');
const { format: formatUrl } = require('url');
const { app, BrowserWindow } = require('electron');

const createWindow = () => {
  const browserWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      disableBlinkFeatures: 'Auxclick',
      webviewTag: false,
      enableWebSQL: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    width: 800,
    height: 600,
  });
  browserWindow.webContents.openDevTools();

  browserWindow.loadURL(
    formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true,
    })
  );

  browserWindow.webContents.on('render-process-gone', (err, det) => {
    console.log('It crashed!');
    console.log(err);
    app.quit();
  });

  // if (isDevelopment) {
  //   browserWindow.loadURL('http://localhost:19006');

  //   browserWindow.webContents.on('render-process-gone', (err, det) => {
  //     // console.log(err)
  //     // console.log(det)
  //     browserWindow.webContents.closeDevTools();
  //     browserWindow.reload();
  //     browserWindow.webContents.openDevTools();
  //   });

  //   browserWindow.webContents.on('devtools-opened', () => {
  //     browserWindow.focus();
  //     setImmediate(() => {
  //       browserWindow.focus();
  //     });
  //   });
  // } else {
   
  // }

  return browserWindow;
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
