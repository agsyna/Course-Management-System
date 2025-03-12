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
