// DOM Elements
const backBtn = document.getElementById('backBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const toast = document.getElementById('toast');
const favoriteBtn = document.getElementById('favoriteBtn');
const trailerBtn = document.getElementById('trailerBtn');
const shareBtn = document.getElementById('shareBtn');

// Get movie ID from URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = parseInt(urlParams.get('id'));

// State
let currentMovie = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Check for dark mode preference first
    checkDarkModePreference();
    
    // Load movie details
    loadMovieDetails();
    
    // Set up event listeners
    setupEventListeners();
});

// Load movie details
function loadMovieDetails() {
    // Load movies from JSON
    fetch('imdb_tamil_movies_with_cast.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Find the movie with the matching ID
            currentMovie = data.find(movie => movie.index === movieId);
            
            if (!currentMovie) {
                // If movie not found, redirect to home
                window.location.href = 'index.html';
                return;
            }
            
            // Populate the page with movie details
            populateMovieDetails();
        })
        .catch(error => {
            console.error('Error loading movie details:', error);
            // Fallback to sample data if JSON fails to load
            loadSampleData();
        });
}

// Fallback sample data
function loadSampleData() {
    const sampleMovies = [
        {
            "index": 1,
            "title": "Baahubali: The Beginning",
            "year": "2015",
            "rating": "8.1",
            "image": "https://m.media-amazon.com/images/M/MV5BYWVlMjVhZWYtNWViNC00ODFkLTk1MmItYjU1MDY5ZDdhZWUzXkEyXkFqcGc@._V1_QL75_UX90_CR0,0,90,133_.jpg",
            "cast": ["Prabhas", "Rana Daggubati", "Anushka Shetty"],
            "director": "S.S. Rajamouli",
            "poster": "https://m.media-amazon.com/images/M/MV5BYWVlMjVhZWYtNWViNC00ODFkLTk1MmItYjU1MDY5ZDdhZWUzXkEyXkFqcGc@._V1_SX300.jpg",
            "released": "10 Jul 2015",
            "runtime": "159 min",
            "genre": "Action, Drama",
            "writer": "Vijayendra Prasad, S.S. Rajamouli",
            "plot": "In ancient India, an adventurous and daring man becomes involved in a decades-old feud between two warring peoples.",
            "awards": "62 wins & 12 nominations",
            "streaming": ["Netflix", "Prime"]
        },
        {
            "index": 2,
            "title": "Petta",
            "year": "2019",
            "rating": "7.3",
            "image": "https://m.media-amazon.com/images/M/MV5BMjI0NzcyMjg5N15BMl5BanBnXkFtZTgwNDI4ODQyNTM@._V1_QL75_UX90_CR0,0,90,133_.jpg",
            "cast": ["Rajinikanth", "Vijay Sethupathi", "Simran"],
            "director": "Karthik Subbaraj",
            "poster": "https://m.media-amazon.com/images/M/MV5BMjI0NzcyMjg5N15BMl5BanBnXkFtZTgwNDI4ODQyNTM@._V1_SX300.jpg",
            "released": "10 Jan 2019",
            "runtime": "171 min",
            "genre": "Action, Drama",
            "writer": "Karthik Subbaraj",
            "plot": "A retired RAW agent returns to his hometown and gets involved in a gang war.",
            "awards": "6 wins & 8 nominations",
            "streaming": ["Hotstar", "Netflix"]
        }
    ];
    
    // Find the movie with the matching ID
    currentMovie = sampleMovies.find(movie => movie.index === movieId);
    
    if (!currentMovie) {
        // If movie not found, redirect to home
        window.location.href = 'index.html';
        return;
    }
    
    // Populate the page with movie details
    populateMovieDetails();
}

// Populate the page with movie details
function populateMovieDetails() {
    // Set banner background
    document.getElementById('movieBanner').style.backgroundImage = `linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.3)), url('${currentMovie.poster}')`;
    
    // Set poster
    document.getElementById('posterContainer').innerHTML = `
        <img src="${currentMovie.poster}" alt="${currentMovie.title}" class="w-full h-full object-cover rounded-lg">
    `;
    
    // Set title
    document.getElementById('movieTitle').textContent = currentMovie.title;
    
    // Set year
    document.getElementById('movieYear').textContent = currentMovie.year;
    
    // Set rating
    if (currentMovie.rating) {
        document.querySelector('#movieRating span').textContent = currentMovie.rating;
    } else {
        document.getElementById('movieRating').style.display = 'none';
    }
    
    // Set genre
    document.getElementById('movieGenre').textContent = currentMovie.genre;
    
    // Set plot
    document.getElementById('moviePlot').textContent = currentMovie.plot;
    
    // Set cast
    const castContainer = document.getElementById('castContainer');
    castContainer.innerHTML = '';
    currentMovie.cast.forEach(actor => {
        const castChip = document.createElement('div');
        castChip.className = 'cast-chip';
        castChip.textContent = actor;
        castContainer.appendChild(castChip);
    });
    
    // Set director
    document.getElementById('movieDirector').textContent = currentMovie.director;
    
    // Set writer
    document.getElementById('movieWriter').textContent = currentMovie.writer;
    
    // Set release date
    document.getElementById('movieRelease').textContent = currentMovie.released;
    
    // Set runtime
    document.getElementById('movieRuntime').textContent = currentMovie.runtime;
    
    // Set awards
    document.getElementById('movieAwards').textContent = currentMovie.awards;
    
    // Set streaming options
    const streamingContainer = document.getElementById('streamingContainer');
    streamingContainer.innerHTML = '';
    
    if (currentMovie.streaming && currentMovie.streaming.length > 0) {
        currentMovie.streaming.forEach(platform => {
            const icon = document.createElement('div');
            icon.className = 'streaming-icon bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200';
            
            // Set icon based on platform
            switch(platform.toLowerCase()) {
                case 'netflix':
                    icon.innerHTML = '<i class="fab fa-netflix"></i>';
                    break;
                case 'prime':
                    icon.innerHTML = '<i class="fab fa-amazon"></i>';
                    break;
                case 'hotstar':
                    icon.innerHTML = '<i class="fas fa-star"></i>';
                    break;
                case 'youtube':
                    icon.innerHTML = '<i class="fab fa-youtube"></i>';
                    break;
                default:
                    icon.innerHTML = '<i class="fas fa-play"></i>';
            }
            
            streamingContainer.appendChild(icon);
        });
    } else {
        streamingContainer.innerHTML = '<p class="text-gray-500 dark:text-gray-400">Not available for streaming</p>';
    }
    
    // Check if movie is favorited
    updateFavoriteButton();
}

// Set up event listeners
function setupEventListeners() {
    // Back button
    backBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    // Dark mode toggle
    darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Favorite button
    favoriteBtn.addEventListener('click', toggleFavorite);
    
    // Trailer button
    trailerBtn.addEventListener('click', watchTrailer);
    
    // Share button
    shareBtn.addEventListener('click', shareMovie);
}

// Toggle favorite status
function toggleFavorite() {
    let favorites = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    
    const index = favorites.indexOf(movieId);
    if (index > -1) {
        // Remove from favorites
        favorites.splice(index, 1);
        showToast('Removed from favorites');
    } else {
        // Add to favorites
        favorites.push(movieId);
        showToast('Added to favorites');
    }
    
    localStorage.setItem('favoriteMovies', JSON.stringify(favorites));
    
    // Update button text
    updateFavoriteButton();
}

// Update favorite button text
function updateFavoriteButton() {
    const favorites = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    const isFavorited = favorites.includes(movieId);
    
    if (isFavorited) {
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Remove from Favorites';
    } else {
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i> Add to Favorites';
    }
}

// Watch trailer
function watchTrailer() {
    // Create YouTube search URL
    const searchTerm = encodeURIComponent(`${currentMovie.title} ${currentMovie.year} trailer`);
    const youtubeUrl = `https://www.youtube.com/results?search_query=${searchTerm}`;
    
    // Open in new tab
    window.open(youtubeUrl, '_blank');
}

// Share movie
function shareMovie() {
    const url = window.location.href;
    
    // Try to use the Web Share API if available
    if (navigator.share) {
        navigator.share({
            title: currentMovie.title,
            text: `Check out ${currentMovie.title} on Tamil Movie Directory`,
            url: url
        }).catch(console.error);
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            showToast('Link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            showToast('Failed to copy link');
        });
    }
}

// Show toast notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark');
    
    // Save preference to localStorage
    const isDarkMode = document.body.classList.contains('dark');
    localStorage.setItem('darkMode', isDarkMode);
    
    // Update toggle button icon
    updateDarkModeIcon(isDarkMode);
}

// Update dark mode icon
function updateDarkModeIcon(isDarkMode) {
    const moonIcon = darkModeToggle.querySelector('.fa-moon');
    const sunIcon = darkModeToggle.querySelector('.fa-sun');
    
    if (isDarkMode) {
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
    } else {
        moonIcon.classList.remove('hidden');
        sunIcon.classList.add('hidden');
    }
}

// Check for saved dark mode preference
function checkDarkModePreference() {
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark');
        updateDarkModeIcon(true);
    } else {
        updateDarkModeIcon(false);
    }
}