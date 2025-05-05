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

    // Load students data
    loadStudents();

    // Handle search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterStudents(e.target.value);
        });
    }

    // Handle section filter
    const sectionFilter = document.getElementById('sectionFilter');
    if (sectionFilter) {
        sectionFilter.addEventListener('change', (e) => {
            filterStudents(searchInput.value, e.target.value);
        });
    }
});

async function loadStudents() {
    try {
        const response = await fetch('../../data/users.json');
        const data = await response.json();

        if (data.users) {
            // Filter only students
            const students = data.users.filter(user => user.role === 'student');
            displayStudents(students);
        } else {
            console.error('Failed to load students:', data.message);
        }
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

function displayStudents(students) {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    tbody.innerHTML = students.map(student => `
        <tr>
            <td>${student.name}</td>
            <td>${student.username}</td>
            <td>${student.section || 'N/A'}</td>
            <td>
                <span class="status-badge active">Active</span>
            </td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="editStudent('${student.username}')">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit
            </button>
                <button class="btn btn-outline btn-sm" onclick="deleteStudent('${student.username}')">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Delete
            </button>
        </td>
        </tr>
    `).join('');
}

function filterStudents(searchTerm = '', section = '') {
    const rows = document.querySelectorAll('.table tbody tr');
    
    rows.forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();
        const email = row.cells[1].textContent.toLowerCase();
        const studentSection = row.cells[2].textContent.toLowerCase();
        
        const matchesSearch = name.includes(searchTerm.toLowerCase()) || 
                            email.includes(searchTerm.toLowerCase());
        const matchesSection = !section || studentSection === section.toLowerCase();
        
        row.style.display = matchesSearch && matchesSection ? '' : 'none';
    });
}

function editStudent(username) {
    // TODO: Implement edit functionality
    console.log('Edit student:', username);
}

function deleteStudent(username) {
    if (confirm('Are you sure you want to delete this student?')) {
        // TODO: Implement delete functionality
        console.log('Delete student:', username);
    }
}