// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navbarLinks = document.querySelector('.navbar-links');

hamburger.addEventListener('click', () => {
    navbarLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
});


document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navbarLinks = document.querySelector('.navbar-links');
    const videoEmbeds = document.querySelectorAll('.video-embed');

    // Toggle hamburger menu
    hamburger.addEventListener('click', function () {
        navbarLinks.classList.toggle('active');

        // Pause all YouTube videos and hide iframes when the menu is open
        if (navbarLinks.classList.contains('active')) {
            videoEmbeds.forEach(iframe => {
                iframe.style.visibility = 'hidden'; // Hide the iframe
                const iframeSrc = iframe.src; // Get the current src
                iframe.src = ''; // Pause the video by removing the src
                iframe.dataset.tempSrc = iframeSrc; // Store the src for later
            });
        } else {
            // Restore the iframes when the menu is closed
            videoEmbeds.forEach(iframe => {
                iframe.style.visibility = 'visible'; // Show the iframe
                iframe.src = iframe.dataset.tempSrc; // Restore the src
            });
        }
    });
});