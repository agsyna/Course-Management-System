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
        const response = await fetch(`http://localhost:3000/api/faculty/schedule/${userData.username}`);
        scheduleData = await response.json();
        console.log('Schedule data:', scheduleData);
    } catch (error) {
        console.error('Error fetching schedule:', error);
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

    // Adjust to start from Monday (0)
    let startingDay = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
    startingDay = startingDay === 0 ? 6 : startingDay - 1;

    // Clear previous calendar
    const calendarBody = document.getElementById('calendarBody');
    calendarBody.innerHTML = '';

    // Add empty divs before the first day
    for (let i = 0; i < startingDay; i++) {
        const emptyCell = document.createElement('div');
        calendarBody.appendChild(emptyCell);
    }

    // Add days of the month
    const today = new Date();
    for (let day = 1; day <= totalDays; day++) {
        const cell = document.createElement('div');
        cell.textContent = day;

        if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
            cell.classList.add('today');
        }

        // Hover tooltip
        cell.addEventListener('mouseenter', () => {
            const date = new Date(year, month, day);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

            const daySchedule = scheduleData?.schedule.find(d => d.day === dayName)?.classes || [];

            if (daySchedule.length > 0) {
                const tooltip = document.createElement('div');
                tooltip.className = 'schedule-tooltip';

                let tooltipContent = `<div class="tooltip-header">${dayName}</div>`;
                tooltipContent += `
                    <div class="tooltip-section">
                        <div class="section-title">Classes</div>
                        ${daySchedule.map(cls => `
                            <div class="tooltip-item">
                                <span class="time">${cls.time}</span>
                                <span class="course">${cls.course}</span>
                                <span class="location">${cls.location}</span>
                            </div>
                        `).join('')}
                    </div>
                `;

                tooltip.innerHTML = tooltipContent;
                cell.appendChild(tooltip);
            }
        });

        cell.addEventListener('mouseleave', () => {
            const tooltip = cell.querySelector('.schedule-tooltip');
            if (tooltip) tooltip.remove();
        });

        cell.addEventListener('click', () => {
            showDayDetails(year, month, day);
        });

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
    const daySchedule = scheduleData?.schedule.find(d => d.day === dayName)?.classes || [];
    
    // Update schedule section
    const scheduleList = document.getElementById('daySchedule');
    if (daySchedule.length > 0) {
        scheduleList.innerHTML = daySchedule.map(cls => `
            <div class="schedule-item">
                <div class="time">${cls.time}</div>
                <div class="course">${cls.course}</div>
                <div class="details">
                    <span class="section">${cls.section}</span>
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