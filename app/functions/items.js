// Declare variables for exporting to the app
let items = document.getElementById('items');

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
  document.getElementsByClassName('read-item selected')[0].classList.remove('selected')
  e.currentTarget.classList.add('selected')
}

/** 
 * If there is no elements in storage just return nothing
 * take selected item and select url parameter from the element
 */
exports.open = () => {
  if (!this.storage.length) return
  
  let selectedItem = document.getElementsByClassName('read-item selected')[0]
  let contentURL = selectedItem.dataset.url
}

/**
 * Change selection based on which arrow key (up or down) user press
 * Get currently selected element and depending which key was pressed, remove and apply selected class
 */
exports.changeSelection = (directionKey) => {
  let currentItem = document.getElementsByClassName('read-item selected')[0]
  // Handle up or down change
  if (directionKey === 'ArrowUp' && currentItem.previousElementSibling) {
    currentItem.classList.remove('selected')
    currentItem.previousElementSibling.classList.add('selected')
  } else if (directionKey === 'ArrowDown' && currentItem.nextElementSibling) {
    currentItem.classList.remove('selected')
    currentItem.nextElementSibling.classList.add('selected')
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

// This function will start automaticaly and extract all elements from local storage if it exists
this.storage.map(item => {
  this.addItem(item)
})