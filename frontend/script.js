document.addEventListener("DOMContentLoaded", () => {
  loadAssignments();
  renderAttendanceChart();
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.success) {
      // Store user data in session storage
      sessionStorage.setItem('userData', JSON.stringify(data.user));
      
      // Redirect based on role
      if (data.user.role === 'student') {
        window.location.href = 'student/student.html';
      } else if (data.user.role === 'faculty') {
        window.location.href = 'faculty/index.html';
      }
    } else {
      alert('Invalid credentials');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred during login');
  }
});

function renderAttendanceChart() {
  const canvas = document.getElementById("attendanceChart");
  if (!canvas) {
    console.error("Element with ID 'attendanceChart' not found.");
    return;
  }

  const ctx = canvas.getContext("2d");
  new Chart(ctx, {
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
    options: {
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

function openAssignmentForm() {
  window.open('assignmentcreate.html', 'assignmentForm', 'width=800,height=600');
}

function closeDialog() {
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
          <td class="py-2 text-center">${index + 1}</td>
          <td class="py-2 text-center">${assignment.title}</td>
          <td class="py-2 text-center">${assignment.points}</td>
          <td class="py-2 text-center">${assignment.dueDate}</td>
          <td class="py-2 text-center">${assignment.submissions}</td>
          <td class="py-2 text-center">
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
  if (!confirm('Are you sure you want to delete this assignment?')) return;

  fetch(`http://localhost:3000/assignments/${encodeURIComponent(title)}/${date}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (!response.ok) throw new Error('Failed to delete assignment');
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
  window.open(`assignmentcreate.html?edit=true&title=${encodeURIComponent(title)}&date=${date}`, 'assignmentForm', 'width=800,height=600');
}
