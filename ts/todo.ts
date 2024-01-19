const body = document.body as HTMLElement;
const newTodoInput = document.getElementById('new-todo-input') as HTMLInputElement;
const clearCompletedButton = document.getElementById('clear-completed') as HTMLButtonElement;
const filterButtons = document.getElementsByClassName('filter-button') as HTMLCollectionOf<HTMLButtonElement>;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const secondUl = document.getElementById('second-ul') as HTMLUListElement;
const itemsLeftButton = document.getElementById('items-left') as HTMLButtonElement;

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

let todos: Todo[] = [];
let draggedIndex: number | null = null;

const saveData = () => {
  localStorage.setItem('todos', JSON.stringify(todos));
  showList();
  updateItemsCount();
};

const setTheme = (name: string) => {
  if (name === 'light-theme') {
    body.classList.add('light-theme');
    body.classList.remove('dark-theme');
  } else {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
  }

  localStorage.setItem('theme', name);
};

function filterTodoList(filter: string): void {
  const todoItems = todoList.children;
  Array.from(todoItems).forEach((item) => {
    const listItem = item as HTMLElement; // Type assertion to HTMLElement
    listItem.style.display = 'list-item';
    if (filter === 'active' && listItem.classList.contains('completed')) {
      listItem.style.display = 'none';
    } else if (filter === 'completed' && !listItem.classList.contains('completed')) {
      listItem.style.display = 'none';
      secondUl.style.display = 'block';
    }
  });
}


const addTodoItem = (todoText: string) => {
  todos.push({
    id: Date.now(),
    title: todoText,
    completed: false,
  });

  saveData();
};

function showList(): void {
  todoList.innerHTML = todos.map((todo) => `
    <li id="item-${todo.id}" class="li ${todo.completed ? 'completed' : ''}" draggable="true">
      <input onclick="toggleCompleted(${todo.id})" ${todo.completed ? 'checked' : ''} type="checkbox">
      <span onclick="toggleCompleted(${todo.id})">${todo.title}</span>
      <button onclick="deleteItem(${todo.id})" class="delete"><img src="images/icon-cross.svg" alt="cross icon"></button>
    </li>
  `).join("");
}

const updateItemsCount = () => {
  let total = 0;
  todos.forEach((todoItem) => {
    if (todoItem.completed === false) {
      total++;
    }
  });
  itemsLeftButton.textContent = `${total} items left`;
};


newTodoInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && newTodoInput.value.trim() !== '') {
    event.preventDefault();
    addTodoItem(newTodoInput.value.trim());
    newTodoInput.value = '';
  }
});

clearCompletedButton.addEventListener('click', () => {
  todos = todos.filter((todoItem) => todoItem.completed === false);
  saveData();
});

Array.from(filterButtons).forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.getAttribute('data-filter');
    filterTodoList(filter);
  });
});


todoList.addEventListener('dragstart', (event) => {
  draggedIndex = Array.from(todoList.children).findIndex((el) => el.id === event.target.id);
});

todoList.addEventListener('dragover', (event) => {
  event.preventDefault();
});

todoList.addEventListener('drop', (event) => {
  event.preventDefault();
  const target = event.target as HTMLElement;
  if (target.classList.contains('li')) {
    const targetIndex = Array.from(todoList.children).findIndex((el) => el.id === target.id);
    if (draggedIndex !== null) {
      const temp = todos[draggedIndex];
      todos[draggedIndex] = todos[targetIndex];
      todos[targetIndex] = temp;

      saveData();

      draggedIndex = null;
    }
  }
});

todoList.addEventListener('dragenter', (event) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains('li')) {
    target.classList.add('drag-over');
  }
});

todoList.addEventListener('dragleave', (event) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains('li')) {
    target.classList.remove('drag-over');
  }
});

todoList.addEventListener('dragend', () => {
  const items = document.querySelectorAll('.li');
  items.forEach((item) => {
    item.classList.remove('drag-over');
  });
});

// Function to get the element after which the dragged item should be inserted
function getDragAfterElement(container: HTMLElement, y: number) {
  const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
  return draggableElements.reduce(function (closest, child) {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset > 0 && offset < closest.offset) {
      return { offset: offset, element: child };
    } else {
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
const formCheckbox = document.getElementById('form-checkbox') as HTMLInputElement;
formCheckbox.addEventListener('change', function () {
  if (formCheckbox.checked && newTodoInput.value.trim() !== '') {
    addTodoItem(newTodoInput.value.trim());
    newTodoInput.value = '';
  }
});

// Get all the filter buttons
// Add click event listener to each filter button
for (let i = 0; i < filterButtons.length; i++) {
  const button = filterButtons[i];
  button.addEventListener('click', (e) => {
    // Remove blue color from all filter buttons
    for (let j = 0; j < filterButtons.length; j++) {
      const btn = filterButtons[j];
      btn.style.color = '';
    }
    // Set blue color to the clicked filter button
    e.target.style.color = 'hsl(220, 98%, 61%)';
  });
}

console.log('end');

