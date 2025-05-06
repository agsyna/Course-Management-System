// Admin Panel Main Script
document.addEventListener('DOMContentLoaded', () => {
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
    console.log('Initializing courses page...');
    const tbody = document.querySelector('.table tbody');
    if (!tbody) {
        console.error('Table body element not found!');
        return;
    }
    console.log('Table body found, fetching courses...');

    try {
        const response = await fetch('http://localhost:3000/api/allcourses');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText}`);
        }
        
        const courses = await response.json();
        console.log('Received courses:', courses);
        
        if (!Array.isArray(courses)) {
            throw new Error('Invalid data format: expected an array of courses');
        }
        
        displayCourses(courses);
        setupCourseForm();
    } catch (error) {
        console.error('Error loading courses:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">
                    <div class="empty-state">
                        <h3>Error Loading Courses</h3>
                        <p>${error.message}</p>
                        <p>Please check if the server is running at http://localhost:3000</p>
                        <button class="btn btn-outline" onclick="initializeCoursesPage()">
                            <i class="fas fa-sync"></i> Retry
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }
}

function displayCourses(courses) {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    if (!courses || courses.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">
                    <div class="empty-state">
                        <h3>No Courses Found</h3>
                        <p>Add your first course to get started.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = courses.map(course => `
        <tr>
            <td>${course.id}</td>
            <td>${course.title}</td>
            <td>${course.department || 'Not Assigned'}</td>
            <td>${course.credits || 'N/A'}</td>
            <td>${course.professor || 'Not Assigned'}</td>
            <td>${course.currentEnrollment || 0}/${course.maxEnrollment || 'N/A'}</td>
            <td>
                <span class="status-badge ${course.status?.toLowerCase() || 'active'}">${course.status || 'Active'}</span>
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

function addCourse() {
    const courseForm = document.getElementById('courseForm');
    const modalTitle = document.getElementById('courseModalTitle');
    if (courseForm && modalTitle) {
        courseForm.reset();
        courseForm.dataset.editMode = 'false';
        modalTitle.textContent = 'Add New Course';
        
        // Set default dates
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() + 7); // Start next week
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 4); // End in 4 months
        
        document.getElementById('startDate').value = startDate.toISOString().split('T')[0];
        document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
        
        openModal('courseModal');
    }
}

function setupCourseForm() {
    const courseForm = document.getElementById('courseForm');
    if (!courseForm) return;

    // Load professors for dropdown
    fetch('http://localhost:3000/api/professors')
        .then(response => response.json())
        .then(professors => {
            const professorSelect = document.getElementById('professor');
            if (professorSelect) {
                professorSelect.innerHTML = `
                    <option value="">Select Professor</option>
                    ${professors.map(prof => `
                        <option value="${prof.id}">${prof.firstName} ${prof.lastName}</option>
                    `).join('')}
                `;
            }
        })
        .catch(error => console.error('Error loading professors:', error));

    courseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Course form submitted');
        
        const formData = new FormData(courseForm);
        const courseData = {
            id: formData.get('courseId'),
            title: formData.get('title'),
            department: formData.get('department'),
            description: formData.get('description'),
            credits: parseInt(formData.get('credits')),
            schedule: formData.get('schedule'),
            location: formData.get('location'),
            maxEnrollment: parseInt(formData.get('maxEnrollment')),
            professor: formData.get('professor'),
            prerequisites: formData.get('prerequisites').split(',').map(p => p.trim()).filter(p => p),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            status: 'Active',
            currentEnrollment: 0
        };

        try {
            const isEdit = courseForm.dataset.editMode === 'true';
            const url = isEdit 
                ? `http://localhost:3000/api/allcourses/${courseForm.dataset.courseId}`
                : 'http://localhost:3000/api/allcourses';
            const method = isEdit ? 'PUT' : 'POST';

            console.log('Submitting course data:', courseData);
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(courseData)
            });

            if (!response.ok) {
                throw new Error(`Failed to ${isEdit ? 'update' : 'add'} course: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Server response:', result);

            closeModal('courseModal');
            initializeCoursesPage();
            showSuccess(isEdit ? 'Course updated successfully' : 'Course added successfully');
        } catch (error) {
            console.error('Error saving course:', error);
            showError(`Failed to save course: ${error.message}`);
        }
    });
}

async function editCourse(courseId) {
    try {
        const response = await fetch(`http://localhost:3000/api/allcourses/${courseId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch course details');
        }
        const course = await response.json();
        
        // Populate form with course data
        const courseForm = document.getElementById('courseForm');
        if (courseForm) {
            courseForm.courseId.value = course.id;
            courseForm.title.value = course.title;
            courseForm.professor.value = course.professor || '';
            courseForm.schedule.value = course.schedule || '';
        }
    } catch (error) {
        console.error('Error fetching course details:', error);
        alert('Failed to load course details. Please try again.');
    }
}

async function deleteCourse(courseId) {
    if (!confirm('Are you sure you want to delete this course?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/allcourses/${courseId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete course');
        }

        // Refresh the courses list
        initializeCoursesPage();
    } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course. Please try again.');
    }
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
    const studentForm = document.getElementById('studentForm');
    const modalTitle = document.getElementById('studentModalTitle');
    if (studentForm && modalTitle) {
        studentForm.reset();
        studentForm.dataset.editMode = 'false';
        modalTitle.textContent = 'Add New Student';
        openModal('studentModal');
    }
}

function addProfessor() {
    const professorForm = document.getElementById('professorForm');
    const modalTitle = document.getElementById('professorModalTitle');
    if (professorForm && modalTitle) {
        professorForm.reset();
        professorForm.dataset.editMode = 'false';
        modalTitle.textContent = 'Add New Professor';
        openModal('professorModal');
    }
}

// Edit Functions
async function editStudent(id) {
    console.log('Edit student called with ID:', id);
    try {
        const response = await fetch(`http://localhost:3000/api/students/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const student = await response.json();
        
        const studentForm = document.getElementById('studentForm');
        const modalTitle = document.getElementById('studentModalTitle');
        if (studentForm && modalTitle) {
            studentForm.dataset.editMode = 'true';
            studentForm.dataset.studentId = id;
            modalTitle.textContent = 'Edit Student';
            
            // Fill form with student data
            document.getElementById('firstName').value = student.firstName;
            document.getElementById('lastName').value = student.lastName;
            document.getElementById('email').value = student.email;
            document.getElementById('program').value = student.program;
            document.getElementById('year').value = student.year;
            document.getElementById('gpa').value = student.gpa;
            
            openModal('studentModal');
        } else {
            console.error('Student form or modal title not found');
        }
    } catch (error) {
        console.error('Error in editStudent:', error);
        showError(`Failed to fetch student data: ${error.message}`);
    }
}

async function editProfessor(id) {
    console.log('Edit professor called with ID:', id);
    try {
        const response = await fetch(`http://localhost:3000/api/professors/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const professor = await response.json();
        
        const professorForm = document.getElementById('professorForm');
        const modalTitle = document.getElementById('professorModalTitle');
        if (professorForm && modalTitle) {
            professorForm.dataset.editMode = 'true';
            professorForm.dataset.professorId = id;
            modalTitle.textContent = 'Edit Professor';
            
            // Fill form with professor data
            document.getElementById('firstName').value = professor.firstName;
            document.getElementById('lastName').value = professor.lastName;
            document.getElementById('email').value = professor.email;
            document.getElementById('department').value = professor.department;
            document.getElementById('position').value = professor.position;
            document.getElementById('specialization').value = professor.specialization;
            
            openModal('professorModal');
        } else {
            console.error('Professor form or modal title not found');
        }
    } catch (error) {
        console.error('Error in editProfessor:', error);
        showError(`Failed to fetch professor data: ${error.message}`);
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

// Form Submission Handlers
document.addEventListener('DOMContentLoaded', () => {
    // ... existing DOMContentLoaded code ...

    // Student Form Handler
    const studentForm = document.getElementById('studentForm');
    if (studentForm) {
        studentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(studentForm);
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
                const isEdit = studentForm.dataset.editMode === 'true';
                const url = isEdit 
                    ? `http://localhost:3000/api/students/${studentForm.dataset.studentId}`
                    : 'http://localhost:3000/api/students';
                const method = isEdit ? 'PUT' : 'POST';

                const response = await fetch(url, {
                    method,
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
                    closeModal('studentModal');
                    initializeStudentsPage();
                    showSuccess(isEdit ? 'Student updated successfully' : 'Student added successfully');
                } else {
                    throw new Error(result.message || 'Failed to save student');
                }
            } catch (error) {
                console.error('Error saving student:', error);
                showError(`Failed to save student: ${error.message}`);
            }
        });
    }

    // Professor Form Handler
    const professorForm = document.getElementById('professorForm');
    if (professorForm) {
        professorForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(professorForm);
            const professorData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                department: formData.get('department'),
                position: formData.get('position'),
                specialization: formData.get('specialization')
            };

            try {
                const isEdit = professorForm.dataset.editMode === 'true';
                const url = isEdit 
                    ? `http://localhost:3000/api/professors/${professorForm.dataset.professorId}`
                    : 'http://localhost:3000/api/professors';
                const method = isEdit ? 'PUT' : 'POST';

                const response = await fetch(url, {
                    method,
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
                    closeModal('professorModal');
                    initializeProfessorsPage();
                    showSuccess(isEdit ? 'Professor updated successfully' : 'Professor added successfully');
                } else {
                    throw new Error(result.message || 'Failed to save professor');
                }
            } catch (error) {
                console.error('Error saving professor:', error);
                showError(`Failed to save professor: ${error.message}`);
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

// Logout function
function logout() {
    window.location.href = '../login.html';
} 