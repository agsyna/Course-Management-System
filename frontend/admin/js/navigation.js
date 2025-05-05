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

  // Set active nav item based on current page
  setActiveNavItem();
});

function setActiveNavItem() {
  const currentPath = window.location.pathname;
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    const link = item.querySelector('a');
    if (link) {
      const href = link.getAttribute('href');
      if (currentPath.includes(href)) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    }
  });
}