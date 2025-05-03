let currentDate = new Date();
let userData = JSON.parse(sessionStorage.getItem('userData'));

// Initialize calendar
document.addEventListener('DOMContentLoaded', () => {
    if (!userData) {
        window.location.href = 'login.html';
        return;
    }

    // Update section display
    document.querySelector('.subtitle').textContent = `CSE - ${userData.section}`;
    
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
        cell.textContent = day;
        
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