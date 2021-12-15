const { Menu, shell } = require('electron');

// Building application menu and exporting it
// Empty array is good for hiding all standard elements of window
module.exports = (appWindow) => {
  let exportTemplate = [
    {
      label: 'Items',
      submenu: [
        {
          label: "Add New",
          accelerator: "CmdOrCtrl+O",
          click: () => {
            appWindow.send('menu-show-modal')
          }
        },
        {
          label: "Read item",
          accelerator: "CmdOrCtrl+Enter",
          click: () => {
            appWindow.send('menu-open-item')
          }
        },
        {
          label: "Delete item",
          accelerator: "CmdOrCtrl+Backspace",
          click: () => {
            appWindow.send('menu-delete-item')
          }
        },
        {
          label: "Open in Browser",
          accelerator: "CmdOrCtrl+Shift+Enter",
          click: () => {
            appWindow.send('menu-open-item-native')
          }
        },
        {
          label: "Search Items",
          accelerator: "CmdOrCtrl+S",
          click: () => {
            appWindow.send('menu-focus-search')
          }
        }
      ]
    },
    {
      role: 'editMenu'
    },
    {
      role: 'windowMenu'
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn more',
          click: () => {
            shell.openExternal('https://github.com/Oddisey000/electron-training-app')
          }
        }
      ]
    }
  ]

  // Additional settings for Apple Macintosh
  if (process.platform === 'darwin') {
    exportTemplate.unshift({ role: 'appMenu' })
  }

  let menu = Menu.buildFromTemplate(exportTemplate)
  Menu.setApplicationMenu(menu)
}