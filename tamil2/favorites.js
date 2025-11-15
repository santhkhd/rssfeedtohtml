// DOM Elements
const favoritesGrid = document.getElementById('favoritesGrid');
const movieCount = document.getElementById('movieCount');
const darkModeToggle = document.getElementById('darkModeToggle');
const clearAllBtn = document.getElementById('clearAllBtn');
const toast = document.getElementById('toast');

// State
let favoriteMovies = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Check for dark mode preference first
    checkDarkModePreference();
    
    // Load favorite movies
    loadFavoriteMovies();
    
    // Set up event listeners
    setupEventListeners();
});

// Load favorite movies
function loadFavoriteMovies() {
    // Load movies from JSON
    fetch('imdb_tamil_movies_with_cast.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Get favorite movie IDs from localStorage
            const favoriteIds = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
            
            // Filter movies to only include favorites
            favoriteMovies = data.filter(movie => favoriteIds.includes(movie.index));
            
            // Update movie count
            updateMovieCount();
            
            // Render favorite movies
            renderFavoriteMovies();
        })
        .catch(error => {
            console.error('Error loading favorite movies:', error);
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
    
    // Get favorite movie IDs from localStorage
    const favoriteIds = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    
    // Filter sample movies to only include favorites
    favoriteMovies = sampleMovies.filter(movie => favoriteIds.includes(movie.index));
    
    // Update movie count
    updateMovieCount();
    
    // Render favorite movies
    renderFavoriteMovies();
}

// Set up event listeners
function setupEventListeners() {
    // Dark mode toggle
    darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Clear all favorites
    clearAllBtn.addEventListener('click', clearAllFavorites);
}

// Update movie count display
function updateMovieCount() {
    const count = favoriteMovies.length;
    movieCount.textContent = `${count} ${count === 1 ? 'movie' : 'movies'} favorited`;
}

// Render favorite movies to the grid
function renderFavoriteMovies() {
    // Clear the grid
    favoritesGrid.innerHTML = '';
    
    // Show message if no favorites
    if (favoriteMovies.length === 0) {
        favoritesGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-heart text-5xl text-gray-300 mb-4"></i>
                <h3 class="text-2xl font-bold mb-2">No Favorite Movies</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-6">You haven't added any movies to your favorites yet.</p>
                <a href="index.html" class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors inline-block">
                    Browse Movies
                </a>
            </div>
        `;
        return;
    }
    
    // Render each favorite movie
    favoriteMovies.forEach(movie => {
        const movieCard = createFavoriteMovieCard(movie);
        favoritesGrid.appendChild(movieCard);
    });
}

// Create a favorite movie card element
function createFavoriteMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden';
    card.dataset.id = movie.index;
    
    card.innerHTML = `
        <div class="relative">
            <img src="${movie.image || 'https://via.placeholder.com/300x450?text=No+Image'}" 
                 alt="${movie.title}" 
                 class="w-full h-64 object-cover">
            <button class="remove-favorite-btn absolute top-2 right-2 p-2 rounded-full bg-white dark:bg-gray-700 shadow-md text-red-600 hover:bg-red-100 transition-colors"
                    data-id="${movie.index}">
                <i class="fas fa-times"></i>
            </button>
            ${movie.rating ? `
            <div class="rating-badge absolute bottom-2 left-2">
                <i class="fas fa-star mr-1"></i> ${movie.rating}
            </div>` : ''}
        </div>
        <div class="p-4">
            <h3 class="font-bold text-lg mb-1 truncate">${movie.title}</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">${movie.year}</p>
            <div class="flex justify-between items-center">
                <span class="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">${movie.genre.split(',')[0] || 'Drama'}</span>
                <button class="text-sm text-red-600 hover:text-red-800 font-medium">View Details</button>
            </div>
        </div>
    `;
    
    // Add click event to remove favorite button
    const removeBtn = card.querySelector('.remove-favorite-btn');
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeFavorite(movie.index);
    });
    
    // Add click event to card
    card.addEventListener('click', () => {
        window.location.href = `movie.html?id=${movie.index}`;
    });
    
    return card;
}

// Remove a movie from favorites
function removeFavorite(movieId) {
    // Remove from localStorage
    let favorites = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    favorites = favorites.filter(id => id !== movieId);
    localStorage.setItem('favoriteMovies', JSON.stringify(favorites));
    
    // Remove from favoriteMovies array
    favoriteMovies = favoriteMovies.filter(movie => movie.index !== movieId);
    
    // Update UI
    updateMovieCount();
    renderFavoriteMovies();
    
    // Show toast notification
    showToast('Removed from favorites');
}

// Clear all favorites
function clearAllFavorites() {
    if (favoriteMovies.length === 0) return;
    
    if (confirm('Are you sure you want to remove all movies from your favorites?')) {
        // Clear from localStorage
        localStorage.removeItem('favoriteMovies');
        
        // Clear favoriteMovies array
        favoriteMovies = [];
        
        // Update UI
        updateMovieCount();
        renderFavoriteMovies();
        
        // Show toast notification
        showToast('All favorites cleared');
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