// FRONT-END (CLIENT) JAVASCRIPT HERE
let editingID = null;

const renderTodos = function (todos) {
  const todobody = document.querySelector('#todo-body')
  todobody.innerHTML = ''

  todos.forEach(function (todo) {
    const row = document.createElement('tr')
    const deadlineDate = new Date(todo.deadline).toLocaleDateString()
    const createdDate = new Date(todo.created).toLocaleDateString()

    if (todo.id === editingID) {
      row.innerHTML =
          `<td><input type='text' class='edit-task' value='${todo.task}'></td>
        <td>
          <select class='edit-priority'>
            <option value='low' ${todo.priority === 'low' ? 'selected' : ''}>Low</option>
            <option value='medium' ${todo.priority === 'medium' ? 'selected' : ''}>Medium</option>
            <option value='high' ${todo.priority === 'high' ? 'selected' : ''}>High</option>
          </select>
        </td>
        <td>${createdDate}</td>
        <td>${deadlineDate}</td>
        <td>
          <button class='save-btn' data-id='${todo.id}'>Save</button>
          <button class='cancel-btn'>Cancel</button>
        </td>`
    }
    else {
      row.innerHTML =
          `<td>${todo.task}</td>
        <td class='priority-${todo.priority}'>${todo.priority}</td>
        <td>${createdDate}</td>
        <td>${deadlineDate}</td>
        <td>
          <button class='edit-btn' data-id='${todo.id}'>Edit</button>
          <button class='delete-btn' data-id='${todo.id}'>Delete</button>
        </td>`
    }
    todobody.appendChild(row)
  })

  document.querySelectorAll('.edit-btn').forEach(function (btn) {
    btn.onclick = () => {
      editingID = Number(btn.dataset.id)
      loadTodos()
    }
  })

  document.querySelectorAll('.cancel-btn').forEach(function (btn) {
    btn.onclick = () => {
      editingID = null
      loadTodos()
    }
  })

  document.querySelectorAll( '.delete-btn' ).forEach( function( btn ) {
    btn.onclick = () => deleteTodo( Number( btn.dataset.id ) )
  })

  document.querySelectorAll('.save-btn').forEach(function (btn) {
    btn.onclick = () => saveTodo(Number(btn.dataset.id))
  })
}

const loadTodos = async function () {
  const response = await fetch('/api/todos')
  const todos = await response.json()
  renderTodos(todos)
}

const addTodo = async function () {
  event.preventDefault()

  const task = document.querySelector('#task').value,
      priority = document.querySelector('#priority').value

  const response = await fetch('/add', {
    method: 'POST',
    body: JSON.stringify({task, priority})
  })

  const updatedTodos = await response.json()
  renderTodos(updatedTodos)

  document.querySelector('#task').value = ''
}


const deleteTodo = async function (id) {
  const response = await fetch('/delete', {
    method: 'POST',
    body: JSON.stringify({id})
  })

  const updatedTodos = await response.json()
  renderTodos(updatedTodos)
}

const saveTodo = async function (id) {
  const task = document.querySelector('.edit-task').value,
      priority = document.querySelector('.edit-priority').value

  const response = await fetch('/update', {
    method: 'POST',
    body: JSON.stringify({id, task, priority})
  })

  const updatedTodos = await response.json()
  editingID = null
  renderTodos(updatedTodos)
}

window.onload = function() {
  document.querySelector( '#todo-form' ).onsubmit = addTodo
  loadTodos()

}