// Declare variables for exporting to the app
let items = document.getElementById('items');

// Export storage function to have access to app local storage, set empty array if there is no data
exports.storage = JSON.parse(localStorage.getItem('hyperlink-manager')) || []

// Function for saving data into app's local storage
exports.save = () => {
  localStorage.setItem('hyperlink-manager', JSON.stringify(this.storage))
}

/**
 * Adding new elements to the app
 * @param {information about element which need to be added to html skeleton} item 
 * @param {checking if there is new element or it is elements from array which needs to be recreated} isNew 
 * define parameters and create div element for integration into application
 * If this is new element then push it inside storage variable and save new array to app's local storage
 */
exports.addItem = (item, isNew = false) => {
  let itemNode = document.createElement('div')
  itemNode.setAttribute('class', 'read-item')
  itemNode.innerHTML = `<img src="${item.screenshot}"><h3>${item.title}</h3>`

  items.appendChild(itemNode)

  if (isNew) {
    this.storage.push(item)
    this.save()
  }
}

// This function will start automaticaly and extract all elements from local storage if it exists
this.storage.map(item => {
  this.addItem(item)
})