/* ==========================================================================
   EduPortal Core Application Orchestration, Routing & Auth
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initRouter();
    initCurrentDate();
    
    // Initialize specific modules
    if (typeof initPortfolio === 'function') initPortfolio();
    if (typeof initStudentManager === 'function') initStudentManager();
    if (typeof initTodoManager === 'function') initTodoManager();
});

/**
 * Handles Authentication state, logins, signups, and local session management
 */
function initAuth() {
    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app-container');
    
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    
    const authTabButtons = document.querySelectorAll('.auth-tab-btn');
    const authForms = document.querySelectorAll('.auth-form');
    
    const mockAdminBtn = document.getElementById('mock-admin-btn');
    const signoutBtn = document.getElementById('signout-btn');

    // Seed default admin credentials in localStorage if no database exists
    let users = [];
    const cachedUsers = localStorage.getItem('eduportal_users');
    if (cachedUsers) {
        users = JSON.parse(cachedUsers);
    } else {
        users = [
            { username: 'admin', password: 'admin123', name: 'Ahmad Danish (Admin)' }
        ];
        localStorage.setItem('eduportal_users', JSON.stringify(users));
    }

    // Auth Tab Switching
    authTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-auth-tab');
            authTabButtons.forEach(b => b.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${targetTab}-form`).classList.add('active');
            
            // Clear prior errors
            document.getElementById('signin-error').textContent = '';
            document.getElementById('signup-error').textContent = '';
            document.getElementById('signup-success').textContent = '';
        });
    });

    // Sign In Event Handler
    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById('signin-username').value.trim();
            const passwordInput = document.getElementById('signin-password').value;
            const errorDiv = document.getElementById('signin-error');

            const database = JSON.parse(localStorage.getItem('eduportal_users')) || [];
            const user = database.find(u => u.username.toLowerCase() === usernameInput.toLowerCase() && u.password === passwordInput);

            if (user) {
                // Save active session
                localStorage.setItem('eduportal_session', JSON.stringify({ username: user.username, name: user.name }));
                loginUser(user);
            } else {
                errorDiv.textContent = 'Invalid username or password.';
            }
        });
    }

    // Sign Up Event Handler
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('signup-name').value.trim();
            const usernameInput = document.getElementById('signup-username').value.trim();
            const passwordInput = document.getElementById('signup-password').value;
            const errorDiv = document.getElementById('signup-error');
            const successDiv = document.getElementById('signup-success');

            errorDiv.textContent = '';
            successDiv.textContent = '';

            const database = JSON.parse(localStorage.getItem('eduportal_users')) || [];
            const userExists = database.some(u => u.username.toLowerCase() === usernameInput.toLowerCase());

            if (userExists) {
                errorDiv.textContent = 'Username is already taken.';
                return;
            }

            // Save new user profile
            const newUser = { username: usernameInput, password: passwordInput, name: nameInput };
            database.push(newUser);
            localStorage.setItem('eduportal_users', JSON.stringify(database));

            successDiv.textContent = 'Registration successful! Redirecting to Sign In...';
            signupForm.reset();

            // Auto switch back to sign-in tab after a short delay
            setTimeout(() => {
                const signinTabBtn = document.querySelector('[data-auth-tab="signin"]');
                if (signinTabBtn) signinTabBtn.click();
            }, 1500);
        });
    }

    // Mock Administrator Quick Bypass
    if (mockAdminBtn) {
        mockAdminBtn.addEventListener('click', () => {
            const database = JSON.parse(localStorage.getItem('eduportal_users')) || [];
            const adminUser = database.find(u => u.username === 'admin');
            if (adminUser) {
                localStorage.setItem('eduportal_session', JSON.stringify({ username: adminUser.username, name: adminUser.name }));
                loginUser(adminUser);
            }
        });
    }

    // Sign Out Event Handler
    if (signoutBtn) {
        signoutBtn.addEventListener('click', () => {
            localStorage.removeItem('eduportal_session');
            authContainer.style.display = 'flex';
            appContainer.style.display = 'none';
        });
    }

    // Check active session on initial page load
    const currentSession = localStorage.getItem('eduportal_session');
    if (currentSession) {
        loginUser(JSON.parse(currentSession));
    } else {
        authContainer.style.display = 'flex';
        appContainer.style.display = 'none';
    }
}

/**
 * Transitions interface state to logged in, updating the sidebar badges
 */
function loginUser(user) {
    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app-container');
    
    // Update badge details
    const displayName = document.getElementById('user-display-name');
    const displayAvatar = document.getElementById('user-avatar');
    const displayRole = document.getElementById('user-display-role');

    const isAdmin = user.username === 'admin';
    if (displayName) displayName.textContent = user.name;
    if (displayRole) displayRole.textContent = isAdmin ? 'Faculty Admin' : 'Student';
    
    if (displayAvatar) {
        // Grab first initials of name
        const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        displayAvatar.textContent = initials;
    }

    // Toggle container views
    authContainer.style.display = 'none';
    appContainer.style.display = 'flex';

    // RBAC: Show/Hide Student Registry based on Admin status
    const studentMenuItem = document.querySelector('.menu-item[data-tab="students"]');
    if (studentMenuItem) {
        studentMenuItem.style.display = isAdmin ? 'flex' : 'none';
    }

    // Reset view to Faculty Directory to prevent leaking view states
    const portfolioTab = document.querySelector('.menu-item[data-tab="portfolio"]');
    if (portfolioTab) {
        portfolioTab.click();
    }

    // Dynamic data rendering based on user role/session
    if (typeof loadTodos === 'function') loadTodos();
    if (typeof renderTodos === 'function') renderTodos();
    if (typeof initPortfolio === 'function') initPortfolio();
    if (typeof initStudentManager === 'function') initStudentManager();
}

/**
 * Handles Sidebar Tab Navigation and Routing
 */
function initRouter() {
    const menuItems = document.querySelectorAll('.menu-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    
    const tabDetails = {
        portfolio: {
            title: 'Faculty Directory',
            subtitle: 'Meet the academic coordinators and system administrators managing this portal.'
        },
        students: {
            title: 'Student Registry',
            subtitle: 'Manage student academic enrollment files and active class states.'
        },
        todo: {
            title: 'Academic Tasks',
            subtitle: 'Audit and track upcoming department milestones, syllabus reviews, and grading cycles.'
        }
    };

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetTab = item.getAttribute('data-tab');
            if (!targetTab) return;

            // RBAC Routing Guard: Only Admins can access Student Registry
            const session = JSON.parse(localStorage.getItem('eduportal_session'));
            if (targetTab === 'students' && (!session || session.username !== 'admin')) {
                return; // Silently reject navigation
            }

            // Remove active classes
            menuItems.forEach(mi => mi.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));

            // Add active classes
            item.classList.add('active');
            const targetSection = document.getElementById(`tab-${targetTab}`);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Update Header Information dynamically
            if (tabDetails[targetTab]) {
                pageTitle.textContent = tabDetails[targetTab].title;
                pageSubtitle.textContent = tabDetails[targetTab].subtitle;
            }
        });
    });
}

/**
 * Updates top-bar header date widget dynamically
 */
function initCurrentDate() {
    const dateElement = document.getElementById('current-date');
    if (!dateElement) return;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    dateElement.textContent = today.toLocaleDateString('en-US', options);
}

/**
 * Global utility helpers for Modals
 */
const ModalHelper = {
    open(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling background
        }
    },
    close(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = ''; // Restore scroll
        }
    }
};

// Expose modal helpers globally for module access
window.ModalHelper = ModalHelper;
