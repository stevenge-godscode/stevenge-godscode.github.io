/* filepath: /home/azureuser/homepage/src/js/main.js */
document.addEventListener('DOMContentLoaded', () => {
  // Load header
  fetch('/components/header.html')
    .then(response => response.text())
    .then(data => {
      document.querySelector('header.main-header').innerHTML = data;
      // 在header加载完成后设置当前页面的active状态
      const currentPath = window.location.pathname;
      const navLinks = document.querySelectorAll('.nav-links a');
      navLinks.forEach(link => {
        if (currentPath.includes(link.getAttribute('href'))) {
          link.classList.add('active');
        }
      });
    });

  // Load footer
  fetch('/components/footer.html')
    .then(response => response.text())
    .then(data => {
      document.querySelector('footer.main-footer').innerHTML = data;
    });

  // Mobile menu toggle
  document.addEventListener('click', (e) => {
    if (e.target.closest('.mobile-menu')) {
      document.querySelector('.nav-links').classList.toggle('active');
    }
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
});
