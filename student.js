/* ==========================================================================
   Feature Module: Student Management (CRUD + LocalStorage)
   ========================================================================== */

let students = [];

// Seed database with mock records if localStorage is empty
const defaultStudents = [
    { id: "D032410001", name: "Ameerul Hakim bin Kamal", course: "BIT (Hons) Computer Application Development", email: "ameerul.hakim@student.uptm.edu.my", status: "Active" },
    { id: "D032410045", name: "Khairun Nisa binti Osman", course: "BIT (Hons) Cybersecurity", email: "nisa.osman@student.uptm.edu.my", status: "Active" },
    { id: "D032410092", name: "Tan Wei Jie", course: "BIT (Hons) Computer Application Development", email: "weijie.tan@student.uptm.edu.my", status: "Pending" },
    { id: "D032410103", name: "Divya a/p Ramasamy", course: "BIT (Hons) Cybersecurity", email: "divya.ramasamy@student.uptm.edu.my", status: "Inactive" }
];

function initStudentManager() {
    const session = JSON.parse(localStorage.getItem('eduportal_session'));
    if (!session || session.username !== 'admin') {
        return; // Prevent execution and API setup for non-admin users
    }
    loadStudents();
    setupStudentEventListeners();
    renderStudentsTable();
}

/**
 * Load student array from local storage cache
 */
function loadStudents() {
    const data = localStorage.getItem('cloudlab_students');
    if (data) {
        students = JSON.parse(data);
    } else {
        students = [...defaultStudents];
        saveStudents();
    }
}

/**
 * Save current student array to local storage cache
 */
function saveStudents() {
    localStorage.setItem('cloudlab_students', JSON.stringify(students));
    updateStudentStats();
}

/**
 * Recalculates stats panel counts
 */
function updateStudentStats() {
    const totalCount = document.getElementById('total-students-count');
    const activeCount = document.getElementById('active-students-count');
    const pendingCount = document.getElementById('pending-students-count');

    if (totalCount) totalCount.textContent = students.length;
    if (activeCount) activeCount.textContent = students.filter(s => s.status === 'Active').length;
    if (pendingCount) pendingCount.textContent = students.filter(s => s.status === 'Pending').length;
}

/**
 * Event Listener Setup for UI Triggers
 */
function setupStudentEventListeners() {
    const openAddBtn = document.getElementById('open-add-student-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    const studentForm = document.getElementById('student-form');
    const searchInput = document.getElementById('student-search-input');

    // Modal Opening
    if (openAddBtn) {
        openAddBtn.addEventListener('click', () => {
            studentForm.reset();
            document.getElementById('student-index-input').value = '';
            document.getElementById('modal-title').textContent = 'Add Student Record';
            document.getElementById('student-id-input').disabled = false;
            window.ModalHelper.open('student-modal');
        });
    }

    // Modal Closing
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => window.ModalHelper.close('student-modal'));
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', () => window.ModalHelper.close('student-modal'));

    // Form submission (Add & Update)
    if (studentForm) {
        studentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveStudentFromForm();
        });
    }

    // Realtime search query filters
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            renderStudentsTable(searchInput.value);
        });
    }
}

/**
 * Reads form, handles add/update validation, and saves state
 */
function saveStudentFromForm() {
    const indexVal = document.getElementById('student-index-input').value;
    const idVal = document.getElementById('student-id-input').value.trim();
    const nameVal = document.getElementById('student-name-input').value.trim();
    const courseVal = document.getElementById('student-course-input').value;
    const emailVal = document.getElementById('student-email-input').value.trim();
    const statusVal = document.getElementById('student-status-input').value;

    // Validation: Check duplicate IDs for new students
    if (indexVal === '') {
        const idExists = students.some(s => s.id.toLowerCase() === idVal.toLowerCase());
        if (idExists) {
            alert(`Student ID ${idVal} already exists in local database.`);
            return;
        }
    }

    const studentObject = { id: idVal, name: nameVal, course: courseVal, email: emailVal, status: statusVal };

    if (indexVal === '') {
        // Create Mode
        students.push(studentObject);
    } else {
        // Update Mode
        const index = parseInt(indexVal, 10);
        students[index] = studentObject;
    }

    saveStudents();
    renderStudentsTable();
    window.ModalHelper.close('student-modal');
}

/**
 * Builds rows for students table
 */
function renderStudentsTable(filterQuery = '') {
    const tableBody = document.getElementById('students-table-body');
    const emptyState = document.getElementById('students-empty-state');
    const tableElement = document.getElementById('students-table');
    
    if (!tableBody) return;

    // Filter table by query (searches name, ID, and course)
    const lowerQuery = filterQuery.toLowerCase();
    const filtered = students.filter(s => 
        s.name.toLowerCase().includes(lowerQuery) || 
        s.id.toLowerCase().includes(lowerQuery) || 
        s.course.toLowerCase().includes(lowerQuery)
    );

    // Toggle Empty State Visibility
    if (filtered.length === 0) {
        tableBody.innerHTML = '';
        emptyState.style.display = 'block';
        tableElement.style.opacity = '0.4';
    } else {
        emptyState.style.display = 'none';
        tableElement.style.opacity = '1';
        
        tableBody.innerHTML = filtered.map((student, i) => {
            // Find global index in actual array to support delete/edit actions
            const globalIndex = students.indexOf(student);
            
            const statusClass = student.status.toLowerCase();

            return `
                <tr>
                    <td><strong>${student.id}</strong></td>
                    <td>${student.name}</td>
                    <td>${student.course}</td>
                    <td>${student.email}</td>
                    <td><span class="status-badge ${statusClass}">${student.status}</span></td>
                    <td class="actions-col">
                        <button onclick="editStudent(${globalIndex})" class="action-btn action-edit" title="Edit Student">
                            <i class="fi fi-rr-edit"></i>
                        </button>
                        <button onclick="deleteStudent(${globalIndex})" class="action-btn action-delete" title="Delete Student">
                            <i class="fi fi-rr-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }
    updateStudentStats();
}

/**
 * Opens edit modal populated with selected student info
 * Exposed to global scope for button onclick integration
 */
function editStudent(index) {
    const student = students[index];
    if (!student) return;

    document.getElementById('student-index-input').value = index;
    document.getElementById('student-id-input').value = student.id;
    document.getElementById('student-id-input').disabled = true; // Block ID editing
    document.getElementById('student-name-input').value = student.name;
    document.getElementById('student-course-input').value = student.course;
    document.getElementById('student-email-input').value = student.email;
    document.getElementById('student-status-input').value = student.status;

    document.getElementById('modal-title').textContent = 'Modify Student Record';
    window.ModalHelper.open('student-modal');
}

/**
 * Deletes selected student record from database
 * Exposed to global scope for button onclick integration
 */
function deleteStudent(index) {
    const student = students[index];
    if (!student) return;

    if (confirm(`Are you sure you want to delete record: ${student.name} (${student.id})?`)) {
        students.splice(index, 1);
        saveStudents();
        renderStudentsTable();
    }
}

// Expose edit and delete functions globally
window.editStudent = editStudent;
window.deleteStudent = deleteStudent;
