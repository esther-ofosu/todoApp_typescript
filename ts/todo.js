var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var body = document.body;
var newTodoInput = document.getElementById('new-todo-input');
var clearCompletedButton = document.getElementById('clear-completed');
var filterButtons = document.getElementsByClassName('filter-button');
var todoList = document.getElementById('todo-list');
var secondUl = document.getElementById('second-ul');
var itemsLeftButton = document.getElementById('items-left');
var todos = [];
var draggedIndex = null;
var saveData = function () {
    localStorage.setItem('todos', JSON.stringify(todos));
    showList();
    updateItemsCount();
};
var setTheme = function (name) {
    if (name === 'light-theme') {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
    }
    else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
    }
    localStorage.setItem('theme', name);
};
function filterTodoList(filter) {
    var todoItems = todoList.children;
    Array.from(todoItems).forEach(function (item) {
        var listItem = item; // Type assertion to HTMLElement
        listItem.style.display = 'list-item';
        if (filter === 'active' && listItem.classList.contains('completed')) {
            listItem.style.display = 'none';
        }
        else if (filter === 'completed' && !listItem.classList.contains('completed')) {
            listItem.style.display = 'none';
            secondUl.style.display = 'block';
        }
    });
}
var addTodoItem = function (todoText) {
    todos.push({
        id: Date.now(),
        title: todoText,
        completed: false,
    });
    saveData();
};
function showList() {
    todoList.innerHTML = todos.map(function (todo) { return "\n    <li id=\"item-".concat(todo.id, "\" class=\"li ").concat(todo.completed ? 'completed' : '', "\" draggable=\"true\">\n      <input onclick=\"toggleCompleted(").concat(todo.id, ")\" ").concat(todo.completed ? 'checked' : '', " type=\"checkbox\">\n      <span onclick=\"toggleCompleted(").concat(todo.id, ")\">").concat(todo.title, "</span>\n      <button onclick=\"deleteItem(").concat(todo.id, ")\" class=\"delete\"><img src=\"images/icon-cross.svg\" alt=\"cross icon\"></button>\n    </li>\n  "); }).join("");
}
var updateItemsCount = function () {
    var total = 0;
    todos.forEach(function (todoItem) {
        if (todoItem.completed === false) {
            total++;
        }
    });
    itemsLeftButton.textContent = "".concat(total, " items left");
};
newTodoInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && newTodoInput.value.trim() !== '') {
        event.preventDefault();
        addTodoItem(newTodoInput.value.trim());
        newTodoInput.value = '';
    }
});
clearCompletedButton.addEventListener('click', function () {
    todos = todos.filter(function (todoItem) { return todoItem.completed === false; });
    saveData();
});
Array.from(filterButtons).forEach(function (button) {
    button.addEventListener('click', function () {
        var filter = button.getAttribute('data-filter');
        filterTodoList(filter);
    });
});
function dragstartHandler(event) {
    var _a;
    var target = event.target;
    if (target instanceof HTMLElement) {
        var id_1 = target.id; // TypeScript knows 'id' is available
        // Rest of your code...
        draggedIndex = Array.from(todoList.children).findIndex(function (el) { return el.id === id_1; });
        // Add your additional logic for drag start if needed
        (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData('text/plain', id_1);
    }
}
todoList.addEventListener('dragstart', function (event) {
    draggedIndex = Array.from(todoList.children).findIndex(function (el) { return el.id === event.target.id; });
});
todoList.addEventListener('dragover', function (event) {
    event.preventDefault();
});
todoList.addEventListener('drop', function (event) {
    event.preventDefault();
    var target = event.target;
    if (target.classList.contains('li')) {
        var targetIndex = Array.from(todoList.children).findIndex(function (el) { return el.id === target.id; });
        if (draggedIndex !== null) {
            var temp = todos[draggedIndex];
            todos[draggedIndex] = todos[targetIndex];
            todos[targetIndex] = temp;
            saveData();
            draggedIndex = null;
        }
    }
});
todoList.addEventListener('dragenter', function (event) {
    var target = event.target;
    if (target.classList.contains('li')) {
        target.classList.add('drag-over');
    }
});
todoList.addEventListener('dragleave', function (event) {
    var target = event.target;
    if (target.classList.contains('li')) {
        target.classList.remove('drag-over');
    }
});
todoList.addEventListener('dragend', function () {
    var items = document.querySelectorAll('.li');
    items.forEach(function (item) {
        item.classList.remove('drag-over');
    });
});
// Function to get the element after which the dragged item should be inserted
function getDragAfterElement(container, y) {
    var draggableElements = __spreadArray([], container.querySelectorAll('li:not(.dragging)'), true);
    return draggableElements.reduce(function (closest, child) {
        var box = child.getBoundingClientRect();
        var offset = y - box.top - box.height / 2;
        if (offset > 0 && offset < closest.offset) {
            return { offset: offset, element: child };
        }
        else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
// Initial filtering of the todo list
filterTodoList('all');
// Add event listener for the new todo input
newTodoInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && newTodoInput.value.trim() !== '') {
        addTodoItem(newTodoInput.value.trim());
        newTodoInput.value = '';
    }
});
// Add event listener for the form checkbox
var formCheckbox = document.getElementById('form-checkbox');
formCheckbox.addEventListener('change', function () {
    if (formCheckbox.checked && newTodoInput.value.trim() !== '') {
        addTodoItem(newTodoInput.value.trim());
        newTodoInput.value = '';
    }
});
// Get all the filter buttons
// Add click event listener to each filter button
for (var i = 0; i < filterButtons.length; i++) {
    var button = filterButtons[i];
    button.addEventListener('click', function (e) {
        // Remove blue color from all filter buttons
        for (var j = 0; j < filterButtons.length; j++) {
            var btn = filterButtons[j];
            btn.style.color = '';
        }
        // Set blue color to the clicked filter button
        e.target.style.color = 'hsl(220, 98%, 61%)';
    });
}
console.log('end');
