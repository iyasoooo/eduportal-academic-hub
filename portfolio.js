/* ==========================================================================
   Feature Module: Faculty Directory & Profiles (LocalStorage State with RBAC)
   ========================================================================== */

/**
 * Group members directory database configuration (default values).
 */
const defaultGroupMembers = [
    {
        name: "MUHAMMAD ILYAS BIN MOHD ABDUL HAKIM",
        id: "AM2412018208",
        role: "Team Member",
        description: "Primarily responsible for the Academic Tasks part.",
        icon: "fi-rr-compass",
        github: "https://github.com/iyasoooo",
        email: "ilyas.hakim@student.uptm.edu.my"
    },
    {
        name: "MUHAMMAD SYAH BIN RAZAK",
        id: "AM2412018244",
        role: "Team Member",
        description: "Group Leader. Mainly responsible for updating the UI theme and layouts.",
        icon: "fi-rr-shield",
        github: "#",
        email: "syah.razak@student.uptm.edu.my"
    },
    {
        name: "AZIB SAFWAN BIN AHMAD SAKRI",
        id: "AM2412018392",
        role: "Team Member",
        description: "Mainly responsible for the Faculty Directory features.",
        icon: "fi-rr-settings",
        github: "#",
        email: "azib.safwan@student.uptm.edu.my"
    },
    {
        name: "MUHAMMAD IDHAM BIN MUHAMMAD ZAINI",
        id: "AM2412018299",
        role: "Team Member",
        description: "Mainly responsible for The Student Registry.",
        icon: "fi-rr-database",
        github: "#",
        email: "idham.zaini@student.uptm.edu.my"
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
    let needsReset = false;
    
    if (cached) {
        try {
            const parsed = JSON.parse(cached);
            // Check if local storage contains old Danish or Sarah placeholders or non-Team Member roles and force-update them
            if (parsed.some(m => m.name === "Ahmad Danish bin Kamal" || m.name === "Nur Sarah binti Zamri" || m.role !== "Team Member")) {
                needsReset = true;
            }
        } catch (e) {
            needsReset = true;
        }
    }

    if (cached && !needsReset) {
        facultyList = JSON.parse(cached);
    } else {
        facultyList = [...defaultGroupMembers];
        localStorage.setItem('eduportal_faculty', JSON.stringify(facultyList));
    }

    // Auto-create own card for a new student user if it doesn't exist
    const session = JSON.parse(localStorage.getItem('eduportal_session'));
    if (session && session.username.toLowerCase() !== 'admin') {
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
    const isAdmin = session && session.username.toLowerCase() === 'admin';

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
    const isAdmin = session && session.username.toLowerCase() === 'admin';

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
