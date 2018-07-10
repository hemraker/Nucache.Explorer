'use strict';
const {app, BrowserWindow} = require('electron');
const path = require('path');
const process = require('child_process');

// Live reload magic
require('electron-reload')(__dirname);

//Our Application Menu Items & logic
require('./app-menu');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win = BrowserWindow;

let apiProcess = process.spawn;


function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800, 
    height: 600,
    center: true,
    show: false
  });

  // and load the index.html of the app.
  win.loadFile('index.html');
  
  win.once('ready-to-show', () => {
    let currentTitle = win.getTitle();
    win.setTitle(`${currentTitle} - Version ${app.getVersion()}`);
    win.show();
  });

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.once('ready', () => {
  let apipath = path.join(__dirname, '..\\Nucache.Explorer.Server\\bin\\debug\\Nucache.Explorer.Server.exe');
  apiProcess = process.spawn(apipath);

  apiProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
  });

  apiProcess.stderr.on('data', (data) => {
    console.log(`sterr: ${data}`);
  });

  apiProcess.on('error', (err) => {
    console.log('General error', err);
  });

  apiProcess.on('close', (code) => {
    console.log('close code', code);
  });

  //Create Window
  createWindow();

});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
})

  
app.on('quit', () => {
  apiProcess.kill();
});

  
  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.