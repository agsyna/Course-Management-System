// Admin Panel Main Script
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in and is admin
    const userData = sessionStorage.getItem('userData');
    if (!userData) {
        window.location.href = '../login.html';
        return;
    }

    const user = JSON.parse(userData);
    if (user.role !== 'admin') {
        window.location.href = '../login.html';
        return;
    }

    // Initialize based on current page
    const currentPage = window.location.pathname.split('/').pop();
    switch (currentPage) {
        case 'students.html':
            initializeStudentsPage();
            break;
        case 'professors.html':
            initializeProfessorsPage();
            break;
        case 'courses.html':
            initializeCoursesPage();
            break;
        case 'dashboard.html':
            initializeDashboard();
            break;
    }
});

// Students Page Functions
async function initializeStudentsPage() {
    try {
        const response = await fetch('http://localhost:3000/api/students');
        if (!response.ok) {
            throw new Error(`Failed to fetch students: ${response.status} ${response.statusText}`);
        }
        const students = await response.json();
        if (!Array.isArray(students)) {
            throw new Error('Invalid data format: expected an array of students');
        }
        displayStudents(students);
        setupSearchAndFilter('students');
    } catch (error) {
        console.error('Error loading students:', error);
        showError(`Failed to load students: ${error.message}. Please check if the server is running.`);
        // Display empty state
        const tbody = document.querySelector('.table tbody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">
                        <div class="empty-state">
                            <i class="fas fa-exclamation-circle"></i>
                            <p>Unable to load students data</p>
                            <button class="btn btn-outline" onclick="initializeStudentsPage()">
                                <i class="fas fa-sync"></i> Retry
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }
    }
}

function displayStudents(students) {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    tbody.innerHTML = students.map(student => `
        <tr>
            <td>${student.firstName} ${student.lastName}</td>
            <td>${student.email}</td>
            <td>${student.program}</td>
            <td>${student.year}</td>
            <td>${student.gpa}</td>
            <td>
                <span class="status-badge ${student.status.toLowerCase()}">${student.status}</span>
            </td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="editStudent('${student.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-outline btn-sm" onclick="deleteStudent('${student.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Professors Page Functions
async function initializeProfessorsPage() {
    try {
        const response = await fetch('http://localhost:3000/api/professors');
        if (!response.ok) {
            throw new Error(`Failed to fetch professors: ${response.status} ${response.statusText}`);
        }
        const professors = await response.json();
        if (!Array.isArray(professors)) {
            throw new Error('Invalid data format: expected an array of professors');
        }
        displayProfessors(professors);
        setupSearchAndFilter('professors');
    } catch (error) {
        console.error('Error loading professors:', error);
        showError(`Failed to load professors: ${error.message}. Please check if the server is running.`);
        // Display empty state
        const tbody = document.querySelector('.table tbody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        <div class="empty-state">
                            <i class="fas fa-exclamation-circle"></i>
                            <p>Unable to load professors data</p>
                            <button class="btn btn-outline" onclick="initializeProfessorsPage()">
                                <i class="fas fa-sync"></i> Retry
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }
    }
}

function displayProfessors(professors) {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    tbody.innerHTML = professors.map(professor => `
        <tr>
            <td>${professor.firstName} ${professor.lastName}</td>
            <td>${professor.email}</td>
            <td>${professor.department}</td>
            <td>${professor.position}</td>
            <td>${professor.specialization}</td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="editProfessor('${professor.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-outline btn-sm" onclick="deleteProfessor('${professor.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Courses Page Functions
async function initializeCoursesPage() {
    try {
        const response = await fetch('http://localhost:3000/api/courses');
        if (!response.ok) {
            throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText}`);
        }
        const courses = await response.json();
        if (!Array.isArray(courses)) {
            throw new Error('Invalid data format: expected an array of courses');
        }
        displayCourses(courses);
        setupSearchAndFilter('courses');
    } catch (error) {
        console.error('Error loading courses:', error);
        showError(`Failed to load courses: ${error.message}. Please check if the server is running.`);
        // Display empty state
        const tbody = document.querySelector('.table tbody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center">
                        <div class="empty-state">
                            <i class="fas fa-exclamation-circle"></i>
                            <p>Unable to load courses data</p>
                            <button class="btn btn-outline" onclick="initializeCoursesPage()">
                                <i class="fas fa-sync"></i> Retry
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }
    }
}

function displayCourses(courses) {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    tbody.innerHTML = courses.map(course => `
        <tr>
            <td>${course.id}</td>
            <td>${course.title}</td>
            <td>${course.department}</td>
            <td>${course.credits}</td>
            <td>${course.professor}</td>
            <td>${course.currentEnrollment}/${course.maxEnrollment}</td>
            <td>
                <span class="status-badge ${course.status.toLowerCase()}">${course.status}</span>
            </td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="editCourse('${course.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-outline btn-sm" onclick="deleteCourse('${course.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Common Functions
function setupSearchAndFilter(pageType) {
    const searchInput = document.getElementById('searchInput');
    const filterSelect = document.getElementById('filterSelect');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterData(pageType, e.target.value, filterSelect?.value);
        });
    }

    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            filterData(pageType, searchInput?.value, e.target.value);
        });
    }
}

function filterData(pageType, searchTerm, filterValue) {
    const rows = document.querySelectorAll('.table tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const matchesSearch = !searchTerm || text.includes(searchTerm.toLowerCase());
        const matchesFilter = !filterValue || row.querySelector(`td:nth-child(${getFilterColumn(pageType)})`).textContent.toLowerCase() === filterValue.toLowerCase();
        
        row.style.display = matchesSearch && matchesFilter ? '' : 'none';
    });
}

function getFilterColumn(pageType) {
    switch (pageType) {
        case 'students':
            return 3; // Program column
        case 'professors':
            return 3; // Department column
        case 'courses':
            return 3; // Department column
        default:
            return 1;
    }
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.onclick = () => closeModal(modalId);
        }
        window.onclick = (event) => {
            if (event.target === modal) {
                closeModal(modalId);
            }
        };
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    }
}

// Add Functions
function addStudent() {
    openModal('addStudentModal');
}

function addProfessor() {
    openModal('addProfessorModal');
}

function addCourse() {
    // TODO: Implement add course modal/form
    console.log('Add course clicked');
}

// Edit Functions
async function editStudent(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/students/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const student = await response.json();
        // TODO: Implement edit student modal/form
        console.log('Edit student:', student);
    } catch (error) {
        console.error('Error fetching student:', error);
        showError('Failed to fetch student data');
    }
}

async function editProfessor(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/professors/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const professor = await response.json();
        // TODO: Implement edit professor modal/form
        console.log('Edit professor:', professor);
    } catch (error) {
        console.error('Error fetching professor:', error);
        showError('Failed to fetch professor data');
    }
}

async function editCourse(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/courses/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const course = await response.json();
        // TODO: Implement edit course modal/form
        console.log('Edit course:', course);
    } catch (error) {
        console.error('Error fetching course:', error);
        showError('Failed to fetch course data');
    }
}

// Delete Functions
async function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        try {
            const response = await fetch(`http://localhost:3000/api/students/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            if (result.success) {
                initializeStudentsPage();
                showSuccess('Student deleted successfully');
            } else {
                showError('Failed to delete student');
            }
        } catch (error) {
            console.error('Error deleting student:', error);
            showError('Failed to delete student');
        }
    }
}

async function deleteProfessor(id) {
    if (confirm('Are you sure you want to delete this professor?')) {
        try {
            const response = await fetch(`http://localhost:3000/api/professors/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            if (result.success) {
                initializeProfessorsPage();
                showSuccess('Professor deleted successfully');
            } else {
                showError('Failed to delete professor');
            }
        } catch (error) {
            console.error('Error deleting professor:', error);
            showError('Failed to delete professor');
        }
    }
}

async function deleteCourse(id) {
    if (confirm('Are you sure you want to delete this course?')) {
        try {
            const response = await fetch(`http://localhost:3000/api/courses/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            if (result.success) {
                initializeCoursesPage();
                showSuccess('Course deleted successfully');
            } else {
                showError('Failed to delete course');
            }
        } catch (error) {
            console.error('Error deleting course:', error);
            showError('Failed to delete course');
        }
    }
}

// Form Submission Handlers
document.addEventListener('DOMContentLoaded', () => {
    // ... existing DOMContentLoaded code ...

    // Add Student Form Handler
    const addStudentForm = document.getElementById('addStudentForm');
    if (addStudentForm) {
        addStudentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(addStudentForm);
            const studentData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                program: formData.get('program'),
                year: parseInt(formData.get('year')),
                gpa: parseFloat(formData.get('gpa')),
                status: 'Active'
            };

            try {
                const response = await fetch('http://localhost:3000/api/students', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(studentData)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                if (result.success) {
                    closeModal('addStudentModal');
                    initializeStudentsPage();
                    showSuccess('Student added successfully');
                } else {
                    showError('Failed to add student');
                }
            } catch (error) {
                console.error('Error adding student:', error);
                showError('Failed to add student');
            }
        });
    }

    // Add Professor Form Handler
    const addProfessorForm = document.getElementById('addProfessorForm');
    if (addProfessorForm) {
        addProfessorForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(addProfessorForm);
            const professorData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                department: formData.get('department'),
                position: formData.get('position'),
                specialization: formData.get('specialization')
            };

            try {
                const response = await fetch('http://localhost:3000/api/professors', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(professorData)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                if (result.success) {
                    closeModal('addProfessorModal');
                    initializeProfessorsPage();
                    showSuccess('Professor added successfully');
                } else {
                    showError('Failed to add professor');
                }
            } catch (error) {
                console.error('Error adding professor:', error);
                showError('Failed to add professor');
            }
        });
    }
});

// Utility Functions
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
            <button class="close-error" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
            <button class="close-success" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    document.body.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 3000);
}

// Dashboard Functions
function initializeDashboard() {
    // TODO: Implement dashboard initialization
    console.log('Dashboard initialized');
} 