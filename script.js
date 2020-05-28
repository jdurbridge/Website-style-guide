// MODAL SCRIPT ------------------------------------------------------------


// VARIABLES //
const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')



// EVENT LISTENERS // 
openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })
})

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal')
        closeModal(modal)
    })
})

overlay.addEventListener('click', () => {
        const modals = document.querySelectorAll('.modal.active')
        modals.forEach(modal => {
        closeModal(modal)
    })
})

// FUNCTIONS // 
function openModal(modal) {
    if (modal == null) return
    modal.classList.add('active')
    overlay.classList.add('active')
}

function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
}







// ""VARIABLES"" JS data fetch
const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')

const listDisplayContainer = document.querySelector('[data-list-display-container]')
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')
const taskContainer = document.querySelector('[data-tasks]')

const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-Input]')
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]')



//local storage (uses keys)
const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem
(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)


// EVENT LISTENERS 

listsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.dataset.listId
        saveAndRender()
    }
})

taskContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedList = lists.find(list => list.id === selectedListId)
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
        selectedTask.complete = e.target.checked
        save()
        renderTaskCount(selectedList)
    }
})


clearCompleteTasksButton.addEventListener('click', e => {
        const selectedList = lists.find(list => list.id === selectedListId)
        selectedList.tasks = selectedList.tasks.filter(task => !task.complete) 
        saveAndRender()
})


deleteListButton.addEventListener('click', e => {
    lists = lists.filter(list => list.id !== selectedListId)
    selectedListId = null
    saveAndRender()
})



// Deals with new list item additions 
newListForm.addEventListener('submit', e => {
    e.preventDefault()
    const listName = newListInput.value
    if (listName == null || listName === '') return
    const list = createList(listName)
    newListInput.value = null
    lists.push(list)
    saveAndRender()
})

newTaskForm.addEventListener('submit', e => {
    e.preventDefault()
    const taskName = newTaskInput.value
    if (taskName == null || taskName === '') return
    const task = createTask(taskName)
    newTaskInput.value = null
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)
    saveAndRender()
})



// "" CREATE LIST FUNCTION "" gives us a new list with name typed into the input
function createList(name) {
   return { id: Date.now().toString(), name: name, tasks: [] 
    }
}

function createTask(name) {
    return { id: Date.now().toString(), name: name, complete: false }
}



// ""CALLS SAVE FUNCTION'' 
function saveAndRender() {
    save()
    render()
}

// "SAVE FUNCTION"
function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))   
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId) 
}


// "CLEAR & RENDER FUNCTION"" clears the list and then re-renders 
function render() {
    clearElement(listsContainer) 
    renderLists()

    const selectedList = lists.find(list => list.id === selectedListId)
    if (selectedListId == null) {
        listDisplayContainer.style.display = 'none'
    } else {
        listDisplayContainer.style.display = ''
        listTitleElement.innerText = selectedList.name
        renderTaskCount(selectedList)
        clearElement(taskContainer)
        renderTasks(selectedList)
    }

}


function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true)
        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        taskContainer.appendChild(taskElement)
    })
}


function renderTaskCount(selectedList) {
    const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
    listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`
}


function renderLists() {
    lists.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add("list-name")
        listElement.innerText = list.name
        if (list.id === selectedListId) {
            listElement.classList.add('active-list')
        }
        listsContainer.appendChild(listElement)
    })
}


// ""CLEAR ELEMENT FUNCTION"" clears the list in prep for JS laoded items
function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

// shows the list render function above
render()




