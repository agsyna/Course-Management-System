document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in and is admin
  const userData = sessionStorage.getItem('userData');
  if (!userData) {
    window.location.href = '../login.html';
    return;
  }

  const user = JSON.parse(userData);
  if (user.role !== 'admin') {
    window.location.href = '../login.html';
    return;
  }

  // Update user name in header
  const userNameElement = document.querySelector('.user-name');
  if (userNameElement) {
    userNameElement.textContent = user.name;
  }

  // Update user avatar initial
  const userAvatarElement = document.querySelector('.user-avatar span');
  if (userAvatarElement) {
    userAvatarElement.textContent = user.name.charAt(0).toUpperCase();
  }

  // Handle mobile menu toggle
  const mobileMenuButton = document.getElementById('mobile-menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  
  if (mobileMenuButton && sidebar) {
    mobileMenuButton.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
  }

  // Handle logout
  const logoutButton = document.querySelector('.nav-item.logout');
  if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('userData');
      window.location.href = '../login.html';
    });
  }

  // Load dashboard data
  loadDashboardData();
});

async function loadDashboardData() {
  try {
    // Fetch statistics
    const statsResponse = await fetch('http://localhost:3000/api/admin/stats');
    const statsData = await statsResponse.json();

    if (statsData.success) {
      updateStatsCards(statsData.data);
    }

    // Fetch recent activity
    const activityResponse = await fetch('http://localhost:3000/api/admin/recent-activity');
    const activityData = await activityResponse.json();

    if (activityData.success) {
      updateRecentActivity(activityData.data);
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
}

function updateStatsCards(stats) {
  // Update total students
  const studentsValue = document.querySelector('.stats-card:nth-child(1) .stats-value');
  if (studentsValue) {
    studentsValue.textContent = stats.totalStudents || '0';
  }

  // Update total professors
  const professorsValue = document.querySelector('.stats-card:nth-child(2) .stats-value');
  if (professorsValue) {
    professorsValue.textContent = stats.totalProfessors || '0';
  }

  // Update active courses
  const coursesValue = document.querySelector('.stats-card:nth-child(3) .stats-value');
  if (coursesValue) {
    coursesValue.textContent = stats.activeCourses || '0';
  }
}

function updateRecentActivity(activities) {
  const activityList = document.querySelector('.activity-list');
  if (!activityList) return;

  activityList.innerHTML = activities.map(activity => `
    <li class="activity-item">
      <div class="activity-icon ${activity.type}">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${getActivityIcon(activity.type)}
        </svg>
      </div>
      <div class="activity-content">
        <p class="activity-text">${activity.description}</p>
        <span class="activity-time">${formatTimeAgo(activity.timestamp)}</span>
      </div>
    </li>
  `).join('');
}

function getActivityIcon(type) {
  switch (type) {
    case 'add':
      return '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>';
    case 'update':
      return '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>';
    case 'delete':
      return '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>';
    default:
      return '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>';
  }
}

function formatTimeAgo(timestamp) {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now - activityTime) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}

// Performance Chart
const performanceCtx = document.getElementById('performanceChart');
if (performanceCtx) {
  const performanceChart = new Chart(performanceCtx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Average Score',
          data: [75, 78, 76, 79, 85, 88],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Attendance Rate',
          data: [92, 90, 91, 89, 93, 94],
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          min: 60,
          max: 100,
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)'
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)'
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: 'rgba(255, 255, 255, 0.7)'
          }
        }
      }
    }
  });
}

// Enrollment Chart
const enrollmentCtx = document.getElementById('enrollmentChart');
if (enrollmentCtx) {
  const enrollmentChart = new Chart(enrollmentCtx, {
    type: 'bar',
    data: {
      labels: ['Computer Science', 'Mathematics', 'Physics', 'Biology', 'Engineering'],
      datasets: [
        {
          label: 'Current Semester',
          data: [320, 210, 180, 250, 290],
          backgroundColor: '#3b82f6'
        },
        {
          label: 'Previous Semester',
          data: [290, 200, 170, 240, 270],
          backgroundColor: '#8b5cf6'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)'
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)'
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: 'rgba(255, 255, 255, 0.7)'
          }
        }
      }
    }
  });
}

// Handle refresh buttons
const refreshButtons = document.querySelectorAll('.refresh-btn');

refreshButtons.forEach(button => {
  button.addEventListener('click', function() {
    // Add refresh animation
    this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>';
    this.classList.add('rotating');
    
    // Simulate data refresh
    setTimeout(() => {
      this.classList.remove('rotating');
      // You would typically update the data here
      console.log('Data refreshed');
    }, 1000);
  });
});

// Time filter change handler
const timeFilters = document.querySelectorAll('.time-filter');

timeFilters.forEach(filter => {
  filter.addEventListener('change', function() {
    const selectedValue = this.value;
    const chartContainer = this.closest('.card');
    
    // Add loading state
    if (chartContainer) {
      chartContainer.classList.add('loading');
      
      // Simulate data update
      setTimeout(() => {
        chartContainer.classList.remove('loading');
        console.log(`Time filter changed to: ${selectedValue}`);
        // Update chart data based on selected time filter
      }, 800);
    }
  });
});

// Add rotating animation
document.head.insertAdjacentHTML('beforeend', `
  <style>
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .rotating {
      animation: rotate 1s linear infinite;
    }
  </style>
`);