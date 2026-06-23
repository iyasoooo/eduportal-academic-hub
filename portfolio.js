/* ==========================================================================
   Feature Module: Faculty Directory & Profiles (LocalStorage State with RBAC)
   ========================================================================== */

/**
 * Group members directory database configuration (default values).
 */
const defaultGroupMembers = [
    {
        name: "Ahmad Danish bin Kamal",
        id: "D032310142",
        role: "Faculty Coordinator & Lead Cloud Architect",
        description: "Coordinated the GitHub system integration and web hook configurations. Oversees server continuous deployment metrics.",
        icon: "fi-rr-settings",
        github: "#",
        email: "danish.kamal@student.uptm.edu.my"
    },
    {
        name: "Nur Sarah binti Zamri",
        id: "D032310088",
        role: "Lead Academic Systems Designer",
        description: "Drafted user interfaces, interactive styles, responsive mobile wrappers, and dark glassmorphic layouts.",
        icon: "fi-rr-compass",
        github: "#",
        email: "sarah.zamri@student.uptm.edu.my"
    },
    {
        name: "Muhammad Haris bin Rostam",
        id: "D032310255",
        role: "Systems Database Specialist",
        description: "Programmed JavaScript dashboard state engines, registry query search indexes, and local storage database serialization.",
        icon: "fi-rr-database",
        github: "#",
        email: "haris.rostam@student.uptm.edu.my"
    },
    {
        name: "Siti Aminah binti Yusuf",
        id: "D032310119",
        role: "Academic Systems Auditor",
        description: "Executed security boundaries validation, cross-browser performance tests, and compiled compliance documentation reviews.",
        icon: "fi-rr-shield",
        github: "#",
        email: "aminah.yusuf@student.uptm.edu.my"
    }
];

// In-memory workspace cache of faculty database
let facultyList = [];

function initPortfolio() {
    loadFacultyData();
    setupFacultyEventListeners();
    renderPortfolio();
}

/**
 * Loads faculty list from local storage, seeding defaults if empty.
 * Also checks if the logged-in non-admin student needs a default profile card created.
 */
function loadFacultyData() {
    const cached = localStorage.getItem('eduportal_faculty');
    if (cached) {
        facultyList = JSON.parse(cached);
    } else {
        facultyList = [...defaultGroupMembers];
        localStorage.setItem('eduportal_faculty', JSON.stringify(facultyList));
    }

    // Auto-create own card for a new student user if it doesn't exist
    const session = JSON.parse(localStorage.getItem('eduportal_session'));
    if (session && session.username !== 'admin') {
        const hasOwnCard = facultyList.some(member => member.name.toLowerCase() === session.name.toLowerCase());
        if (!hasOwnCard) {
            facultyList.push({
                name: session.name,
                id: "Pending",
                role: "Student Coordinator",
                description: "Click edit to describe your academic contributions and profile information.",
                icon: "fi-rr-user",
                github: "#",
                email: session.username + "@student.uptm.edu.my"
            });
            localStorage.setItem('eduportal_faculty', JSON.stringify(facultyList));
        }
    }
}

/**
 * Dynamically builds and injects faculty profile cards into grid
 */
function renderPortfolio() {
    const container = document.getElementById('portfolio-container');
    if (!container) return;

    const session = JSON.parse(localStorage.getItem('eduportal_session'));
    const isAdmin = session && session.username === 'admin';

    container.innerHTML = facultyList.map((member, index) => {
        // Edit button is shown to admin on all cards, or to a student only on their own card
        const canEdit = isAdmin || (session && member.name.toLowerCase() === session.name.toLowerCase());

        return `
            <div class="glass-card portfolio-card">
                <div class="portfolio-avatar">
                    <i class="fi ${member.icon}"></i>
                </div>
                <div class="portfolio-info">
                    <h4>${member.name}</h4>
                    <span class="portfolio-id">ID: ${member.id}</span>
                    <span class="portfolio-role">${member.role}</span>
                    <p class="portfolio-desc">${member.description}</p>
                </div>
                <div class="portfolio-socials">
                    <a href="${member.github}" class="social-link" title="GitHub System Access" target="_blank">
                        <i class="fi fi-brands-github"></i>
                    </a>
                    <a href="mailto:${member.email}" class="social-link" title="Contact Coordinator">
                        <i class="fi fi-rr-envelope"></i>
                    </a>
                    ${canEdit ? `
                    <button class="social-link edit-faculty-btn" data-index="${index}" title="Edit Profile" style="border: none; background: transparent; cursor: pointer; color: var(--color-primary); padding: 0;">
                        <i class="fi fi-rr-edit"></i>
                    </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    // Attach click events to the edit buttons dynamically
    const editBtns = container.querySelectorAll('.edit-faculty-btn');
    editBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.getAttribute('data-index');
            openFacultyModal(index);
        });
    });
}

/**
 * Setup Event Listeners for Edit Faculty modal operations
 */
function setupFacultyEventListeners() {
    const form = document.getElementById('faculty-form');
    const cancelBtn = document.getElementById('cancel-faculty-modal-btn');
    const closeBtn = document.getElementById('close-faculty-modal-btn');

    if (form) {
        // Handle form submissions
        form.onsubmit = (e) => {
            e.preventDefault();
            saveFacultyMember();
        };
    }

    if (cancelBtn) {
        cancelBtn.onclick = () => {
            if (window.ModalHelper) window.ModalHelper.close('faculty-modal');
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            if (window.ModalHelper) window.ModalHelper.close('faculty-modal');
        };
    }
}

/**
 * Opens edit modal populated with selected faculty member details
 */
function openFacultyModal(index) {
    const member = facultyList[index];
    if (!member) return;

    const session = JSON.parse(localStorage.getItem('eduportal_session'));
    const isAdmin = session && session.username === 'admin';

    // Populate input fields
    document.getElementById('faculty-index-input').value = index;
    
    const nameInput = document.getElementById('faculty-name-input');
    nameInput.value = member.name;
    // Student roles cannot edit their own card's name (to maintain identification integrity)
    nameInput.disabled = !isAdmin;

    document.getElementById('faculty-id-input').value = member.id;
    document.getElementById('faculty-role-input').value = member.role;
    document.getElementById('faculty-desc-input').value = member.description;
    document.getElementById('faculty-email-input').value = member.email;
    document.getElementById('faculty-github-input').value = member.github;
    document.getElementById('faculty-icon-input').value = member.icon;

    if (window.ModalHelper) {
        window.ModalHelper.open('faculty-modal');
    }
}

/**
 * Saves modifications to faculty profile card and persists state
 */
function saveFacultyMember() {
    const index = parseInt(document.getElementById('faculty-index-input').value, 10);
    if (isNaN(index) || !facultyList[index]) return;

    // Retrieve values (note: name field could be disabled, so we read it or fallback to existing value)
    const nameVal = document.getElementById('faculty-name-input').value.trim() || facultyList[index].name;

    facultyList[index] = {
        name: nameVal,
        id: document.getElementById('faculty-id-input').value.trim(),
        role: document.getElementById('faculty-role-input').value.trim(),
        description: document.getElementById('faculty-desc-input').value.trim(),
        email: document.getElementById('faculty-email-input').value.trim(),
        github: document.getElementById('faculty-github-input').value.trim() || '#',
        icon: document.getElementById('faculty-icon-input').value
    };

    localStorage.setItem('eduportal_faculty', JSON.stringify(facultyList));
    
    if (window.ModalHelper) {
        window.ModalHelper.close('faculty-modal');
    }

    renderPortfolio();
}

// Expose portfolio module functions globally
window.initPortfolio = initPortfolio;
window.renderPortfolio = renderPortfolio;
window.loadFacultyData = loadFacultyData;
