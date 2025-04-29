document.addEventListener("DOMContentLoaded", () => {
  loadAssignments();
});


async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
      const response = await fetch('../data/users.json');
      if (!response.ok) {
          throw new Error('Failed to fetch user data');
      }

      const users = await response.json();

      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
          sessionStorage.setItem('currentUser', JSON.stringify(user));

          if (user.role === 'faculty') {
              window.location.href = 'index.html';
          } else {
              window.location.href = 'student.html';
          }
      } else {
          alert('Invalid credentials. Please try again.');
      }
  } catch (error) {
      console.error('Error fetching users:', error);
      alert('An error occurred while logging in. Please try again later.');
  }
}


//first chart of index
document.addEventListener("DOMContentLoaded", () => 
  
  {
  const attendanceCanvas = document.getElementById("attendanceChart");
  if (attendanceCanvas) {
      const attendanceCtx = attendanceCanvas.getContext("2d");
      new Chart(attendanceCtx, 
        
        {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Attendance',
            data: [75, 85, 70, 90, 85, 95],
            borderColor: '#10B981',
            tension: 0.4,
            fill: true,
            backgroundColor: 'rgba(16, 185, 129, 0.1)'
          }]
        },
        options: 
        {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255, 255, 255, 0.1)' }, 
              ticks: { color: '#9CA3AF' }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#9CA3AF' }
            }
          },
          plugins: {
            legend: {
              position: 'top',
              labels: { color: '#9CA3AF' }
            }
          }
        }
      });
  } 
  
  else 
  
  {
      console.error("Element with ID 'attendanceChart' not found.");
  }
});



// redirected to create assignment
function openAssignmentForm() 
{
  window.open('assignmentcreate.html', 'assignmentForm', 'width=800,height=600');
}


function closeDialog() 

{
  document.getElementById('successDialog').classList.add('hidden');
}
function loadAssignments() {
  fetch("http://localhost:3000/assignments")
      .then(response => response.json())
      .then(assignments => {
          const table = document.getElementById('assignmentsTable');
          if (!table) {
              console.error('Table element not found');
              return;
          }
          
          table.innerHTML = '';

          assignments.forEach((assignment, index) => {
            const row = document.createElement('tr');
          
            row.innerHTML = `
              <td style="padding: 8px; text-align: center;">${index + 1}</td>
              <td style="padding: 8px; text-align: center;">${assignment.title}</td>
              <td style="padding: 8px; text-align: center;">${assignment.points}</td>
              <td style="padding: 8px; text-align: center;">${assignment.dueDate}</td>
              <td style="padding: 8px; text-align: center;">${assignment.submissions}</td>
              <td style="padding: 8px; text-align: center;">
                <button 
                  onclick="editAssignment('${assignment.title}', '${assignment.dueDate}')"
                  style="
                    padding: 6px 12px;
                    background-color: #3B82F6; /* blue-500 */
                    color: white;
                    border: none;
                    border-radius: 6px;
                    margin-right: 8px;
                    cursor: pointer;
                  "
                  onmouseover="this.style.backgroundColor='#2563EB'" 
                  onmouseout="this.style.backgroundColor='#3B82F6'"
                >
                  Edit
                </button>
                <button 
                  onclick="deleteAssignment('${assignment.title}', '${assignment.dueDate}')"
                  style="
                    padding: 6px 12px;
                    background-color: #EF4444; /* red-500 */
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                  "
                  onmouseover="this.style.backgroundColor='#DC2626'" 
                  onmouseout="this.style.backgroundColor='#EF4444'"
                >
                  Delete
                </button>
              </td>
            `;
          
            table.appendChild(row);
          });
          
      })
      .catch(error => {
          console.error("Error loading assignments:", error);
          alert("Failed to load assignments");
      });
}

function deleteAssignment(title, date) {
  if (!confirm('Are you sure you want to delete this assignment?')) {
      return;
  }

  fetch(`http://localhost:3000/assignments/${encodeURIComponent(title)}/${date}`, {
      method: 'DELETE'
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Failed to delete assignment');
      }
      return response.json();
  })
  .then(data => {
      alert(data.message);
      loadAssignments(); // Refresh the table
  })
  .catch(error => {
      console.error("Error deleting assignment:", error);
      alert("Failed to delete assignment");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadAssignments();
});


async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
      const response = await fetch('../data/users.json');
      if (!response.ok) {
          throw new Error('Failed to fetch user data');
      }

      const users = await response.json();

      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
          sessionStorage.setItem('currentUser', JSON.stringify(user));

          if (user.role === 'faculty') {
              window.location.href = 'index.html';
          } else {
              window.location.href = 'student.html';
          }
      } else {
          alert('Invalid credentials. Please try again.');
      }
  } catch (error) {
      console.error('Error fetching users:', error);
      alert('An error occurred while logging in. Please try again later.');
  }
}


//first chart of index
document.addEventListener("DOMContentLoaded", () => 
  
  {
  const attendanceCanvas = document.getElementById("attendanceChart");
  if (attendanceCanvas) {
      const attendanceCtx = attendanceCanvas.getContext("2d");
      new Chart(attendanceCtx, 
        
        {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Attendance',
            data: [75, 85, 70, 90, 85, 95],
            borderColor: '#10B981',
            tension: 0.4,
            fill: true,
            backgroundColor: 'rgba(16, 185, 129, 0.1)'
          }]
        },
        options: 
        {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255, 255, 255, 0.1)' }, 
              ticks: { color: '#9CA3AF' }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#9CA3AF' }
            }
          },
          plugins: {
            legend: {
              position: 'top',
              labels: { color: '#9CA3AF' }
            }
          }
        }
      });
  } 
  
  else 
  
  {
      console.error("Element with ID 'attendanceChart' not found.");
  }
});



// redirected to create assignment
function openAssignmentForm() 
{
  window.open('assignmentcreate.html', 'assignmentForm', 'width=800,height=600');
}


function closeDialog() 

{
  document.getElementById('successDialog').classList.add('hidden');
}



function loadAssignments() {
  fetch("http://localhost:3000/assignments")
      .then(response => response.json())
      .then(assignments => {
          const table = document.getElementById('assignmentsTable');
          if (!table) {
              console.error('Table element not found');
              return;
          }
          table.innerHTML = '';
          assignments.forEach((assignment, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td class="py-2">${index + 1}</td>
              <td class="py-2">${assignment.title}</td>
              <td class="py-2">${assignment.points}</td>
              <td class="py-2">${assignment.dueDate}</td>
              <td class="py-2">${assignment.submissions}</td>
              <td class="py-2">
                  <button onclick="editAssignment('${assignment.title}', '${assignment.dueDate}')" 
                          class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2">
                      Edit
                  </button>
                  <button onclick="deleteAssignment('${assignment.title}', '${assignment.dueDate}')" 
                          class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                      Delete
                  </button>
              </td>
            `;
            table.appendChild(row);
          });
      })
      .catch(error => {
          console.error("Error loading assignments:", error);
          alert("Failed to load assignments");
      });
}

function deleteAssignment(title, date) {
  if (!confirm('Are you sure you want to delete this assignment?')) {
      return;
  }
  fetch(`http://localhost:3000/assignments/${encodeURIComponent(title)}/${date}`, {
      method: 'DELETE'
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Failed to delete assignment');
      }
      return response.json();
  })
  .then(data => {
      alert(data.message);
      loadAssignments();
  })
  .catch(error => {
      console.error("Error deleting assignment:", error);
      alert("Failed to delete assignment");
  });
}

function editAssignment(title, date) {
  // Open the form with query parameters for edit mode
  window.open(`assignmentcreate.html?edit=true&title=${encodeURIComponent(title)}&date=${date}`, 'assignmentForm', 'width=800,height=600');
}

function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const assignmentData = {
      title: form.querySelector('input[name="title"]').value,
      instructions: form.querySelector('textarea[name="instructions"]').value,
      dueDate: form.querySelector('input[name="dueDate"]').value,
      points: form.querySelector('input[name="points"]').value,
      submissions: 0
  };

  if (!assignmentData.title || !assignmentData.dueDate || !assignmentData.points) {
      alert('Please fill in all required fields');
      return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const isEditMode = urlParams.get('edit') === 'true';
  let url, method;
  if (isEditMode) {
      const oldTitle = urlParams.get('title');
      const oldDate = urlParams.get('date');
      url = `http://localhost:3000/assignments/${encodeURIComponent(oldTitle)}/${oldDate}`;
      method = 'PUT';
  } else {
      url = "http://localhost:3000/assignments";
      method = 'POST';
  }

  fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignmentData)
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Failed to save assignment');
      }
      return response.json();
  })
  .then(data => {
      alert(data.message);
      if (window.opener) {
        window.opener.postMessage('assignmentUpdated', '*');
        window.location.href='index.html'
    }
  })
  .catch(error => {
      console.error("Error saving assignment:", error);
      alert("Failed to save assignment");
  });
}

// Listener to refresh assignments on update (used in index.html)
window.addEventListener('message', (event) => {
  if (event.data === 'assignmentUpdated') {
      loadAssignments();
  }
});

function loadCalendar() {
  fetch("http://localhost:3000/calendar")
    .then(response => response.json())
    .then(calendarData => {
      let today = new Date();
      let currentMonth = today.getMonth();
      let currentYear = today.getFullYear();

      renderCalendar(currentMonth, currentYear, calendarData);

      document.getElementById('prevMonth').addEventListener('click', () => {
          currentMonth--;
          if (currentMonth < 0) {
              currentMonth = 11;
              currentYear--;
          }
          renderCalendar(currentMonth, currentYear, calendarData);
      });

      document.getElementById('nextMonth').addEventListener('click', () => {
          currentMonth++;
          if (currentMonth > 11) {
              currentMonth = 0;
              currentYear++;
          }
          renderCalendar(currentMonth, currentYear, calendarData);
      });
    })
    .catch(error => {
      console.error("Error loading calendar data:", error);
    });
}

function renderCalendar(month, year, calendarData) {
  const calendarBody = document.getElementById('calendarBody');
  const currentMonthSpan = document.getElementById('currentMonth');
  if (!calendarBody || !currentMonthSpan) return;

  calendarBody.innerHTML = '';

  const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"];
  currentMonthSpan.textContent = `${monthNames[month]} ${year}`;

  let firstDay = new Date(year, month, 1).getDay();
  firstDay = firstDay === 0 ? 7 : firstDay; // Treat Sunday as 7

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let date = 1;
  for (let i = 0; i < 6; i++) {
      const row = document.createElement('tr');
      for (let j = 1; j <= 7; j++) {
          const cell = document.createElement('td');
          if (i === 0 && j < firstDay) {
              cell.innerText = '';
          } else if (date > daysInMonth) {
              cell.innerText = '';
          } else {
              cell.innerText = date;
              
              // YYYY-MM-DD format
              const monthStr = (month + 1).toString().padStart(2, '0');
              const dayStr = date.toString().padStart(2, '0');
              const dateStr = `${year}-${monthStr}-${dayStr}`;

              if (calendarData[dateStr]) {
                  const deadlineDiv = document.createElement('div');
                  deadlineDiv.className = 'deadline';
                  deadlineDiv.style.fontSize = '0.7rem';
                  deadlineDiv.style.color = '#EF4444';
                  deadlineDiv.innerHTML = calendarData[dateStr].join("<br>");
                  cell.appendChild(deadlineDiv);
              }
              date++;
          }
          row.appendChild(cell);
      }
      calendarBody.appendChild(row);
      if (date > daysInMonth) break;
  }
}

// Call loadCalendar only on the calendar page.
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("calendarBody") && document.getElementById("currentMonth")) {
      loadCalendar();
  }
});
document.addEventListener("DOMContentLoaded", () => {
  loadAssignments();
});

