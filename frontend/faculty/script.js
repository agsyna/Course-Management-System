// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Load assignments when the page loads
    loadAssignments();
    
    // Initialize charts
    initializeCharts();
});

// Function to open the assignment creation form
function openAssignmentForm() {
    window.open('assignmentcreate.html', 'assignmentForm', 'width=800,height=600');
}

// Function to load assignments from the server
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
                    <td class="py-2 text-center">${assignment.submissions || 0}</td>
                    <td class="py-2 text-center">
                        <div class="flex justify-center space-x-2">
                            <button onclick="editAssignment('${assignment.title}', '${assignment.dueDate}')" 
                                class="edit-btn">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                    </path>
                                </svg>
                            </button>
                            <button onclick="deleteAssignment('${assignment.title}', '${assignment.dueDate}')" 
                                class="delete-btn">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                    </path>
                                </svg>
                            </button>
                        </div>
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

// Function to edit an assignment
function editAssignment(title, date) {
    window.open(`assignmentcreate.html?edit=true&title=${encodeURIComponent(title)}&date=${date}`, 'assignmentForm', 'width=800,height=600');
}

// Function to delete an assignment
function deleteAssignment(title, date) {
    if (confirm(`Are you sure you want to delete the assignment "${title}"?`)) {
        fetch(`http://localhost:3000/assignments/${encodeURIComponent(title)}/${date}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                loadAssignments(); // Reload the assignments table
                showSuccessDialog('Assignment deleted successfully!');
            } else {
                throw new Error('Failed to delete assignment');
            }
        })
        .catch(error => {
            console.error("Error deleting assignment:", error);
            alert("Failed to delete assignment");
        });
    }
}

// Function to show success dialog
function showSuccessDialog(message) {
    const dialog = document.getElementById('successDialog');
    const dialogMessage = dialog.querySelector('p');
    dialogMessage.textContent = message;
    dialog.classList.remove('hidden');
}

// Function to close dialog
function closeDialog() {
    document.getElementById('successDialog').classList.add('hidden');
}

// Function to initialize charts
function initializeCharts() {
    // Attendance Chart
    const attendanceCtx = document.getElementById('attendanceChart');
    if (attendanceCtx) {
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
    }
} 

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
  
  