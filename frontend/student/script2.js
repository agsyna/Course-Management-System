    // Assignments Chart
    const ctx1 = document.getElementById('assignmentsChart').getContext('2d');
    new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ['OS', 'ML', 'DBMS', 'Proj-2', 'M.A.D.'],
            datasets: [{
                label: 'Submitted',
                data: [5, 4, 6, 3, 2],
                backgroundColor: '#A9DFD8'
            }, {
                label: 'Failed',
                data: [1, 2, 1, 2, 3],
                backgroundColor: '#FCB859'
            }]
        },
        options: {
            responsive: true
        }
    });


    const attendanceCtx = document.getElementById('attendanceChart').getContext('2d');
    new Chart(attendanceCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Attendance',
          data: [75, 85, 70, 90, 85, 95, 88, 92, 85, 89, 91, 87],
          borderColor: '#10B981',
          tension: 0.4,
          fill: true,
          backgroundColor: 'rgba(16, 185, 129, 0.1)'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: '#A9DFD8'
            },
            ticks: {
              color: '#9CA3AF'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#9CA3AF'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });

// Get user data from session storage
const userData = JSON.parse(sessionStorage.getItem('userData'));
if (!userData) {
    window.location.href = 'login.html';
}

// Update student name and section
document.getElementById('studentName').textContent = 'Syna Agarwala';
document.getElementById('studentSection').textContent = 'CSE4';

// Fetch and display attendance data
async function fetchAttendanceData() {
    try {
        const response = await fetch(`http://localhost:3000/api/attendance/${userData.section}`);
        const data = await response.json();
        updateAttendanceStats(data.attendance);
        updateAttendanceChart(data.attendance);
    } catch (error) {
        console.error('Error fetching attendance data:', error);
    }
}

function updateAttendanceStats(attendanceData) {
    let totalPresent = 0;
    let totalSessions = 0;
    
    attendanceData.forEach(course => {
        const [present, total] = course.attendanceCount.split('/').map(Number);
        totalPresent += present;
        totalSessions += total;
    });

    const percentage = ((totalPresent / totalSessions) * 100).toFixed(1);
    document.getElementById('totalAttendance').textContent = `${totalPresent}/${totalSessions}`;
    document.getElementById('attendancePercentage').textContent = `${percentage}% last month`;
}

function updateAttendanceChart(attendanceData) {
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: attendanceData.map(course => course.courseName),
            datasets: [{
                label: 'Attendance Percentage',
                data: attendanceData.map(course => parseFloat(course.percentage)),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Fetch and display assignments
async function fetchAssignments() {
    try {
        const response = await fetch('http://localhost:3000/assignments');
        const data = await response.json();
        populateAssignmentsTable(data);
        updateAssignmentStats(data);
    } catch (error) {
        console.error('Error fetching assignments:', error);
    }
}

function populateAssignmentsTable(assignmentsData) {
    const tbody = document.getElementById('assignmentsTableBody');
    tbody.innerHTML = '';

    assignmentsData.forEach((assignment, index) => {
        const row = document.createElement('tr');
        const submissionPercentage = Math.floor(Math.random() * 100);
        const isToday = Math.random() > 0.5;
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${assignment.title}</td>
            <td>${assignment.points}</td>
            <td>${Math.random() > 0.5 ? 'Yes' : 'N/A'}</td>
            <td>
                <div class="progbar">
                    <div class="progfill" style="width: ${submissionPercentage}%"></div>
                </div>
            </td>
            <td><span class="deadline ${isToday ? 'today' : 'future'}">${isToday ? 'TODAY' : assignment.dueDate}</span></td>
        `;
        tbody.appendChild(row);
    });
}

function updateAssignmentStats(assignmentsData) {
    const submitted = Math.floor(Math.random() * assignmentsData.length);
    const pending = assignmentsData.length - submitted;
    document.getElementById('submittedAssignments').textContent = `${submitted} submitted`;
    document.getElementById('pendingAssignments').textContent = `${pending} pending`;
}

// Fetch and display courses
async function fetchCourses() {
    try {
        const response = await fetch('http://localhost:3000/api/courses');
        const data = await response.json();
        document.getElementById('totalCourses').textContent = `${data.courses.length} opted`;
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

// Fetch and display schedule
async function fetchSchedule() {
    try {
        const response = await fetch(`http://localhost:3000/api/student/schedule/${userData.section}`);
        const data = await response.json();
        if (data && data.schedule) {
            displayTodaySchedule(data.schedule);
            displayWeeklySchedule(data.schedule);
        }
    } catch (error) {
        console.error('Error fetching schedule:', error);
    }
}

function displayTodaySchedule(schedule) {
    const scheduleTableBody = document.querySelector('.schedulebox tbody');
    if (!scheduleTableBody) return;
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todaySchedule = schedule.find(day => day.day === today);
    
    if (!todaySchedule || !todaySchedule.classes || todaySchedule.classes.length === 0) {
        scheduleTableBody.innerHTML = '<tr><td colspan="4" class="text-center text-gray-500">No classes scheduled for today</td></tr>';
        return;
    }

    scheduleTableBody.innerHTML = todaySchedule.classes.map(classItem => `
        <tr>
            <td>${classItem.time}</td>
            <td>${classItem.course}</td>
            <td>${classItem.faculty}</td>
            <td>${classItem.location}</td>
        </tr>
    `).join('');
}

function displayWeeklySchedule(schedule) {
    const attendanceChart = document.getElementById('attendanceChart');
    const ctx = attendanceChart.getContext('2d');
    
    // Clear any existing chart
    if (window.attendanceChart) {
        window.attendanceChart.destroy();
    }

    // Create a new chart with schedule data
    window.attendanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: schedule.map(day => day.day),
            datasets: [{
                label: 'Classes per Day',
                data: schedule.map(day => day.classes.length),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Add schedule fetching to the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    fetchAttendanceData();
    fetchAssignments();
    fetchCourses();
    fetchSchedule();
});

// Signout function
function signOut() {
    window.location.href = '../login.html';
}

// Add event listener to signout link
document.addEventListener('DOMContentLoaded', () => {
    const signOutLink = document.querySelector('a[href="../login.html"]');
    if (signOutLink) {
        signOutLink.addEventListener('click', (e) => {
            e.preventDefault();
            signOut();
        });
    }
});
