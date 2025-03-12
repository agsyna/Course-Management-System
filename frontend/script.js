

//login function
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

// fetch assignments
function loadAssignments() 
{
  fetch("http://localhost:3000/assignments")
    .then(response => response.json())
    .then(assignments => {
      let table = document.getElementById('assignmentsTable'); 

      assignments.forEach((assignment, index) => 
        {
        let row = document.createElement('tr');
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${assignment.title}</td>
          <td>${assignment.points}</td>
          <td>${assignment.dueDate}</td>
        `;
        table.appendChild(row);
      });
    })
    .catch(error => console.error("Error:", error));
}

// Submit assignment
function handleSubmit(event) {
  event.preventDefault();

  const newAssignment = {
    title: document.querySelector('input[type="text"]').value,
    instructions: document.querySelector('textarea').value,


    dueDate: document.querySelector('input[type="date"]').value,
    points: document.querySelector('input[type="number"]').value,
    submissions: 0
  };

  fetch("http://localhost:3000/assignments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newAssignment)

  })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
      } else {
        alert(data.message);
        loadAssignments(); 
        window.close();
      }
    })
    .catch(error => console.error("Error:", error));
}

window.addEventListener('message', function(event) 
{
  if (event.data === 'assignmentSubmitted') {
    document.getElementById('successDialog').classList.remove('hidden');
    loadAssignments(); 
  }
});

// Load assignments 
window.onload = loadAssignments;

document.addEventListener("DOMContentLoaded", () => 
  {

  const calendarBody = document.getElementById("calendarBody");
  const currentMonthElement = document.getElementById("currentMonth");

  const prevMonthButton = document.getElementById("prevMonth");
  const nextMonthButton = document.getElementById("nextMonth");

  let currentDate = new Date();
  let assignments = {}; 

  const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

  
  function fetchAssignments() {
      fetch("../data/calendar.json") 

          .then(response => 
            {

              if (!response.ok) throw new Error("Failed to load calendar.json");
              return response.json();
          })
          .then(data => 
            {
              assignments = data; 
              console.log("Assignments Loaded:", assignments);

              generateCalendar(currentDate); 
          })
          .catch(error => console.error("Error loading assignments:", error));
  }

  
  function getAssignmentsForDate(date) 
  
  {
      const dateStr = date.toISOString().split("T")[0]; 
      return assignments[dateStr] || [];
  }

  
  function generateCalendar(date) {
      console.log("Generating calendar for:", date);

      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const firstDayIndex = firstDay.getDay();
      const daysInMonth = lastDay.getDate();

      currentMonthElement.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      calendarBody.innerHTML = "";

      let dayCount = 1;
      for (let i = 0; i < 6; i++)
         { 

          let row = document.createElement("tr");
          for (let j = 0; j < 7; j++) 
            { 
              let cell = document.createElement("td");



              if (i === 0 && j < firstDayIndex) 
                {
                  cell.innerHTML = ""; 
              } 
              else if (dayCount <= daysInMonth)
                 {
                  const currentDateObj = new Date(date.getFullYear(), date.getMonth(), dayCount);

                  const dayAssignments = getAssignmentsForDate(currentDateObj);

                  cell.innerHTML = `<span class="date-number">${dayCount}</span>`;
                  
                  if (dayAssignments.length > 0) 
                    {
                      const assignmentList = document.createElement("div");

                      assignmentList.classList.add("assignments");


                      dayAssignments.forEach(assignment => 
                        {
                          let assignmentDiv = document.createElement("div");
                          assignmentDiv.classList.add("assignment");


                          assignmentDiv.textContent = assignment;
                          assignmentList.appendChild(assignmentDiv);
                      });
                      cell.appendChild(assignmentList);
                  }
                  dayCount++;
              }
              row.appendChild(cell);
          }
          calendarBody.appendChild(row);
          if (dayCount > daysInMonth) break; 
      }
  }

  
  prevMonthButton.addEventListener("click", () =>
     {
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

      generateCalendar(currentDate);
  });

  
  nextMonthButton.addEventListener("click", () => 
    {
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

      generateCalendar(currentDate);
  });

  fetchAssignments(); 
});
