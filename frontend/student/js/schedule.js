let userData = JSON.parse(sessionStorage.getItem('userData'));

// Initialize schedule display
document.addEventListener('DOMContentLoaded', () => {
    if (!userData) {
        window.location.href = '../login.html';
        return;
    }

    // Fetch and display schedule
    fetchSchedule();
});

// Function to fetch schedule data
async function fetchSchedule() {
    try {
        // Use CSE4 as default if section is not defined
        const section = userData.section || 'CSE4';
        
        // Get schedule for student's section
        const response = await fetch(`http://localhost:3000/api/student/schedule/${section}`);
        const data = await response.json();
        
        // Display schedule
        displaySchedule(data);
    } catch (error) {
        console.error('Error fetching schedule:', error);
    }
}

// Function to display schedule
function displaySchedule(data) {
    const scheduleContainer = document.querySelector('.schedulebox');
    if (!scheduleContainer) return;

    if (!data || !data.schedule) {
        scheduleContainer.innerHTML = '<p class="no-data">No schedule available</p>';
        return;
    }

    // Create schedule table
    let scheduleHTML = `
        <table class="schedule-table">
            <thead>
                <tr>
                    <th>Day</th>
                    <th>Time</th>
                    <th>Course</th>
                    <th>Location</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Add each day's schedule
    data.schedule.forEach(daySchedule => {
        daySchedule.classes.forEach(cls => {
            scheduleHTML += `
                <tr>
                    <td>${daySchedule.day}</td>
                    <td>${cls.time}</td>
                    <td>${cls.course}</td>
                    <td>${cls.location}</td>
                </tr>
            `;
        });
    });

    scheduleHTML += `
            </tbody>
        </table>
    `;

    scheduleContainer.innerHTML = scheduleHTML;
}

// Function to display today's schedule
function displayTodaySchedule(data) {
    const todayScheduleContainer = document.querySelector('.today-schedule');
    if (!todayScheduleContainer) return;

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayClasses = data[today] || [];

    if (todayClasses.length === 0) {
        todayScheduleContainer.innerHTML = '<p class="no-data">No classes scheduled for today</p>';
        return;
    }

    let todayHTML = `
        <h3>Today's Schedule (${today})</h3>
        <div class="today-classes">
    `;

    todayClasses.forEach(cls => {
        todayHTML += `
            <div class="class-item">
                <div class="time">${cls.time}</div>
                <div class="course">${cls.course}</div>
                <div class="location">${cls.location}</div>
            </div>
        `;
    });

    todayHTML += '</div>';
    todayScheduleContainer.innerHTML = todayHTML;
} 