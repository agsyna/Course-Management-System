document.addEventListener("DOMContentLoaded", () => {
  // Check if user is already logged in
  const userData = sessionStorage.getItem('userData');
  if (userData) {
    const user = JSON.parse(userData);
    if (user.role === 'admin') {
      window.location.href = 'admin/index.html';
    } else if (user.role === 'faculty') {
      window.location.href = 'faculty/index.html';
    } else if (user.role === 'student') {
      window.location.href = 'student/student.html';
    }
  }
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
      } else if (data.user.role === 'admin') {
        window.location.href = 'admin/index.html';
      }
    } else {
      alert('Invalid credentials');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred during login. Please try again.');
  }
});


