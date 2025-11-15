// DOM Elements
const movieGrid = document.getElementById('movieGrid');
const movieCount = document.getElementById('movieCount');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const darkModeToggle = document.getElementById('darkModeToggle');
const toast = document.getElementById('toast');
const genreChips = document.querySelectorAll('.genre-chip');

// State
let movies = [];
let filteredMovies = [];
let currentGenre = 'All';

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Check for dark mode preference first
    checkDarkModePreference();
    
    // Load movies from JSON
    loadMovies();
    
    // Set up event listeners
    setupEventListeners();
});

// Load movies from JSON file
function loadMovies() {
    fetch('imdb_tamil_movies_with_cast.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            movies = data;
            filteredMovies = [...movies];
            
            // Update movie count
            updateMovieCount();
            
            // Render movies
            renderMovies();
        })
        .catch(error => {
            console.error('Error loading movies:', error);
            // Fallback to sample data if JSON fails to load
            loadSampleData();
        });
}

// Fallback sample data
function loadSampleData() {
    movies = [
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
    filteredMovies = [...movies];
    
    // Update movie count
    updateMovieCount();
    
    // Render movies
    renderMovies();
}

// Set up event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    
    // Sorting functionality
    sortSelect.addEventListener('change', handleSort);
    
    // Dark mode toggle
    darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Genre filtering
    genreChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // Remove active class from all chips
            genreChips.forEach(c => c.classList.remove('active'));
            // Add active class to clicked chip
            chip.classList.add('active');
            // Filter by genre
            currentGenre = chip.textContent;
            filterByGenre();
        });
    });
}

// Handle search input
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm === '') {
        filteredMovies = [...movies];
    } else {
        filteredMovies = movies.filter(movie => 
            movie.title.toLowerCase().includes(searchTerm) ||
            movie.director.toLowerCase().includes(searchTerm) ||
            movie.cast.some(actor => actor.toLowerCase().includes(searchTerm))
        );
    }
    
    // Apply current genre filter
    if (currentGenre !== 'All') {
        filteredMovies = filteredMovies.filter(movie => 
            movie.genre.includes(currentGenre)
        );
    }
    
    renderMovies();
    updateMovieCount();
}

// Handle sorting
function handleSort() {
    const sortBy = sortSelect.value;
    
    switch(sortBy) {
        case 'year-new':
            filteredMovies.sort((a, b) => parseInt(b.year) - parseInt(a.year));
            break;
        case 'year-old':
            filteredMovies.sort((a, b) => parseInt(a.year) - parseInt(b.year));
            break;
        case 'rating':
            filteredMovies.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
            break;
        case 'alphabetical':
            filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }
    
    renderMovies();
}

// Filter by genre
function filterByGenre() {
    if (currentGenre === 'All') {
        filteredMovies = [...movies];
    } else {
        filteredMovies = movies.filter(movie => 
            movie.genre.includes(currentGenre)
        );
    }
    
    // Apply search filter if there's a search term
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filteredMovies = filteredMovies.filter(movie => 
            movie.title.toLowerCase().includes(searchTerm) ||
            movie.director.toLowerCase().includes(searchTerm) ||
            movie.cast.some(actor => actor.toLowerCase().includes(searchTerm))
        );
    }
    
    renderMovies();
    updateMovieCount();
}

// Update movie count display
function updateMovieCount() {
    movieCount.textContent = `${filteredMovies.length} movies found`;
}

// Render movies to the grid
function renderMovies() {
    // Clear the grid
    movieGrid.innerHTML = '';
    
    // Show skeleton loaders if no movies
    if (filteredMovies.length === 0) {
        movieGrid.innerHTML = '<p class="text-center col-span-full py-8">No movies found. Try a different search term.</p>';
        return;
    }
    
    // Render each movie
    filteredMovies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        movieGrid.appendChild(movieCard);
    });
}

// Create a movie card element
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden';
    card.dataset.id = movie.index;
    
    // Check if movie is favorited
    const isFavorited = isMovieFavorited(movie.index);
    
    card.innerHTML = `
        <div class="relative">
            <img src="${movie.image || 'https://via.placeholder.com/300x450?text=No+Image'}" 
                 alt="${movie.title}" 
                 class="w-full h-64 object-cover">
            <button class="favorite-btn absolute top-2 right-2 p-2 rounded-full bg-white dark:bg-gray-700 shadow-md ${isFavorited ? 'favorited' : ''}"
                    data-id="${movie.index}">
                <i class="fas fa-heart"></i>
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
    
    // Add click event to favorite button
    const favoriteBtn = card.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(movie.index, favoriteBtn);
    });
    
    // Add click event to card
    card.addEventListener('click', () => {
        window.location.href = `movie.html?id=${movie.index}`;
    });
    
    return card;
}

// Toggle favorite status
function toggleFavorite(movieId, button) {
    let favorites = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    
    const index = favorites.indexOf(movieId);
    if (index > -1) {
        // Remove from favorites
        favorites.splice(index, 1);
        button.classList.remove('favorited');
        showToast('Removed from favorites');
    } else {
        // Add to favorites
        favorites.push(movieId);
        button.classList.add('favorited');
        showToast('Added to favorites');
    }
    
    localStorage.setItem('favoriteMovies', JSON.stringify(favorites));
}

// Check if movie is favorited
function isMovieFavorited(movieId) {
    const favorites = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    return favorites.includes(movieId);
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