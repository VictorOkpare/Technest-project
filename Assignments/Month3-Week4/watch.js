document.addEventListener('DOMContentLoaded', function () {
    const episodeContainer = document.getElementById('episodeContainer');
    const seasonSelect = document.getElementById('seasonSelect');
    const paginationContainer = document.createElement('div'); // Container for pagination controls
    paginationContainer.className = 'pagination';
    episodeContainer.after(paginationContainer); // Add pagination below the episode grid

    let currentSeasonIndex = 0; // Default to Season 1
    let currentPage = 1;
    const episodesPerPage = 12; // Number of episodes per page

    // Load JSON data
    fetch('./watch.json')
        .then(response => response.json())
        .then(data => {
            const seasons = data.seasons;

            // Function to render episodes for the current page
            function renderEpisodes(seasonIndex, page) {
                const season = seasons[seasonIndex];
                episodeContainer.innerHTML = ''; // Clear previous content

                // Calculate start and end indices for the current page
                const startIndex = (page - 1) * episodesPerPage;
                const endIndex = startIndex + episodesPerPage;
                const episodesToShow = season.episodes.slice(startIndex, endIndex);

                // Render episodes for the current page
                episodesToShow.forEach(episode => {
                    const episodeCard = `
                        <article class="episode-card">
                            <div class="video-container">
                                <iframe class="video-embed" 
                                        src="https://www.youtube-nocookie.com/embed/${episode.youtubeId}?modestbranding=1&fs=1" 
                                        title="Yu-Gi-Oh! GX Episode ${episode.episodeNumber} - ${episode.title}" 
                                        frameborder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
                                        allowfullscreen
                                        loading="lazy"
                                        aria-label="Yu-Gi-Oh! GX Episode ${episode.episodeNumber} video player">
                                </iframe>
                            </div>
                            <h3 class="episode-title">Episode ${episode.episodeNumber}: ${episode.title}</h3>
                        </article>
                    `;
                    episodeContainer.innerHTML += episodeCard;
                });

                // Render pagination controls
                renderPagination(season.episodes.length, page);
            }

            // Function to render pagination controls
            function renderPagination(totalEpisodes, currentPage) {
                const totalPages = Math.ceil(totalEpisodes / episodesPerPage);
                paginationContainer.innerHTML = ''; // Clear previous pagination

                // Previous Button
                const prevButton = document.createElement('button');
                prevButton.textContent = 'Previous';
                prevButton.disabled = currentPage === 1;
                prevButton.addEventListener('click', () => {
                    if (currentPage > 1) {
                        currentPage--;
                        renderEpisodes(currentSeasonIndex, currentPage);
                    }
                });
                paginationContainer.appendChild(prevButton);

                // Page Numbers
                for (let i = 1; i <= totalPages; i++) {
                    const pageButton = document.createElement('button');
                    pageButton.textContent = i;
                    pageButton.className = i === currentPage ? 'active' : '';
                    pageButton.addEventListener('click', () => {
                        currentPage = i;
                        renderEpisodes(currentSeasonIndex, currentPage);
                    });
                    paginationContainer.appendChild(pageButton);
                }

                // Next Button
                const nextButton = document.createElement('button');
                nextButton.textContent = 'Next';
                nextButton.disabled = currentPage === totalPages;
                nextButton.addEventListener('click', () => {
                    if (currentPage < totalPages) {
                        currentPage++;
                        renderEpisodes(currentSeasonIndex, currentPage);
                    }
                });
                paginationContainer.appendChild(nextButton);
            }

            // Initial render for Season 1, Page 1
            renderEpisodes(currentSeasonIndex, currentPage);

            // Handle season selection change
            seasonSelect.addEventListener('change', function (e) {
                currentSeasonIndex = parseInt(e.target.value); // Convert value to number
                currentPage = 1; // Reset to first page when season changes
                renderEpisodes(currentSeasonIndex, currentPage);
            });
        })
        .catch(error => {
            console.error('Error loading episode data:', error);
            episodeContainer.innerHTML = '<p>⚠️ Unable to load episodes. Please try again later.</p>';
        });
});