/* ==========================================================================
   Feature Module: Academic Task Tracker (LocalStorage State)
   ========================================================================== */

let todos = [];
let currentFilter = 'all';

// Default academic administration tasks for EduPortal dashboard
const defaultTodos = [
    { id: 'todo-1', title: 'Audit student registry records and active admission statuses', priority: 'high', completed: true },
    { id: 'todo-2', title: 'Review Course Learning Outcomes (CLO) mappings for ARC4213', priority: 'high', completed: true },
    { id: 'todo-3', title: 'Configure GitHub deployment pipeline webhooks', priority: 'medium', completed: false },
    { id: 'todo-4', title: 'Deploy main builds onto Netlify / Vercel Edge platforms', priority: 'medium', completed: false },
    { id: 'todo-5', title: 'Draft individual reflections and compile the 5-page Group Report', priority: 'high', completed: false },
    { id: 'todo-6', title: 'Conduct compliance checks on system security policies', priority: 'low', completed: false }
];

function initTodoManager() {
    loadTodos();
    setupTodoEventListeners();
    renderTodos();
}

/**
 * Load task checklist from local storage cache
 */
function loadTodos() {
    const data = localStorage.getItem('cloudlab_todos');
    if (data) {
        todos = JSON.parse(data);
    } else {
        todos = [...defaultTodos];
        saveTodos();
    }
}

/**
 * Save checklist modifications to local storage cache
 */
function saveTodos() {
    localStorage.setItem('cloudlab_todos', JSON.stringify(todos));
    updateTodoProgress();
}

/**
 * Updates progress bar metrics
 */
function updateTodoProgress() {
    const progressFill = document.getElementById('todo-progress-fill');
    const percentageLabel = document.getElementById('todo-progress-percentage');
    const ratioLabel = document.getElementById('todo-progress-ratio');

    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    if (progressFill) progressFill.style.width = `${percentage}%`;
    if (percentageLabel) percentageLabel.textContent = `${percentage}% Complete`;
    if (ratioLabel) ratioLabel.textContent = `${completed}/${total} Tasks`;
}

/**
 * Setup Event Listeners for todo controls
 */
function setupTodoEventListeners() {
    const form = document.getElementById('add-task-form');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Add Task
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            addNewTodo();
        });
    }

    // Filter Navigation Click Triggers
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter') || 'all';
            renderTodos();
        });
    });
}

/**
 * Creates new task object and adds to checklist
 */
function addNewTodo() {
    const titleInput = document.getElementById('task-title-input');
    const prioritySelect = document.getElementById('task-priority-input');

    if (!titleInput || !prioritySelect) return;

    const newTodo = {
        id: 'todo-' + Date.now(),
        title: titleInput.value.trim(),
        priority: prioritySelect.value,
        completed: false
    };

    todos.unshift(newTodo); // Add to beginning of checklist
    saveTodos();
    renderTodos();

    // Reset Form Fields
    titleInput.value = '';
    prioritySelect.value = 'medium';
}

/**
 * Renders task items inside list container
 */
function renderTodos() {
    const container = document.getElementById('todo-list-container');
    const emptyState = document.getElementById('todo-empty-state');

    if (!container) return;

    // Filter items
    let filtered = todos;
    if (currentFilter === 'active') {
        filtered = todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filtered = todos.filter(t => t.completed);
    }

    // Toggle empty state visibility
    if (filtered.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';

        container.innerHTML = filtered.map(todo => `
            <div class="task-item ${todo.completed ? 'completed' : ''}" id="task-card-${todo.id}">
                <div class="task-item-left">
                    <label class="task-checkbox-wrapper">
                        <input type="checkbox" class="task-checkbox-input" 
                               ${todo.completed ? 'checked' : ''} 
                               onchange="toggleTodoStatus('${todo.id}')">
                    </label>
                    <span class="task-text">${todo.title}</span>
                </div>
                <div class="task-meta">
                    <span class="task-priority-badge priority-${todo.priority}">${todo.priority}</span>
                    <button onclick="deleteTodo('${todo.id}')" class="action-btn action-delete" title="Delete Task">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateTodoProgress();
}

/**
 * Toggle task completion status
 * Exposed to global scope for checkbox onchange hook
 */
function toggleTodoStatus(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        
        // Add complete transition visually before re-rendering
        const card = document.getElementById(`task-card-${id}`);
        if (card) {
            if (todo.completed) {
                card.classList.add('completed');
            } else {
                card.classList.remove('completed');
            }
        }
        
        // Timeout re-render slightly to preserve toggle visual feedback
        setTimeout(renderTodos, 250);
    }
}

/**
 * Removes task from array
 * Exposed to global scope for delete button onclick hook
 */
function deleteTodo(id) {
    const index = todos.findIndex(t => t.id === id);
    if (index !== -1) {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
    }
}

// Expose handlers globally
window.toggleTodoStatus = toggleTodoStatus;
window.deleteTodo = deleteTodo;
