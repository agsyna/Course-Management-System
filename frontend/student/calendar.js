let currentDate = new Date();
let userData = JSON.parse(sessionStorage.getItem('userData'));
let assignments = [];

// Initialize calendar
document.addEventListener('DOMContentLoaded', async () => {
    if (!userData) {
        window.location.href = 'login.html';
        return;
    }

    // Update section display
    document.querySelector('.subtitle').textContent = `CSE - ${userData.section}`;
    
    // Fetch assignments
    await fetchAssignments();
    
    // Initialize calendar
    updateCalendar();
    
    // Add event listeners for month navigation
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    });
    
    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    });
});

// Function to fetch assignments
async function fetchAssignments() {
    try {
        const response = await fetch('http://localhost:3000/assignments');
        assignments = await response.json();
    } catch (error) {
        console.error('Error fetching assignments:', error);
    }
}

function updateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update month display
    document.getElementById('currentMonth').textContent = 
        `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;
    
    // Get first day of month and total days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    
    // Get starting day (0-6, where 0 is Sunday)
    let startingDay = firstDay.getDay();
    // Adjust to start from Monday (1)
    startingDay = startingDay === 0 ? 6 : startingDay - 1;
    
    // Clear previous calendar
    const calendarBody = document.getElementById('calendarBody');
    calendarBody.innerHTML = '';
    
    let day = 1;
    let row = document.createElement('tr');
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
        const emptyCell = document.createElement('td');
        row.appendChild(emptyCell);
    }
    
    // Add days of the month
    while (day <= totalDays) {
        if (row.children.length === 7) {
            calendarBody.appendChild(row);
            row = document.createElement('tr');
        }
        
        const cell = document.createElement('td');
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Create day number div
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        cell.appendChild(dayNumber);

        // Check for assignments due on this day
        const dayAssignments = assignments.filter(assignment => {
            const dueDate = new Date(assignment.dueDate);
            return dueDate.toISOString().split('T')[0] === dateStr;
        });

        if (dayAssignments.length > 0) {
            const assignmentsDiv = document.createElement('div');
            assignmentsDiv.className = 'assignments';
            dayAssignments.forEach(assignment => {
                const assignmentDiv = document.createElement('div');
                assignmentDiv.className = 'assignment-item';
                assignmentDiv.textContent = assignment.title;
                assignmentsDiv.appendChild(assignmentDiv);
            });
            cell.appendChild(assignmentsDiv);
        }

        // Check if this is today
        const today = new Date();
        if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
            cell.classList.add('today');
        }

        row.appendChild(cell);
        day++;
    }
    
    // Add remaining empty cells
    while (row.children.length < 7) {
        const emptyCell = document.createElement('td');
        row.appendChild(emptyCell);
    }
    
    calendarBody.appendChild(row);
} 