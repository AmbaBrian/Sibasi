
    // DOM Elements
    const loginPage = document.querySelector('.login-page');
    const dashboardPage = document.querySelector('.dashboard-page');
    const homePage = document.querySelector('.home-page');
    const cardsPage = document.querySelector('.cards-page');
    const homeLink = document.getElementById('homeLink');
    const cardsLink = document.getElementById('cardsLink');
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    const todoInput = document.getElementById('todoInput');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoList = document.getElementById('todoList');
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    const dontAskAgain = document.getElementById('dontAskAgain');
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    
    // Variables
    let currentTaskIndex = null;
    let dontAskAgainChecked = false;
    
    // Validation functions
    function validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(emailInput.value);
        
        if (!isValid) {
            emailInput.classList.add('is-invalid');
        } else {
            emailInput.classList.remove('is-invalid');
            emailInput.classList.add('is-valid');
        }
        
        return isValid;
    }
    
    function validatePassword() {
        const isValid = passwordInput.value.length >= 8;
        
        if (!isValid) {
            passwordInput.classList.add('is-invalid');
        } else {
            passwordInput.classList.remove('is-invalid');
            passwordInput.classList.add('is-valid');
        }
        
        return isValid;
    }
    
    function validateForm() {
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        
        loginButton.disabled = !(isEmailValid && isPasswordValid);
    }
    
    // Event Listeners for validation
    emailInput.addEventListener('input', validateForm);
    passwordInput.addEventListener('input', validateForm);
    
    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        loginButton.innerHTML = `
            <span class="d-flex align-items-center justify-content-center">
            <span>Signing in</span>
            <div class="spinner-border spinner-border-sm ms-2" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            </span>
        `;
        loginButton.disabled = true;
        
        // Simulate loading for 1 second
        setTimeout(() => {
            // Transition to dashboard
            loginPage.classList.add('hidden');
            dashboardPage.classList.remove('hidden');
            homePage.classList.remove('hidden');
            cardsPage.classList.add('hidden');
            
            // Reset form and button
            loginForm.reset();
            loginButton.innerHTML = `
            <span class="d-flex align-items-center justify-content-center">
                <span>Sign In</span>
                <i class="bi bi-arrow-right ms-2"></i>
            </span>
            `;
            loginButton.disabled = false;
            
            // Add some sample tasks
            addSampleTasks();
        }, 1000);
    });
    
    // Navigation Links
    homeLink.addEventListener('click', function(e) {
        e.preventDefault();
        homePage.classList.remove('hidden');
        cardsPage.classList.add('hidden');
        homeLink.classList.add('active');
        cardsLink.classList.remove('active');
    });
    
    cardsLink.addEventListener('click', function(e) {
        e.preventDefault();
        homePage.classList.add('hidden');
        cardsPage.classList.remove('hidden');
        homeLink.classList.remove('active');
        cardsLink.classList.add('active');
    });
    
    // Todo List Functionality
    function addSampleTasks() {
        const sampleTasks = [
            'Complete project proposal',
            'Review meeting notes',
            'Send follow-up emails'
        ];
        
        sampleTasks.forEach(task => {
            addTask(task);
        });
    }
    
    function addTask(text) {
        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item';
        
        const todoText = document.createElement('div');
        todoText.className = 'todo-text';
        todoText.textContent = text;
        
        const todoActions = document.createElement('div');
        todoActions.className = 'todo-actions';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-outline-primary btn-sm';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.addEventListener('click', function() {
            editTask(todoItem);
        });
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-outline-danger btn-sm';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.addEventListener('click', function() {
            deleteTask(todoItem);
        });
        
        todoActions.appendChild(editBtn);
        todoActions.appendChild(deleteBtn);
        
        todoItem.appendChild(todoText);
        todoItem.appendChild(todoActions);
        
        todoList.appendChild(todoItem);
    }
    
    function editTask(todoItem) {
        const todoText = todoItem.querySelector('.todo-text');
        const todoActions = todoItem.querySelector('.todo-actions');
        
        if (todoItem.classList.contains('edit-mode')) {
            // Save edits
            todoItem.classList.remove('edit-mode');
            const input = todoText.querySelector('input');
            todoText.textContent = input.value;
            
            // Restore original buttons
            todoActions.innerHTML = '';
            
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-outline-primary btn-sm';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.addEventListener('click', function() {
                editTask(todoItem);
            });
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-outline-danger btn-sm';
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.addEventListener('click', function() {
                deleteTask(todoItem);
            });
            
            todoActions.appendChild(editBtn);
            todoActions.appendChild(deleteBtn);
        } else {
            // Enter edit mode
            todoItem.classList.add('edit-mode');
            const currentText = todoText.textContent;
            todoText.innerHTML = `<input type="text" class="form-control form-control-sm" value="${currentText}">`;
            
            // Replace with Update/Cancel buttons
            todoActions.innerHTML = '';
            
            const updateBtn = document.createElement('button');
            updateBtn.className = 'btn btn-outline-success btn-sm me-1';
            updateBtn.textContent = 'Update';
            updateBtn.addEventListener('click', function() {
                editTask(todoItem);
            });
            
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'btn btn-outline-secondary btn-sm';
            cancelBtn.textContent = 'Cancel';
            cancelBtn.addEventListener('click', function() {
                todoItem.classList.remove('edit-mode');
                todoText.textContent = currentText;
                
                // Restore original buttons
                todoActions.innerHTML = '';
                
                const editBtn = document.createElement('button');
                editBtn.className = 'btn btn-outline-primary btn-sm';
                editBtn.innerHTML = '<i class="fas fa-edit"></i>';
                editBtn.addEventListener('click', function() {
                    editTask(todoItem);
                });
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'btn btn-outline-danger btn-sm';
                deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
                deleteBtn.addEventListener('click', function() {
                    deleteTask(todoItem);
                });
                
                todoActions.appendChild(editBtn);
                todoActions.appendChild(deleteBtn);
            });
            
            todoActions.appendChild(updateBtn);
            todoActions.appendChild(cancelBtn);
            
            // Focus the input
            todoText.querySelector('input').focus();
        }
    }
    
    function deleteTask(todoItem) {
        if (dontAskAgainChecked) {
            // Delete without confirmation
            todoItem.remove();
        } else {
            // Show confirmation modal
            currentTaskIndex = Array.from(todoList.children).indexOf(todoItem);
            deleteModal.show();
        }
    }
    
    // Add new task button
    addTodoBtn.addEventListener('click', function() {
        const text = todoInput.value.trim();
        if (text) {
            addTask(text);
            todoInput.value = '';
        }
    });
    
    // Enter key on input
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const text = todoInput.value.trim();
            if (text) {
                addTask(text);
                todoInput.value = '';
            }
        }
    });
    
    // Confirm delete button
    confirmDeleteBtn.addEventListener('click', function() {
        const todoItems = todoList.querySelectorAll('.todo-item');
        if (currentTaskIndex !== null && todoItems[currentTaskIndex]) {
            todoItems[currentTaskIndex].remove();
        }
        
        // Update don't ask again preference
        dontAskAgainChecked = dontAskAgain.checked;
        
        deleteModal.hide();
    });