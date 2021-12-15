const { ipcRenderer } = require('electron');
const items = require('./functions/items');

/**
 * Define required variables for application
 * @var modal required for control modal block of app
 * @var showModal required for show modal window when user request saving data
 * @var closeModal it is a button responsible for closing modal witouth saving the data
 * @var addItem a button used to call saving item procedure
 * @var itemUrl is a text input element from which data should be taken during saving procedure
 * @var search require for link filtering inside the app
 */
let modal = document.getElementById('modal');
let showModal = document.getElementById('show-modal');
let closeModal = document.getElementById('close-modal');
let addItem = document.getElementById('add-item');
let itemUrl = document.getElementById('url');
let search = document.getElementById('search');

// Open modal window from the menu
ipcRenderer.on('menu-show-modal', () => {
  showModal.click()
})

// Filter items whith shortcuts
ipcRenderer.on('menu-open-item', () => {
  items.open()
})

// Delete item from menu
ipcRenderer.on('menu-delete-item', () => {
  let selectedItem = items.getSelectedItem()
  items.deleteItem(selectedItem.index)
})

// Open item in browser
ipcRenderer.on('menu-open-item-native', () => {
  items.openNative()
})

// Shortcut for search items
ipcRenderer.on('menu-focus-search', () => {
  search.focus()
})

/**
 * Functions to working with modals 
 * @showModal is used to reenable modal window when user click coresponded data
 * @closeModal is used to reenable modal window when user click cancel button in modal window
 */
showModal.addEventListener("click", event => {
  modal.style.display = 'flex'
  itemUrl.focus()
})
closeModal.addEventListener('click', event => {
  modal.style.display = 'none'
  itemUrl.value = null
})

/**
 * Handle adding new items
 * @ipcRenderer required for sending data to the main process
 * @toggleModalButtons will do the work to conditionaly display and hide modal window
 */
 addItem.addEventListener('click', event => {
  if(itemUrl.value) {
    ipcRenderer.send('send-item', itemUrl.value)
    toggleModalButtons()
  }
})

/**
 * Listen when user type something into search field take the value and procede
 * make data array from each html element inside class 'read-item'
 * if element inner text match lookup value then conditionaly display or hide that element
 */
search.addEventListener('keyup', e => {
  Array.from(document.getElementsByClassName('read-item')).forEach(item => {
    let hasMatch = item.innerText.toLowerCase().includes(search.value)
    item.style.display = hasMatch ? 'flex' : 'none'
  })
})

// Keyboard arrow selection implementation
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    items.changeSelection(e.key)
  }
})

// Additional event for listening when user press Enter button
itemUrl.addEventListener('keyup', event => {
  if (event.key === 'Enter') addItem.click()
})

// A function for conditionaly enable and disable modal window
const toggleModalButtons = () => {
  if (addItem.disabled) {
    addItem.disabled = false
    addItem.style.opacity = 1
    addItem.innerText = 'Додати'
    closeModal.style.display = 'inline'
  } else {
    addItem.disabled = true
    addItem.style.opacity = .5
    addItem.innerText = 'Опрацювання...'
    closeModal.style.display = 'none'
  }
}

/**
 * IPC renderers block
 * @channel send-item-success is using for receiving processed data from the main process
 * when data received call function for toggling modal buttons
 * hide the modal itself and also input url field when completed
 */
ipcRenderer.on('send-item-success', (e, newItem) => {
  items.addItem(newItem, true)

  toggleModalButtons()

  modal.style.display = 'none'
  itemUrl.value = null
})