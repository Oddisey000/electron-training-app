const { shell } = require('electron');
const fs = require('fs');

// Declare variables for exporting to the app
let items = document.getElementById('items');

/**
 * Make separate file to controll newly opened windows behavior
 * declare constant and asign to it value from external js file
 */
let reader;
fs.readFile(`${__dirname}/reader.js`, (error, respond) => {
  reader = respond.toString()
})

/**
 * Get information of opened item
 * Define selected item to working with
 * Clean while solution to identify index of currently selected item
 * Return object with currently selected item and they index
 */
 exports.getSelectedItem = () => {
  let selectedItem = document.getElementsByClassName('read-item selected')[0]
  let itemIndex = 0
  let child = selectedItem

  while ((child = child.previousElementSibling) != null ) itemIndex++

  return { node: selectedItem, index: itemIndex }
}

// Export storage function to have access to app local storage, set empty array if there is no data
exports.storage = JSON.parse(localStorage.getItem('hyperlink-manager')) || []

// Function for saving data into app's local storage
exports.save = () => {
  localStorage.setItem('hyperlink-manager', JSON.stringify(this.storage))
}

/**
 * This function will apply selected class to the element on which user click
 * Firstly remove selected class from each element and apply it to currently selected on
 */
exports.select = (e) => {
  this.getSelectedItem().node.classList.remove('selected')
  e.currentTarget.classList.add('selected')
}

/**
 * If there is no elements in storage just return nothing
 * take selected item and select url parameter from the element
 * open item in proxy BrowserWindow
 */
exports.open = () => {
  if (!this.storage.length) return
  
  let selectedItem = this.getSelectedItem()
  let contentURL = selectedItem.node.dataset.url

  let renderWindow = window.open(
    contentURL,
    '', 
    `
      maxWidth=2000,
      maxHeigth=2000,
      width=1200,
      heigth=800,
      backgroundColor=#DEDEDE,
      nodeIntegration=0,
      contextIsolation=1
    `
  )
  renderWindow.eval(reader.replace('{{index}}', selectedItem.index))
}

// Open items in native system web browser
exports.openNative = () => {
  if (!this.storage.length) return
  
  let selectedItem = this.getSelectedItem()
  let contentURL = selectedItem.node.dataset.url

  shell.openExternal(contentURL)
}

/**
 * This function will work for item deletion
 * Check if remote window response with predefined 'delete-reader-item'
 * Call delete item function and close remote window immediately
 */
window.addEventListener('message', (e) => {
  if (e.data.action === 'delete-reader-item') {
    this.deleteItem(e.data.itemIndex)
    e.source.close()
  }
})

/**
 * Change selection based on which arrow key (up or down) user press
 * Get currently selected element and depending which key was pressed, remove and apply selected class
 */
exports.changeSelection = (directionKey) => {
  let currentItem = this.getSelectedItem()
  // Handle up or down change
  if (directionKey === 'ArrowUp' && currentItem.node.previousElementSibling) {
    currentItem.node.classList.remove('selected')
    currentItem.node.previousElementSibling.classList.add('selected')
  } else if (directionKey === 'ArrowDown' && currentItem.node.nextElementSibling) {
    currentItem.node.classList.remove('selected')
    currentItem.node.nextElementSibling.classList.add('selected')
  }
}

/**
 * Adding new elements to the app
 * @param {information about element which need to be added to html skeleton} item 
 * @param {checking if there is new element or it is elements from array which needs to be recreated} isNew 
 * define parameters and create div element for integration into application
 * set data URL into element atribute for further reading
 * adding event listener for double click on the element
 * for each item add event listener, require for correctly selected element from the list
 * If this is new element then push it inside storage variable and save new array to app's local storage
 * make first element on the list selected when data was loaded
 */
exports.addItem = (item, isNew = false) => {
  let itemNode = document.createElement('div')
  itemNode.setAttribute('class', 'read-item')
  itemNode.setAttribute('data-url', item.url)
  itemNode.innerHTML = `<img src="${item.screenshot}"><h3>${item.title}</h3>`
  
  itemNode.addEventListener('click', this.select)
  itemNode.addEventListener('dblclick', this.open)

  items.appendChild(itemNode)

  if (isNew) {
    this.storage.push(item)
    this.save()
  }

  if (document.getElementsByClassName('read-item').length === 1) {
    itemNode.classList.add('selected')
  }
}

// This function will delete element, when user click close button on remote window
exports.deleteItem = (elementIndex) => {
  // Remove item from DOM
  items.removeChild(items.childNodes[elementIndex])
  // Remove item from local storage as well
  this.storage.splice(elementIndex, 1)
  this.save()

  // Select previous or next item after current was deleted
  if (this.storage.length) {
    // Define previous or next element in the array
    let newSelectedItemIndex = (elementIndex === 0) ? 0 : elementIndex -1;
    // Select that item
    document.getElementsByClassName('read-item')[newSelectedItemIndex].classList.add('selected')
  }
}

// This function will start automaticaly and extract all elements from local storage if it exists
this.storage.map(item => {
  this.addItem(item)
})