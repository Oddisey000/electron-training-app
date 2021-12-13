const { BrowserWindow } = require('electron');

let offscreenWindow;

/**
 * Module will create data object based on provided information
 * @param {address provided by user} url
 * @param {data which will be given back to user when processed} callback
 * Create offscreen window with predefined parameters for taking screenshots
 * when content are completly loaded get required information
 * send processed information back to user
 * close offscreen window and set it value to nothing to prevent any possible glitches in the future
 */
module.exports = (url, callback) => {
  offscreenWindow = new BrowserWindow({
    width: 500,
    height: 500,
    show: false,
    webPreferences: {
      offscreen: true
    }
  })

  offscreenWindow.loadURL(url)

  offscreenWindow.webContents.on('did-finish-load', e => {
    let title = offscreenWindow.getTitle()
    offscreenWindow.webContents.capturePage().then(image => {
      let screenshot = image.toDataURL()
      callback({ title, screenshot, url })
      offscreenWindow.close()
      offscreenWindow = null
    })
  })
}