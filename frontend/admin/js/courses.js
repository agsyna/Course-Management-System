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

    // Load courses data
    loadCourses();

    // Handle search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterCourses(e.target.value);
        });
    }

    // Handle department filter
    const departmentFilter = document.getElementById('departmentFilter');
    if (departmentFilter) {
        departmentFilter.addEventListener('change', (e) => {
            filterCourses(searchInput.value, e.target.value);
        });
    }

    // Add course button
    const addCourseBtn = document.querySelector('.add-course-btn');
    const courseModal = document.getElementById('courseModal');
    const courseForm = document.getElementById('courseForm');
    
    if (addCourseBtn && courseModal) {
        addCourseBtn.addEventListener('click', function() {
            document.getElementById('courseModalTitle').textContent = 'Add Course';
            courseForm.reset();
            
            // Set default dates
            const today = new Date();
            
            // Set start date to next Monday
            const startDate = new Date(today);
            const dayOfWeek = startDate.getDay();
            const daysToAdd = (dayOfWeek === 0 ? 1 : 8 - dayOfWeek);
            startDate.setDate(startDate.getDate() + daysToAdd);
            
            // Set end date to 4 months after start date
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 4);
            
            document.getElementById('startDate').value = startDate.toISOString().split('T')[0];
            document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
            
            // Setup multiselect for prerequisites
            setupPrerequisitesSelect([]);
            
            courseModal.style.display = 'flex';
        });
    }
    
    // Handle course form submission
    if (courseForm) {
        courseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get selected prerequisites
            const selectedPrereqs = [];
            const prereqSelect = document.getElementById('prerequisites');
            if (prereqSelect) {
                Array.from(prereqSelect.selectedOptions).forEach(option => {
                    selectedPrereqs.push(option.value);
                });
            }
            
            // Prepare course data
            const courseData = {
                id: document.getElementById('courseId').value.toUpperCase(),
                title: document.getElementById('courseTitle').value,
                department: document.getElementById('department').value,
                description: document.getElementById('description').value,
                credits: parseInt(document.getElementById('credits').value),
                schedule: document.getElementById('schedule').value,
                location: document.getElementById('location').value,
                maxEnrollment: parseInt(document.getElementById('maxEnrollment').value),
                currentEnrollment: 0,
                professor: document.getElementById('professor').value,
                prerequisites: selectedPrereqs,
                startDate: document.getElementById('startDate').value,
                endDate: document.getElementById('endDate').value,
                status: 'Active'
            };
            
            console.log('Form submitted with data:', courseData);
            
            // Here you would typically save the data using fetch POST request
            
            // For demo purposes, add to table directly
            addCourseToTable(courseData);
            
            // Close the modal
            courseModal.style.display = 'none';
            
            // Show success message
            alert('Course has been saved successfully.');
        });
    }
    
    // Apply filters button
    const filterBtn = document.querySelector('.filter-btn');
    
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            const searchTerm = document.getElementById('course-search').value.toLowerCase();
            const departmentFilter = document.getElementById('department-filter').value;
            const statusFilter = document.getElementById('status-filter').value;
            
            console.log('Filtering with:', {
                search: searchTerm,
                department: departmentFilter,
                status: statusFilter
            });
            
            // Here you would typically fetch filtered data and update the table
            
            // For demo, just show a message
            this.textContent = 'Filtering...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = 'Apply Filters';
                this.disabled = false;
                
                // Show success message
                alert('Filters applied successfully.');
            }, 800);
        });
    }
    
    // Search functionality
    const searchBox = document.getElementById('course-search');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchBox && searchBtn) {
        // Search on button click
        searchBtn.addEventListener('click', function() {
            const searchTerm = searchBox.value.toLowerCase();
            console.log('Searching for:', searchTerm);
            
            // Here you would typically fetch search results and update the table
            
            // For demo, just show a message
            alert(`Searching for: ${searchTerm}`);
        });
        
        // Search on Enter key
        searchBox.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchBtn.click();
            }
        });
    }
    
    // Course details modal tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    if (tabButtons) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all tabs and panes
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Show corresponding pane
                const tabId = this.getAttribute('data-tab');
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });
    }
    
    // Edit course from details modal
    const editCourseDetailsBtn = document.querySelector('.edit-course-details');
    
    if (editCourseDetailsBtn) {
        editCourseDetailsBtn.addEventListener('click', function() {
            // Close details modal
            document.getElementById('courseDetailsModal').style.display = 'none';
            
            // Open edit modal with course data
            document.getElementById('courseModalTitle').textContent = 'Edit Course';
            
            // For demo, pre-fill the form with the first course's data
            document.getElementById('courseId').value = 'CS101';
            document.getElementById('courseTitle').value = 'Introduction to Programming';
            document.getElementById('department').value = 'Computer Science';
            document.getElementById('description').value = 'An introductory course covering the fundamentals of programming using Python. Topics include variables, control structures, functions, data structures, and basic algorithms.';
            document.getElementById('credits').value = '3';
            document.getElementById('schedule').value = 'Mon, Wed, Fri 9:00 AM - 10:00 AM';
            document.getElementById('location').value = 'CS Building, Room 101';
            document.getElementById('maxEnrollment').value = '35';
            document.getElementById('professor').value = 'PROF001';
            document.getElementById('startDate').value = '2025-01-15';
            document.getElementById('endDate').value = '2025-05-15';
            
            // Setup prerequisites select (for demo with empty array since we don't have the actual data)
            setupPrerequisitesSelect([]);
            
            // Show the modal
            document.getElementById('courseModal').style.display = 'flex';
        });
    }
    
    // Refresh buttons for charts
    const refreshButtons = document.querySelectorAll('.refresh-btn');
    
    refreshButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add refresh animation
            this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>';
            this.classList.add('rotating');
            
            // Simulate data refresh
            setTimeout(() => {
                this.classList.remove('rotating');
                // You would typically update the chart data here
                console.log('Chart data refreshed');
            }, 1000);
        });
    });
    
    // Time filter change handler
    const timeFilters = document.querySelectorAll('.time-filter');
    
    timeFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            const selectedValue = this.value;
            const chartContainer = this.closest('.card');
            
            // Add loading state
            if (chartContainer) {
                chartContainer.classList.add('loading');
                
                // Simulate data update
                setTimeout(() => {
                    chartContainer.classList.remove('loading');
                    console.log(`Time filter changed to: ${selectedValue}`);
                    // Update chart data based on selected time filter
                }, 800);
            }
        });
    });
    
    // Pagination buttons
    const paginationButtons = document.querySelectorAll('.pagination .page-btn:not(.prev-btn):not(.next-btn)');
    
    if (paginationButtons) {
        paginationButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                paginationButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Enable/disable prev/next buttons based on current page
                const currentPage = parseInt(this.textContent);
                const prevBtn = document.querySelector('.prev-btn');
                const nextBtn = document.querySelector('.next-btn');
                
                if (prevBtn) prevBtn.disabled = currentPage === 1;
                if (nextBtn) nextBtn.disabled = currentPage === 3;
                
                // Here you would typically fetch data for the selected page
                console.log(`Loading page ${currentPage}`);
            });
        });
    }
});

async function loadCourses() {
    try {
        const response = await fetch('../../data/courses.json');
        const data = await response.json();

        if (data.courses) {
            displayCourses(data.courses);
        } else {
            console.error('Failed to load courses:', data.message);
        }
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

function displayCourses(courses) {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    tbody.innerHTML = courses.map(course => `
        <tr>
            <td>${course.courseId}</td>
            <td>${course.name}</td>
            <td>${course.credits}</td>
            <td>${course.sessions}</td>
            <td>
                <span class="status-badge ${course.status.toLowerCase()}">${course.status}</span>
            </td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="editCourse('${course.courseId}')">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit
                </button>
                <button class="btn btn-outline btn-sm" onclick="deleteCourse('${course.courseId}')">
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

function filterCourses(searchTerm = '', department = '') {
    const rows = document.querySelectorAll('.table tbody tr');
    
    rows.forEach(row => {
        const code = row.cells[0].textContent.toLowerCase();
        const name = row.cells[1].textContent.toLowerCase();
        const courseDepartment = row.cells[2].textContent.toLowerCase();
        
        const matchesSearch = code.includes(searchTerm.toLowerCase()) || 
                            name.includes(searchTerm.toLowerCase());
        const matchesDepartment = !department || courseDepartment === department.toLowerCase();
        
        row.style.display = matchesSearch && matchesDepartment ? '' : 'none';
    });
}

function editCourse(code) {
    // TODO: Implement edit functionality
    console.log('Edit course:', code);
}

function deleteCourse(code) {
    if (confirm('Are you sure you want to delete this course?')) {
        // TODO: Implement delete functionality
        console.log('Delete course:', code);
    }
}

function setupPrerequisitesSelect(selectedValues) {
    const prerequisitesSelect = document.getElementById('prerequisites');
    if (!prerequisitesSelect) return;
    
    // Clear existing options
    prerequisitesSelect.innerHTML = '';
    
    // Fetch courses
    fetch('data/courses.json')
        .then(response => response.json())
        .then(courses => {
            // Add options
            courses.forEach(course => {
                const option = document.createElement('option');
                option.value = course.id;
                option.textContent = `${course.id}: ${course.title}`;
                
                // Check if this option should be selected
                if (selectedValues.includes(course.id)) {
                    option.selected = true;
                }
                
                prerequisitesSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error loading courses for prerequisites:', error);
        });
}

function addCourseToTable(course) {
    const tableBody = document.getElementById('coursesTableBody');
    if (!tableBody) return;
    
    const row = document.createElement('tr');
    
    // Format dates
    const startDate = new Date(course.startDate);
    const endDate = new Date(course.endDate);
    
    const formattedStartDate = startDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    
    const formattedEndDate = endDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    
    row.innerHTML = `
        <td>${course.id}</td>
        <td>${course.title}</td>
        <td>${course.department}</td>
        <td>${course.professor}</td>
        <td>${course.credits}</td>
        <td>${course.currentEnrollment}/${course.maxEnrollment}</td>
        <td>${formattedStartDate} - ${formattedEndDate}</td>
        <td><span class="badge badge-green">${course.status}</span></td>
        <td>
            <div class="action-buttons">
                <button class="view-btn" data-id="${course.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                <button class="edit-btn" data-id="${course.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="delete-btn" data-id="${course.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
            </div>
        </td>
    `;
    
    // Add to the top of the table
    tableBody.insertBefore(row, tableBody.firstChild);
    
    // Add highlight animation
    row.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
    setTimeout(() => {
        row.style.backgroundColor = '';
        row.style.transition = 'background-color 1s ease';
    }, 1000);
    
    // Add event listeners
    row.querySelector('.view-btn').addEventListener('click', function() {
        showCourseDetails(course.id);
    });
    
    row.querySelector('.edit-btn').addEventListener('click', function() {
        editCourse(course.id);
    });
    
    row.querySelector('.delete-btn').addEventListener('click', function() {
        deleteCourse(course.id);
    });
}

// Add rotating animation for refresh buttons
const style = document.createElement('style');
style.textContent = `
    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .rotating {
        animation: rotate 1s linear infinite;
    }
`;
document.head.appendChild(style);