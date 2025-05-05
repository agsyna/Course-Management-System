document.addEventListener('DOMContentLoaded', function() {
  // Assignment Completion Chart
  const assignmentCtx = document.getElementById('assignmentChart');
  if (assignmentCtx) {
    const assignmentChart = new Chart(assignmentCtx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Pending', 'Overdue'],
        datasets: [
          {
            data: [16, 12, 3],
            backgroundColor: [
              '#10b981', // Success - green
              '#3b82f6', // Primary - blue
              '#ef4444'  // Danger - red
            ],
            borderWidth: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: 'rgba(255, 255, 255, 0.7)',
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  // Add Assignment Modal
  const addAssignmentBtn = document.querySelector('.add-assignment-btn');
  const assignmentModal = document.getElementById('assignmentModal');
  const assignmentForm = document.getElementById('assignmentForm');

  if (addAssignmentBtn && assignmentModal) {
    addAssignmentBtn.addEventListener('click', function() {
      document.getElementById('assignmentModalTitle').textContent = 'Add Assignment';
      assignmentForm.reset();
      
      // Set default dates
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('assignedDate').value = today;
      
      // Set due date to 2 weeks from today
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
      document.getElementById('dueDate').value = dueDate.toISOString().split('T')[0];
      
      assignmentModal.style.display = 'flex';
    });
  }

  // Handle assignment form submission
  if (assignmentForm) {
    assignmentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Here you would typically save the data using fetch or other methods
      console.log('Form submitted with data:', {
        title: document.getElementById('assignmentTitle').value,
        course: document.getElementById('assignmentCourse').value,
        description: document.getElementById('assignmentDescription').value,
        assignedDate: document.getElementById('assignedDate').value,
        dueDate: document.getElementById('dueDate').value,
        maxScore: document.getElementById('maxScore').value
      });
      
      // Close the modal
      assignmentModal.style.display = 'none';
      
      // Optionally show a success message or update the table
      alert('Assignment has been saved successfully.');
    });
  }

  // Edit assignment buttons
  const editButtons = document.querySelectorAll('.edit-btn');
  
  editButtons.forEach(button => {
    button.addEventListener('click', function() {
      const row = this.closest('tr');
      if (!row) return;
      
      // Extract data from the row
      const cells = row.querySelectorAll('td');
      const title = cells[1].textContent;
      const course = cells[2].textContent;
      const assignedDate = cells[3].textContent;
      const dueDate = cells[4].textContent;
      
      // Set modal title
      document.getElementById('assignmentModalTitle').textContent = 'Edit Assignment';
      
      // Populate form with existing data
      document.getElementById('assignmentTitle').value = title;
      document.getElementById('assignmentCourse').value = course.split(':')[0].toLowerCase();
      
      // Convert date format (Apr 15, 2025 -> 2025-04-15)
      document.getElementById('assignedDate').value = formatDateForInput(assignedDate);
      document.getElementById('dueDate').value = formatDateForInput(dueDate);
      
      // Placeholder for description which wouldn't be in the table
      document.getElementById('assignmentDescription').value = 'Assignment description would go here. This is a placeholder since the actual description is not displayed in the table.';
      
      // Show the modal
      assignmentModal.style.display = 'flex';
    });
  });

  // View assignment buttons
  const viewButtons = document.querySelectorAll('.view-btn');
  
  viewButtons.forEach(button => {
    button.addEventListener('click', function() {
      const row = this.closest('tr');
      if (!row) return;
      
      const assignmentId = row.querySelectorAll('td')[0].textContent;
      const title = row.querySelectorAll('td')[1].textContent;
      
      alert(`Viewing details for assignment: ${title} (${assignmentId})\n\nIn a real application, this would open a detailed view with submissions, grades, and other information.`);
    });
  });

  // Delete assignment buttons
  const deleteButtons = document.querySelectorAll('.delete-btn');
  
  deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
      const row = this.closest('tr');
      if (!row) return;
      
      const assignmentId = row.querySelectorAll('td')[0].textContent;
      const title = row.querySelectorAll('td')[1].textContent;
      
      if (confirm(`Are you sure you want to delete the assignment "${title}" (${assignmentId})?`)) {
        // Here you would typically delete the data using fetch or other methods
        console.log(`Deleting assignment ${assignmentId}`);
        
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
      const courseFilter = document.getElementById('assignment-course-filter').value;
      const statusFilter = document.getElementById('assignment-status-filter').value;
      const dateFrom = document.getElementById('assignment-date-from').value;
      const dateTo = document.getElementById('assignment-date-to').value;
      
      console.log('Filtering with:', {
        course: courseFilter,
        status: statusFilter,
        dateFrom,
        dateTo
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
      if (nextBtn) nextBtn.disabled = currentPage === 8;
      
      // Here you would typically fetch data for the selected page
      console.log(`Loading page ${currentPage}`);
    });
  });

  // Helper function to format date
  function formatDateForInput(dateStr) {
    // Convert "Apr 15, 2025" to "2025-04-15"
    const dateParts = dateStr.split(',');
    const monthDay = dateParts[0].split(' ');
    const month = getMonthNumber(monthDay[0]);
    const day = monthDay[1].padStart(2, '0');
    const year = dateParts[1].trim();
    return `${year}-${month}-${day}`;
  }

  // Helper function to get month number from name
  function getMonthNumber(monthName) {
    const months = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
      'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
      'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    return months[monthName];
  }
});