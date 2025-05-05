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

    // Load professors data
    loadProfessors();

    // Handle search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterProfessors(e.target.value);
        });
    }

    // Handle department filter
    const departmentFilter = document.getElementById('departmentFilter');
    if (departmentFilter) {
        departmentFilter.addEventListener('change', (e) => {
            filterProfessors(searchInput.value, e.target.value);
        });
    }
});

async function loadProfessors() {
    try {
        const response = await fetch('../../../data/data/users.json');
        const data = await response.json();

        if (data.users) {
            // Filter only faculty
            const professors = data.users.filter(user => user.role === 'faculty');
            displayProfessors(professors);
        } else {
            console.error('Failed to load professors:', data.message);
        }
    } catch (error) {
        console.error('Error loading professors:', error);
    }
}

function displayProfessors(professors) {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    tbody.innerHTML = professors.map(professor => `
        <tr>
            <td>${professor.name}</td>
            <td>${professor.username}</td>
            <td>${professor.department || 'N/A'}</td>
            <td>
                <span class="status-badge active">Active</span>
            </td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="editProfessor('${professor.username}')">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit
            </button>
                <button class="btn btn-outline btn-sm" onclick="deleteProfessor('${professor.username}')">
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

function filterProfessors(searchTerm = '', department = '') {
    const rows = document.querySelectorAll('.table tbody tr');
    
    rows.forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();
        const email = row.cells[1].textContent.toLowerCase();
        const professorDepartment = row.cells[2].textContent.toLowerCase();
        
        const matchesSearch = name.includes(searchTerm.toLowerCase()) || 
                            email.includes(searchTerm.toLowerCase());
        const matchesDepartment = !department || professorDepartment === department.toLowerCase();
        
        row.style.display = matchesSearch && matchesDepartment ? '' : 'none';
    });
}

function editProfessor(username) {
    // TODO: Implement edit functionality
    console.log('Edit professor:', username);
}

function deleteProfessor(username) {
    if (confirm('Are you sure you want to delete this professor?')) {
        // TODO: Implement delete functionality
        console.log('Delete professor:', username);
    }
}