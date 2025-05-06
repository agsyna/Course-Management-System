let currentDate = new Date();
let userData = JSON.parse(sessionStorage.getItem('userData'));
let scheduleData = null;

// Initialize calendar
document.addEventListener('DOMContentLoaded', () => {
    if (!userData) {
        window.location.href = '../login.html';
        return;
    }

    // Fetch schedule data
    fetchSchedule();
    
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

    document.getElementById('closeDetails').addEventListener('click', () => {
        document.getElementById('dayDetails').classList.add('hidden');
    });
});

// Function to open schedule form
function openScheduleForm() {
    window.open('schedulecreate.html', 'scheduleForm', 'width=800,height=600');
}

// Function to fetch schedule data
async function fetchSchedule() {
    try {
        const response = await fetch('http://localhost:3000/api/faculty/schedule');
        scheduleData = await response.json();
        console.log('Schedule data:', scheduleData);
        updateCalendar();
    } catch (error) {
        console.error('Error fetching schedule:', error);
    }
}

function updateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update month display
    document.getElementById('currentMonth').textContent = 
        currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    // Get first day of month and total days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    
    // Clear calendar
    const calendarBody = document.getElementById('calendarBody');
    calendarBody.innerHTML = '';
    
    // Add empty cells for days before first day of month
    const firstDayIndex = firstDay.getDay() || 7; // Convert Sunday (0) to 7
    for (let i = 1; i < firstDayIndex; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day empty';
        calendarBody.appendChild(emptyCell);
    }
    
    // Add days
    const today = new Date();
    for (let day = 1; day <= totalDays; day++) {
        const cell = document.createElement('div');
        cell.textContent = day;
        cell.className = 'calendar-day';

        if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
            cell.classList.add('today');
        }

        // Add schedule indicator if there are classes on this day
        const date = new Date(year, month, day);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        if (scheduleData && scheduleData[dayName] && scheduleData[dayName].length > 0) {
            cell.classList.add('has-schedule');
            const indicator = document.createElement('div');
            indicator.className = 'schedule-indicator';
            indicator.textContent = scheduleData[dayName][0].course;
            cell.appendChild(indicator);
        }

        // Add click handler for day details
        cell.addEventListener('click', () => showDayDetails(year, month, day));
        
        calendarBody.appendChild(cell);
    }
}

function showDayDetails(year, month, day) {
    const date = new Date(year, month, day);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Update selected date
    document.getElementById('selectedDate').textContent = formattedDate;
    
    // Get day's schedule
    const daySchedule = scheduleData?.[dayName] || [];
    
    // Update schedule section
    const scheduleList = document.getElementById('daySchedule');
    if (daySchedule.length > 0) {
        scheduleList.innerHTML = daySchedule.map(cls => `
            <div class="schedule-item">
                <div class="time">${cls.time}</div>
                <div class="course">${cls.course}</div>
                <div class="details">
                    <span class="location">${cls.location}</span>
                </div>
            </div>
        `).join('');
    } else {
        scheduleList.innerHTML = '<p class="no-data">No classes scheduled</p>';
    }
    
    // Show details panel
    document.getElementById('dayDetails').classList.remove('hidden');
} 