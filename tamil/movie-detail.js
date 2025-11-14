// Get movie ID from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

// Load favorite movies from localStorage
let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];

// Fetch movie data - first try the file with cast information, fallback to original
fetch('imdb_tamil_movies_with_cast.json')
    .then(response => response.json())
    .then(movies => {
        if (movieId) {
            const movie = movies.find(m => m.index == movieId);
            if (movie) {
                displayMovieDetail(movie);
            } else {
                document.getElementById('movieDetailContainer').innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Movie Not Found</h3>
                        <p>The requested movie could not be found.</p>
                        <a href="index.html" class="watch-button" style="text-decoration: none; display: inline-block; margin-top: 20px;">
                            <i class="fas fa-arrow-left"></i> Back to Movies
                        </a>
                    </div>
                `;
            }
        } else {
            document.getElementById('movieDetailContainer').innerHTML = `
                <div class="no-results">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Invalid Request</h3>
                    <p>No movie specified.</p>
                    <a href="index.html" class="watch-button" style="text-decoration: none; display: inline-block; margin-top: 20px;">
                        <i class="fas fa-arrow-left"></i> Back to Movies
                    </a>
                </div>
            `;
        }
    })
    .catch(error => {
        console.error('Error loading movie data with cast:', error);
        // Fallback to original file if cast file is not found
        fetch('imdb_tamil_movies_full.json')
            .then(response => response.json())
            .then(movies => {
                if (movieId) {
                    const movie = movies.find(m => m.index == movieId);
                    if (movie) {
                        displayMovieDetail(movie);
                    } else {
                        document.getElementById('movieDetailContainer').innerHTML = `
                            <div class="no-results">
                                <i class="fas fa-exclamation-triangle"></i>
                                <h3>Movie Not Found</h3>
                                <p>The requested movie could not be found.</p>
                                <a href="index.html" class="watch-button" style="text-decoration: none; display: inline-block; margin-top: 20px;">
                                    <i class="fas fa-arrow-left"></i> Back to Movies
                                </a>
                            </div>
                        `;
                    }
                } else {
                    document.getElementById('movieDetailContainer').innerHTML = `
                        <div class="no-results">
                            <i class="fas fa-exclamation-triangle"></i>
                            <h3>Invalid Request</h3>
                            <p>No movie specified.</p>
                            <a href="index.html" class="watch-button" style="text-decoration: none; display: inline-block; margin-top: 20px;">
                                <i class="fas fa-arrow-left"></i> Back to Movies
                            </a>
                        </div>
                    `;
                }
            })
            .catch(err => {
                console.error('Error loading fallback movie data:', err);
                document.getElementById('movieDetailContainer').innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Error Loading Data</h3>
                        <p>Failed to load movie data. Please try again later.</p>
                        <a href="index.html" class="watch-button" style="text-decoration: none; display: inline-block; margin-top: 20px;">
                            <i class="fas fa-arrow-left"></i> Back to Movies
                        </a>
                    </div>
                `;
            });
    });

// Display movie details
function displayMovieDetail(movie) {
    const container = document.getElementById('movieDetailContainer');
    const isFavorited = favoriteMovies.includes(parseInt(movieId));
    
    // Check if cast information exists
    const castInfo = movie.cast ? movie.cast.join(', ') : 'Cast information not available';
    
    // Create cast section
    const castSection = movie.cast && movie.cast.length > 0 ? `
        <div class="movie-detail-cast">
            <h3>Cast</h3>
            <p>${castInfo}</p>
        </div>
    ` : '';
    
    // Create director section
    const directorSection = movie.director ? `
        <div class="movie-detail-director">
            <h3>Director</h3>
            <p>${movie.director}</p>
        </div>
    ` : '';
    
    // Use poster if available, otherwise use image
    const imageUrl = movie.poster || movie.image;
    
    container.innerHTML = `
        <div class="movie-detail-header">
            <div class="movie-detail-poster">
                ${imageUrl && imageUrl !== 'null' ? 
                    `<img src="${imageUrl}" alt="${movie.title}" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'movie-placeholder\\' style=\\'height: 400px;\\'><i class=\\'fas fa-film\\'></i></div>';">` : 
                    `<div class="movie-placeholder" style="height: 400px;"><i class="fas fa-film"></i></div>`
                }
            </div>
            <div class="movie-detail-info">
                <h1 class="movie-detail-title">${movie.title}</h1>
                <div class="movie-detail-meta">
                    <div class="movie-detail-year">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${movie.year || 'N/A'}</span>
                    </div>
                    <div class="movie-detail-rating">
                        <i class="fas fa-star"></i>
                        <span>${movie.rating && movie.rating !== 'null' ? movie.rating : 'No rating'}</span>
                    </div>
                </div>
                ${directorSection}
                ${castSection}
                <button class="favorite-btn-detail ${isFavorited ? 'favorited' : ''}" id="favoriteButton">
                    <i class="${isFavorited ? 'fas fa-heart' : 'far fa-heart'}"></i>
                    ${isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
                <button class="watch-button" id="watchButton">
                    <i class="fab fa-youtube"></i> Watch Movie
                </button>
            </div>
        </div>
    `;

    // Add event listener to favorite button
    document.getElementById('favoriteButton').addEventListener('click', function() {
        toggleFavorite(parseInt(movieId));
        const isFavorited = favoriteMovies.includes(parseInt(movieId));
        this.innerHTML = `
            <i class="${isFavorited ? 'fas fa-heart' : 'far fa-heart'}"></i>
            ${isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
        `;
        this.classList.toggle('favorited', isFavorited);
    });
    
    // Add event listener to watch button
    document.getElementById('watchButton').addEventListener('click', function() {
        // Create YouTube search URL
        const searchTerm = encodeURIComponent(`${movie.title} tamil movie`);
        const youtubeUrl = `https://www.youtube.com/results?search_query=${searchTerm}`;
        window.open(youtubeUrl, '_blank');
    });
}

// Toggle favorite status of a movie
function toggleFavorite(movieId) {
    const index = favoriteMovies.indexOf(movieId);
    if (index === -1) {
        // Add to favorites
        favoriteMovies.push(movieId);
    } else {
        // Remove from favorites
        favoriteMovies.splice(index, 1);
    }
    
    // Save to localStorage
    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
}

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    function performSearch() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm !== '') {
            window.location.href = `index.html?search=${encodeURIComponent(searchTerm)}`;
        }
    }
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
});