function initializeTheme() {
   
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '🌓';
    document.body.appendChild(themeToggle);

   
    themeToggle.style.position = 'fixed';
    themeToggle.style.bottom = '20px';
    themeToggle.style.right = '20px';
    themeToggle.style.zIndex = '1000';
    themeToggle.style.background = 'var(--theme3)';
    themeToggle.style.color = 'var(--text-color)';
    themeToggle.style.border = 'none';
    themeToggle.style.borderRadius = '50%';
    themeToggle.style.width = '50px';
    themeToggle.style.height = '50px';
    themeToggle.style.cursor = 'pointer';
    themeToggle.style.fontSize = '24px';
    themeToggle.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';

 
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        themeToggle.innerHTML = newTheme === 'dark' ? '🌞' : '🌜';
        themeToggle.style.background = newTheme === 'dark' ? 'var(--theme3)' : 'var(--theme1)';
    });

    themeToggle.innerHTML = savedTheme === 'dark' ? '🌞' : '🌜';
    themeToggle.style.background = savedTheme === 'dark' ? 'var(--theme3)' : 'var(--theme1)';
}


document.addEventListener('DOMContentLoaded', initializeTheme);
