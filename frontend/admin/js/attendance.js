document.addEventListener('DOMContentLoaded', function() {
  // Attendance Chart
  const attendanceCtx = document.getElementById('attendanceChart');
  if (attendanceCtx) {
    const attendanceChart = new Chart(attendanceCtx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
        datasets: [
          {
            label: 'Present',
            data: [92, 90, 93, 91, 94, 92, 95, 93],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Absent',
            data: [5, 6, 4, 6, 3, 5, 3, 4],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Late',
            data: [3, 4, 3, 3, 3, 3, 2, 3],
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
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
            beginAtZero: true,
            stacked: false,
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

  // Add Attendance Modal
  const addAttendanceBtn = document.querySelector('.add-attendance-btn');
  const attendanceModal = document.getElementById('attendanceModal');
  const attendanceForm = document.getElementById('attendanceForm');
  const statusSelect = document.getElementById('status');
  const timeInContainer = document.getElementById('timeInContainer');

  if (addAttendanceBtn && attendanceModal) {
    addAttendanceBtn.addEventListener('click', function() {
      document.getElementById('modalTitle').textContent = 'Record Attendance';
      attendanceForm.reset();
      
      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('date').value = today;
      
      attendanceModal.style.display = 'flex';
    });
  }

  // Toggle time-in field based on status
  if (statusSelect && timeInContainer) {
    statusSelect.addEventListener('change', function() {
      if (this.value === 'absent') {
        timeInContainer.style.display = 'none';
      } else {
        timeInContainer.style.display = 'block';
      }
    });
  }

  // Handle form submission
  if (attendanceForm) {
    attendanceForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Here you would typically save the data using fetch or other methods
      console.log('Form submitted with data:', {
        student: document.getElementById('student').value,
        course: document.getElementById('course').value,
        date: document.getElementById('date').value,
        status: document.getElementById('status').value,
        timeIn: document.getElementById('timeIn').value,
        remarks: document.getElementById('remarks').value
      });
      
      // Close the modal
      attendanceModal.style.display = 'none';
      
      // Optionally show a success message or update the table
      alert('Attendance has been recorded successfully.');
    });
  }

  // Edit attendance buttons
  const editButtons = document.querySelectorAll('.edit-btn');
  
  editButtons.forEach(button => {
    button.addEventListener('click', function() {
      const row = this.closest('tr');
      if (!row) return;
      
      // Extract data from the row
      const cells = row.querySelectorAll('td');
      const studentName = cells[1].textContent;
      const course = cells[2].textContent;
      const date = cells[3].textContent;
      const status = cells[4].querySelector('.badge').textContent.toLowerCase();
      const timeIn = cells[5].textContent;
      const remarks = cells[6].textContent;
      
      // Set modal title
      document.getElementById('modalTitle').textContent = 'Edit Attendance';
      
      // Populate form with existing data
      // In a real application, you would use IDs instead of text matching
      const studentSelect = document.getElementById('student');
      const options = studentSelect.options;
      for (let i = 0; i < options.length; i++) {
        if (options[i].text.includes(studentName.trim())) {
          studentSelect.selectedIndex = i;
          break;
        }
      }
      
      // Set other fields
      document.getElementById('course').value = course.split(':')[0].toLowerCase();
      
      // Convert date format (May 01, 2025 -> 2025-05-01)
      const dateParts = date.split(',');
      const monthDay = dateParts[0].split(' ');
      const month = getMonthNumber(monthDay[0]);
      const day = monthDay[1].padStart(2, '0');
      const year = dateParts[1].trim();
      document.getElementById('date').value = `${year}-${month}-${day}`;
      
      document.getElementById('status').value = status;
      if (status === 'absent') {
        timeInContainer.style.display = 'none';
      } else {
        timeInContainer.style.display = 'block';
        document.getElementById('timeIn').value = convertTimeToInputFormat(timeIn);
      }
      
      document.getElementById('remarks').value = remarks === '-' ? '' : remarks;
      
      // Show the modal
      attendanceModal.style.display = 'flex';
    });
  });

  // Delete attendance buttons
  const deleteButtons = document.querySelectorAll('.delete-btn');
  
  deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
      const row = this.closest('tr');
      if (!row) return;
      
      const studentName = row.querySelectorAll('td')[1].textContent;
      const course = row.querySelectorAll('td')[2].textContent;
      
      if (confirm(`Are you sure you want to delete the attendance record for ${studentName} in ${course}?`)) {
        // Here you would typically delete the data using fetch or other methods
        console.log('Deleting attendance record');
        
        // Visual feedback - remove the row with animation
        row.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
        setTimeout(() => {
          row.style.opacity = '0';
          setTimeout(() => {
            row.remove();
          }, 300);
        }, 300);
      }
    });
  });

  // Apply filters button
  const filterBtn = document.querySelector('.filter-btn');
  
  if (filterBtn) {
    filterBtn.addEventListener('click', function() {
      const courseFilter = document.getElementById('course-filter').value;
      const dateFrom = document.getElementById('date-from').value;
      const dateTo = document.getElementById('date-to').value;
      const statusFilter = document.getElementById('status-filter').value;
      
      console.log('Filtering with:', {
        course: courseFilter,
        dateFrom,
        dateTo,
        status: statusFilter
      });
      
      // Here you would typically fetch filtered data and update the table
      
      // Visual feedback - add loading state
      this.textContent = 'Filtering...';
      this.disabled = true;
      
      setTimeout(() => {
        this.textContent = 'Apply Filters';
        this.disabled = false;
        
        // Show success message
        alert('Filters applied successfully.');
      }, 800);
    });
  }

  // Pagination buttons
  const paginationButtons = document.querySelectorAll('.pagination .page-btn:not(.prev-btn):not(.next-btn)');
  
  paginationButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      paginationButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Enable/disable prev/next buttons based on current page
      const currentPage = parseInt(this.textContent);
      const prevBtn = document.querySelector('.prev-btn');
      const nextBtn = document.querySelector('.next-btn');
      
      if (prevBtn) prevBtn.disabled = currentPage === 1;
      if (nextBtn) nextBtn.disabled = currentPage === 10;
      
      // Here you would typically fetch data for the selected page
      console.log(`Loading page ${currentPage}`);
    });
  });

  // Helper function to get month number from name
  function getMonthNumber(monthName) {
    const months = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
      'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
      'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    return months[monthName];
  }

  // Helper function to convert time to input format
  function convertTimeToInputFormat(timeStr) {
    if (timeStr === '-') return '';
    
    // Convert "9:05 AM" to "09:05"
    let [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    
    hours = parseInt(hours);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }
});