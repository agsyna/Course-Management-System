
// Assignments Chart
const assignmentsCtx = document.getElementById('assignmentsChart').getContext('2d');
new Chart(assignmentsCtx, {
  type: 'bar',
  data: {
    labels: ['ML', 'DBMS', 'Proj-2', 'SE', 'MAP-D'],
    datasets: [{
      label: 'Submitted',
      data: [85, 65, 45, 75, 35],
      backgroundColor: '#60A5FA',
      borderRadius: 5,
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
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

// Attendance Chart
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
          color: 'rgba(255, 255, 255, 0.1)'
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

// Attendance Gauge
const gaugeCtx = document.getElementById('attendanceGauge').getContext('2d');
new Chart(gaugeCtx, {
  type: 'doughnut',
  data: {
    datasets: [{
      data: [83, 17],
      backgroundColor: [
        '#10B981',
        'rgba(255, 255, 255, 0.1)'
      ],
      borderWidth: 0
    }]
  },
  options: {
    responsive: true,
    cutout: '80%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    }
  }
});