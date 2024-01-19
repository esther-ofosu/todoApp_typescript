// Getting necessary DOM elements
const todoList = document.getElementById('todo-list');
const newTodoInput = document.getElementById('new-todo-input');
const itemsLeftButton = document.getElementById('items-left');
const clearCompletedButton = document.getElementById('clear-completed');
const filterButtons = document.getElementsByClassName('filter-button');
const secondUl = document.getElementById('second-ul');
let todos = [];
const savedData = localStorage.getItem('todos');
if (savedData) {
    todos = JSON.parse(savedData) || [];
}
// Save the todo list data in the local storage
function saveData() {
    localStorage.setItem('todos', JSON.stringify(todos));
    showList();
    updateItemsCount();
}
function toggleCompleted(id) {
    todos = todos.map((todoItem) => {
        return todoItem?.id === id ? { ...todoItem, completed: !todoItem.completed } : todoItem;
    });
    saveData();
}
function deleteItem(id) {
    todos = todos.filter((todoItem) => {
        return todoItem?.id !== id;
    });
    saveData();
}
function showList() {
    todoList.innerHTML = todos
        .map((todo) => `
        <li id="item-${todo.id}" class="li ${todo.completed ? 'completed' : ''}" draggable="true">
            <input onclick="toggleCompleted(${todo.id})" ${todo.completed ? 'checked' : ''} type="checkbox">
            <span  onclick="toggleCompleted(${todo.id})">${todo.title}</span>
            <button  onclick="deleteItem(${todo.id})" class="delete"><img src="images/icon-cross.svg" alt="cross icon"></button>
        </li>
    `)
        .join('');
}
// Add event listeners to save data when the list changes
todoList.addEventListener('click', saveData);
todoList.addEventListener('dragend', saveData);
// Add event listener to save data when the page is unloaded
window.addEventListener('load', function () {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    }
    updateItemsCount();
    showList();
});
// dark and light mode
const body = document.body;
const themeStyle = document.getElementById('theme-style');
const toggleIcon = document.getElementById('theme-toggle-icon');
function setTheme(name) {
    if (name === 'light-theme') {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
        themeStyle.href = 'css/light-theme.css';
        toggleIcon.src = 'images/icon-moon.svg';
    }
    else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        themeStyle.href = 'css/dark-theme.css';
        toggleIcon.src = 'images/icon-sun.svg';
    }
    localStorage.setItem('theme', name);
}
function toggleTheme() {
    if (body.classList.contains('dark-theme')) {
        setTheme('light-theme');
    }
    else {
        setTheme('dark-theme');
    }
}
// Creating a counter for keeping track of items left
// Adding event listener for the new todo input
newTodoInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && newTodoInput.value.trim() !== '') {
        event.preventDefault();
        addTodoItem(newTodoInput.value.trim());
        newTodoInput.value = '';
    }
});
// Function to add a new todo item
function addTodoItem(todoText) {
    todos.push({
        id: Date.now(),
        title: todoText,
        completed: false,
    });
    saveData();
}
// Add event listener for the clear completed button
clearCompletedButton.addEventListener('click', function () {
    todos = todos.filter(function (todoItem) {
        return todoItem.completed === false;
    });
    saveData();
});
// Add event listeners for the filter buttons
Array.from(filterButtons).forEach(function (button) {
    button.addEventListener('click', function () {
        const filter = button.getAttribute('data-filter');
        filterTodoList(filter);
    });
});
// Function to filter the todo list
function filterTodoList(filter) {
    const todoItems = todoList.children;
    Array.from(todoItems).forEach(function (item) {
        item.style.display = 'list-item';
        if (filter === 'active' && item.classList.contains('completed')) {
            item.style.display = 'none';
        }
        else if (filter === 'completed' && !item.classList.contains('completed')) {
            item.style.display = 'none';
            secondUl.style.display = 'block';
        }
    });
}
let draggedIndex = null;
console.log('start');
// Add drag and drop functionality to reorder items
// Add dragstart event listener to each todo item
todoList.addEventListener('dragstart', function (event) {
    draggedIndex = Array.from(todoList.children).findIndex((el, i) => el.id === event.target.id);
});
