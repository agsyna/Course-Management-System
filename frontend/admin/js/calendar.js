document.addEventListener('DOMContentLoaded', function() {
  // Calendar elements
  const btnPrevMonth = document.querySelector('.btn-prev-month');
  const btnNextMonth = document.querySelector('.btn-next-month');
  const currentMonthElement = document.querySelector('.current-month');
  const viewButtons = document.querySelectorAll('.view-btn');
  const addEventBtn = document.querySelector('.add-event-btn');
  const eventModal = document.getElementById('eventModal');
  const eventForm = document.getElementById('eventForm');
  const colorOptions = document.querySelectorAll('.color-option');
  
  // Set today's date
  const today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();
  
  // Previous month button
  if (btnPrevMonth) {
    btnPrevMonth.addEventListener('click', function() {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      updateCalendarHeader();
      // Here you would update the calendar grid
      console.log('Previous month clicked');
    });
  }
  
  // Next month button
  if (btnNextMonth) {
    btnNextMonth.addEventListener('click', function() {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      updateCalendarHeader();
      // Here you would update the calendar grid
      console.log('Next month clicked');
    });
  }
  
  // Update calendar header (current month/year)
  function updateCalendarHeader() {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    currentMonthElement.textContent = `${months[currentMonth]} ${currentYear}`;
  }
  
  // View buttons (Month, Week, Day)
  if (viewButtons) {
    viewButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        viewButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        const view = this.getAttribute('data-view');
        console.log(`Switching to ${view} view`);
        
        // Here you would update the calendar display based on the selected view
      });
    });
  }
  
  // Add Event button
  if (addEventBtn && eventModal) {
    addEventBtn.addEventListener('click', function() {
      document.getElementById('eventModalTitle').textContent = 'Add Event';
      eventForm.reset();
      
      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('eventDate').value = today;
      
      // Set default times
      document.getElementById('startTime').value = '09:00';
      document.getElementById('endTime').value = '10:00';
      
      // Reset color selection
      colorOptions.forEach(option => option.classList.remove('selected'));
      document.querySelector('.color-option[data-color="blue"]').classList.add('selected');
      document.getElementById('eventColor').value = 'blue';
      
      eventModal.style.display = 'flex';
    });
  }
  
  // Color picker
  if (colorOptions) {
    colorOptions.forEach(option => {
      option.addEventListener('click', function() {
        // Remove selected class from all options
        colorOptions.forEach(opt => opt.classList.remove('selected'));
        
        // Add selected class to clicked option
        this.classList.add('selected');
        
        // Update hidden input value
        const color = this.getAttribute('data-color');
        document.getElementById('eventColor').value = color;
      });
    });
  }
  
  // Handle event form submission
  if (eventForm) {
    eventForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Here you would typically save the data using fetch or other methods
      console.log('Form submitted with data:', {
        title: document.getElementById('eventTitle').value,
        date: document.getElementById('eventDate').value,
        type: document.getElementById('eventType').value,
        startTime: document.getElementById('startTime').value,
        endTime: document.getElementById('endTime').value,
        location: document.getElementById('eventLocation').value,
        description: document.getElementById('eventDescription').value,
        color: document.getElementById('eventColor').value
      });
      
      // Close the modal
      eventModal.style.display = 'none';
      
      // Optionally show a success message
      alert('Event has been saved successfully.');
    });
  }
  
  // Make calendar days interactive
  const calendarDays = document.querySelectorAll('.calendar-day');
  
  if (calendarDays) {
    calendarDays.forEach(day => {
      day.addEventListener('click', function(e) {
        // Ignore clicks on event items
        if (e.target.closest('.event-item')) return;
        
        const dayNumber = this.querySelector('.day-number').textContent;
        
        // Get the month (current, prev, or next)
        let month = currentMonth;
        let year = currentYear;
        
        if (this.classList.contains('prev-month')) {
          month = month - 1;
          if (month < 0) {
            month = 11;
            year--;
          }
        } else if (this.classList.contains('next-month')) {
          month = month + 1;
          if (month > 11) {
            month = 0;
            year++;
          }
        }
        
        // Format date as YYYY-MM-DD
        const date = `${year}-${(month + 1).toString().padStart(2, '0')}-${dayNumber.padStart(2, '0')}`;
        
        // Open the add event modal with the selected date
        document.getElementById('eventModalTitle').textContent = 'Add Event';
        eventForm.reset();
        document.getElementById('eventDate').value = date;
        document.getElementById('startTime').value = '09:00';
        document.getElementById('endTime').value = '10:00';
        
        // Reset color selection
        colorOptions.forEach(option => option.classList.remove('selected'));
        document.querySelector('.color-option[data-color="blue"]').classList.add('selected');
        document.getElementById('eventColor').value = 'blue';
        
        eventModal.style.display = 'flex';
      });
    });
  }
  
  // Make event items clickable
  const eventItems = document.querySelectorAll('.event-item');
  
  if (eventItems) {
    eventItems.forEach(item => {
      item.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent triggering the calendar day click
        
        const title = this.querySelector('.event-title').textContent;
        const time = this.querySelector('.event-time').textContent;
        const color = this.style.backgroundColor;
        
        // Get the date from the parent day
        const day = this.closest('.calendar-day');
        const dayNumber = day.querySelector('.day-number').textContent;
        
        // Open the edit event modal
        document.getElementById('eventModalTitle').textContent = 'Edit Event';
        
        // Populate form with existing data
        document.getElementById('eventTitle').value = title;
        
        // Set the date
        let month = currentMonth;
        let year = currentYear;
        
        if (day.classList.contains('prev-month')) {
          month = month - 1;
          if (month < 0) {
            month = 11;
            year--;
          }
        } else if (day.classList.contains('next-month')) {
          month = month + 1;
          if (month > 11) {
            month = 0;
            year++;
          }
        }
        
        const date = `${year}-${(month + 1).toString().padStart(2, '0')}-${dayNumber.padStart(2, '0')}`;
        document.getElementById('eventDate').value = date;
        
        // Parse time (e.g., "9:00 AM" to "09:00")
        const startTimeParts = time.split(' - ')[0].split(':');
        let startHours = parseInt(startTimeParts[0]);
        const startMinutes = startTimeParts[1].split(' ')[0];
        const period = startTimeParts[1].split(' ')[1];
        
        if (period === 'PM' && startHours < 12) startHours += 12;
        if (period === 'AM' && startHours === 12) startHours = 0;
        
        document.getElementById('startTime').value = `${startHours.toString().padStart(2, '0')}:${startMinutes}`;
        
        // Set end time to 1 hour after start time
        document.getElementById('endTime').value = `${(startHours + 1).toString().padStart(2, '0')}:${startMinutes}`;
        
        // Set the color
        const colorMap = {
          'rgba(59, 130, 246, 0.2)': 'blue',
          'rgba(16, 185, 129, 0.2)': 'green',
          'rgba(239, 68, 68, 0.2)': 'red',
          'rgba(245, 158, 11, 0.2)': 'yellow',
          'rgba(139, 92, 246, 0.2)': 'purple'
        };
        
        const selectedColor = colorMap[color] || 'blue';
        
        colorOptions.forEach(option => {
          option.classList.remove('selected');
          if (option.getAttribute('data-color') === selectedColor) {
            option.classList.add('selected');
          }
        });
        
        document.getElementById('eventColor').value = selectedColor;
        
        // Set placeholder values for other fields
        document.getElementById('eventType').value = 'meeting';
        document.getElementById('eventLocation').value = 'Campus';
        document.getElementById('eventDescription').value = 'Event details would go here.';
        
        eventModal.style.display = 'flex';
      });
    });
  }
  
  // Initialize
  updateCalendarHeader();
});