document.addEventListener('DOMContentLoaded', () => {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sortBtn = document.getElementById('sortBtn');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const prioritySelect = document.getElementById('prioritySelect');
    const totalTasks = document.getElementById('totalTasks');
    const completedTasks = document.getElementById('completedTasks');
    const incompleteTasks = document.getElementById('incompleteTasks');
    const taskModal = document.getElementById('taskModal');
    const editTaskInput = document.getElementById('editTaskInput');
    const saveChangesBtn = document.getElementById('saveChangesBtn');

    addTaskBtn.addEventListener('click', addTask);
    taskList.addEventListener('click', handleTaskActions);
    filterBtns.forEach(btn => btn.addEventListener('click', filterTasks));
    sortBtn.addEventListener('click', sortTasks);
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    saveChangesBtn.addEventListener('click', saveEditedTask);

    const jumbotron = document.querySelector('.jumbotron');
    jumbotron.classList.add('float');

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const task = {
                id: Date.now(),
                text: taskText,
                completed: false,
                priority: prioritySelect.value,
                dueDate: '' // Can be updated to include a due date
            };
            tasks.push(task);
            saveTasks();
            renderTasks();
            taskInput.value = '';
            updateSummary();
        }
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'completed' : ''}`;
            li.dataset.id = task.id;
            li.innerHTML = `
                <span>${task.text}</span>
                <div>
                    <button class="btn btn-sm btn-success mr-2" data-action="toggle">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button class="btn btn-sm btn-primary mr-2" data-action="edit">Edit</button>
                    <button class="btn btn-sm btn-danger" data-action="delete">Delete</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }

    function handleTaskActions(event) {
        if (event.target.dataset.action === 'toggle') {
            const taskId = event.target.closest('li').dataset.id;
            const taskIndex = tasks.findIndex(task => task.id === Number(taskId));
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            saveTasks();
            renderTasks();
            updateSummary();
        } else if (event.target.dataset.action === 'delete') {
            const taskId = event.target.closest('li').dataset.id;
            tasks = tasks.filter(task => task.id !== Number(taskId));
            saveTasks();
            renderTasks();
            updateSummary();
        } else if (event.target.dataset.action === 'edit') {
            const taskId = event.target.closest('li').dataset.id;
            const taskIndex = tasks.findIndex(task => task.id === Number(taskId));
            const taskText = tasks[taskIndex].text;
            editTaskInput.value = taskText;
            taskModal.dataset.taskId = taskId;
            $('#taskModal').modal('show');
        }
    }

    function saveEditedTask() {
        const taskId = taskModal.dataset.taskId;
        const taskIndex = tasks.findIndex(task => task.id === Number(taskId));
        const newText = editTaskInput.value.trim();
        if (newText !== '') {
            tasks[taskIndex].text = newText;
            $('#taskModal').modal('hide');
            saveTasks();
            renderTasks();
        }
    }

    function filterTasks(event) {
        const filter = event.target.dataset.filter;
        filterBtns.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        if (filter === 'completed') {
            const completedTasks = tasks.filter(task => task.completed);
            renderFilteredTasks(completedTasks);
        } else if (filter === 'incomplete') {
            const incompleteTasks = tasks.filter(task => !task.completed);
            renderFilteredTasks(incompleteTasks);
        } else {
            renderTasks();
        }
    }

    function renderFilteredTasks(filteredTasks) {
        taskList.innerHTML = '';
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'completed' : ''}`;
            li.dataset.id = task.id;
            li.innerHTML = `
                <span>${task.text}</span>
                <div>
                    <button class="btn btn-sm btn-success mr-2" data-action="toggle">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button class="btn btn-sm btn-primary mr-2" data-action="edit">Edit</button>
                    <button class="btn btn-sm btn-danger" data-action="delete">Delete</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }

    function sortTasks() {
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        saveTasks();
        renderTasks();
    }

    function clearCompletedTasks() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
        updateSummary();
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateSummary() {
        totalTasks.textContent = tasks.length;
        completedTasks.textContent = tasks.filter(task => task.completed).length;
        incompleteTasks.textContent = tasks.filter(task => !task.completed).length;
    }

    renderTasks();
    updateSummary();
});
