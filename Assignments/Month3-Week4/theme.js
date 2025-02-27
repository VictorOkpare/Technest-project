// theme.js
function initializeTheme() {
    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '🌓';
    document.body.appendChild(themeToggle);
  
    // Theme switching logic
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      themeToggle.innerHTML = newTheme === 'dark' ? '🌞' : '🌜';
    });
  

    themeToggle.innerHTML = savedTheme === 'dark' ? '🌞' : '🌜';
  }
  
  // Initialize theme when DOM loads
  document.addEventListener('DOMContentLoaded', initializeTheme);