document.addEventListener("DOMContentLoaded", () => {
  if (typeof loadAssignments === 'function') loadAssignments();
  if (typeof renderAttendanceChart === 'function') renderAttendanceChart();
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

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
      redirectToDashboard(data.user.role);
    } else {
      alert(data.message || 'Invalid credentials');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred during login. Please try again later.');
  }
});

function redirectToDashboard(role) {
  if (role === 'admin') {
    window.location.href = 'admin/index.html';
  } else if (role === 'faculty') {
    window.location.href = 'faculty/index.html';
  } else if (role === 'student') {
    window.location.href = 'student/student.html';
  } else {
    alert("Unknown user role: " + role);
  }
}
