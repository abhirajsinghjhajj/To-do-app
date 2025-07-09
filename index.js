function toggleForm(form) {
  document.getElementById('login-form').style.display = form === 'login' ? 'block' : 'none';
  document.getElementById('signup-form').style.display = form === 'signup' ? 'block' : 'none';
}

function showTodoSection() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('signup-form').style.display = 'none';
  document.getElementById('todo-app').style.display = 'block';
  loadTodos();
}

function signup() {
  const username = document.getElementById('signup-username').value.trim();
  const password = document.getElementById('signup-password').value.trim();
  if (!username || !password) {
    alert('Please enter both username and password');
    return;
  }
  if (username.length < 3 || password.length < 6) {
    alert('Username must be at least 3 characters and password at least 6 characters');
    return;
  }
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users[username.toLowerCase()]) {
    alert('Username already exists');
    return;
  }
  users[username.toLowerCase()] = password; // Store plain text for simplicity (not secure for production)
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', username.toLowerCase());
  alert('Signup successful! You are now logged in.');
  showTodoSection();
}

function login() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();
  if (!username || !password) {
    alert('Please enter both username and password');
    return;
  }
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users[username.toLowerCase()] && users[username.toLowerCase()] === password) {
    localStorage.setItem('currentUser', username.toLowerCase());
    showTodoSection();
  } else {
    alert('Invalid credentials');
  }
}

function logout() {
  localStorage.removeItem('currentUser');
  document.getElementById('todo-app').style.display = 'none';
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
}

function loadTodos() {
  const username = localStorage.getItem('currentUser');
  if (!username) {
    alert('Please log in to view todos');
    toggleForm('login');
    return;
  }
  const todos = JSON.parse(localStorage.getItem(`todos_${username}`) || '{"active":[],"completed":[]}');
  const todoList = document.getElementById('todo-list');
  const completedList = document.getElementById('completed-list');
  todoList.innerHTML = '';
  completedList.innerHTML = '';

  todos.active.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    const left = document.createElement('div');
    left.className = 'todo-left';
    const checkbox = document.createElement('span');
    checkbox.className = 'checkbox';
    checkbox.onclick = () => completeTodo(index, false);
    const text = document.createElement('span');
    text.innerText = item.task;
    left.appendChild(checkbox);
    left.appendChild(text);
    const right = document.createElement('div');
    right.className = 'todo-right';
    const delBtn = document.createElement('button');
    delBtn.innerHTML = '🗑️';
    delBtn.onclick = () => deleteTodo(index, false);
    right.appendChild(delBtn);
    li.appendChild(left);
    li.appendChild(right);
    todoList.appendChild(li);
  });

  todos.completed.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    const left = document.createElement('div');
    left.className = 'todo-left';
    const checkbox = document.createElement('span');
    checkbox.className = 'checkbox checked';
    const text = document.createElement('span');
    text.innerText = item.task;
    left.appendChild(checkbox);
    left.appendChild(text);
    const right = document.createElement('div');
    right.className = 'todo-right';
    const delBtn = document.createElement('button');
    delBtn.innerHTML = '🗑️';
    delBtn.onclick = () => deleteTodo(index, true);
    right.appendChild(delBtn);
    li.appendChild(left);
    li.appendChild(right);
    completedList.appendChild(li);
  });
}

function addTodo() {
  const username = localStorage.getItem('currentUser');
  if (!username) {
    alert('Please log in to add todos');
    toggleForm('login');
    return;
  }
  const input = document.getElementById('todo-input');
  const task = input.value.trim();
  if (task === '') {
    alert('Please enter a task');
    return;
  }
  const todos = JSON.parse(localStorage.getItem(`todos_${username}`) || '{"active":[],"completed":[]}');
  todos.active.push({ id: Date.now(), task });
  localStorage.setItem(`todos_${username}`, JSON.stringify(todos));
  input.value = '';
  loadTodos();
}

function deleteTodo(index, isCompleted) {
  const username = localStorage.getItem('currentUser');
  if (!username) return;
  const todos = JSON.parse(localStorage.getItem(`todos_${username}`) || '{"active":[],"completed":[]}');
  if (isCompleted) {
    todos.completed.splice(index, 1);
  } else {
    todos.active.splice(index, 1);
  }
  localStorage.setItem(`todos_${username}`, JSON.stringify(todos));
  loadTodos();
}

function completeTodo(index, isCompleted) {
  const username = localStorage.getItem('currentUser');
  if (!username) return;
  const todos = JSON.parse(localStorage.getItem(`todos_${username}`) || '{"active":[],"completed":[]}');
  if (!isCompleted) {
    const [task] = todos.active.splice(index, 1);
    todos.completed.push(task);
  }
  localStorage.setItem(`todos_${username}`, JSON.stringify(todos));
  loadTodos();
}