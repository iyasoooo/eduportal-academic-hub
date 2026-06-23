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
 * Handles Authentication state, logins, and local session management
 */
function initAuth() {
    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app-container');
    
    const signinForm = document.getElementById('signin-form');
    
    const mockAdminBtn = document.getElementById('mock-admin-btn');
    const signoutBtn = document.getElementById('signout-btn');

    // Seed default credentials in localStorage if no database exists or needs update
    let users = [];
    let needsReset = false;
    const cachedUsers = localStorage.getItem('eduportal_users');
    if (cachedUsers) {
        try {
            const parsed = JSON.parse(cachedUsers);
            // Check if any of the new user accounts are missing or have outdated passwords
            const hasAdmin = parsed.some(u => u.username.toLowerCase() === 'admin' && u.password === '12345678' && u.name === 'Admin');
            const hasAzib = parsed.some(u => u.username.toLowerCase() === 'azib' && u.password === '12345678');
            const hasIlyas = parsed.some(u => u.username.toLowerCase() === 'ilyas' && u.password === '12345678');
            const hasIdham = parsed.some(u => u.username.toLowerCase() === 'idham' && u.password === '12345678');
            const hasSyah = parsed.some(u => u.username.toLowerCase() === 'syah' && u.password === '12345678');
            
            if (!hasAdmin || !hasAzib || !hasIlyas || !hasIdham || !hasSyah) {
                needsReset = true;
            }
        } catch (e) {
            needsReset = true;
        }
    }

    if (cachedUsers && !needsReset) {
        users = JSON.parse(cachedUsers);
    } else {
        users = [
            { username: 'admin', password: '12345678', name: 'Admin' },
            { username: 'azib', password: '12345678', name: 'AZIB SAFWAN BIN AHMAD SAKRI' },
            { username: 'ilyas', password: '12345678', name: 'MUHAMMAD ILYAS BIN MOHD ABDUL HAKIM' },
            { username: 'idham', password: '12345678', name: 'MUHAMMAD IDHAM BIN MUHAMMAD ZAINI' },
            { username: 'syah', password: '12345678', name: 'MUHAMMAD SYAH BIN RAZAK' }
        ];
        localStorage.setItem('eduportal_users', JSON.stringify(users));
        
        // Also force a logout if database reset is triggered so the user must sign in with new credentials
        localStorage.removeItem('eduportal_session');
    }


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
                localStorage.setItem('eduportal_session', JSON.stringify({ username: user.username.toLowerCase(), name: user.name }));
                loginUser(user);
            } else {
                errorDiv.textContent = 'Invalid username or password.';
            }
        });
    }


    // Mock Administrator Quick Bypass
    if (mockAdminBtn) {
        mockAdminBtn.addEventListener('click', () => {
            const database = JSON.parse(localStorage.getItem('eduportal_users')) || [];
            const adminUser = database.find(u => u.username.toLowerCase() === 'admin');
            if (adminUser) {
                localStorage.setItem('eduportal_session', JSON.stringify({ username: adminUser.username.toLowerCase(), name: adminUser.name }));
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

    const isAdmin = user.username.toLowerCase() === 'admin';
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
            if (targetTab === 'students' && (!session || session.username.toLowerCase() !== 'admin')) {
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
