// Load movies data from JSON file
let moviesData = [];
let currentCategory = 'popular';
let currentSort = 'desc';
let currentPage = 1;
let currentYearFilter = 'all';
let currentActorFilter = 'all';
let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
const moviesPerPage = 12; // Show 12 movies per page

// Fetch the JSON data with cast information first, fallback to original if not found
fetch('imdb_tamil_movies_with_cast.json')
    .then(response => response.json())
    .then(data => {
        moviesData = data;
        populateYearFilter(); // Populate year filter dropdown
        populateActorFilter(); // Populate actor filter dropdown
        updateFavoriteCount(); // Update favorite count in UI
        // Check if there's a search parameter in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        if (searchQuery) {
            document.getElementById('searchInput').value = decodeURIComponent(searchQuery);
            performSearch();
        } else {
            displayMovies(getSortedMovies(getFilteredMovies(currentCategory)));
        }
    })
    .catch(error => {
        console.error('Error loading movies with cast data:', error);
        // Fallback to original file if cast file is not found
        fetch('imdb_tamil_movies_full.json')
            .then(response => response.json())
            .then(data => {
                moviesData = data;
                populateYearFilter(); // Populate year filter dropdown
                populateActorFilter(); // Populate actor filter dropdown
                updateFavoriteCount(); // Update favorite count in UI
                // Check if there's a search parameter in the URL
                const urlParams = new URLSearchParams(window.location.search);
                const searchQuery = urlParams.get('search');
                if (searchQuery) {
                    document.getElementById('searchInput').value = decodeURIComponent(searchQuery);
                    performSearch();
                } else {
                    displayMovies(getSortedMovies(getFilteredMovies(currentCategory)));
                }
            })
            .catch(err => {
                console.error('Error loading fallback movies file:', err);
                document.getElementById('moviesContainer').innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Error Loading Data</h3>
                        <p>Failed to load movies data. Please try again later.</p>
                    </div>
                `;
            });
    });

// Populate year filter dropdown with unique years
function populateYearFilter() {
    const years = [...new Set(moviesData.map(movie => movie.year).filter(year => year !== null && year !== undefined && year !== 'null'))];
    years.sort((a, b) => b - a); // Sort in descending order
    
    const yearFilter = document.getElementById('yearFilter');
    // Clear existing options except the first one
    while (yearFilter.children.length > 1) {
        yearFilter.removeChild(yearFilter.lastChild);
    }
    
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
}

// Populate actor filter dropdown with real actor data
function populateActorFilter() {
    // Extract all unique actors from movies that have cast information
    const allActors = new Set();
    moviesData.forEach(movie => {
        if (movie.cast && Array.isArray(movie.cast)) {
            movie.cast.forEach(actor => {
                if (actor && actor.trim() !== '') {
                    allActors.add(actor.trim());
                }
            });
        }
    });
    
    // Convert to array and sort alphabetically
    const actors = Array.from(allActors).sort();
    
    // Clear existing options except the first one
    const actorFilter = document.getElementById('actorFilter');
    while (actorFilter.children.length > 1) {
        actorFilter.removeChild(actorFilter.lastChild);
    }
    
    // Add actors to the dropdown
    actors.forEach(actor => {
        const option = document.createElement('option');
        option.value = actor;
        option.textContent = actor;
        actorFilter.appendChild(option);
    });
}

// Filter movies based on category
function getFilteredMovies(category) {
    let filteredMovies = [];
    
    switch(category) {
        case 'popular':
            // Movies with rating >= 7.5 or with images (assuming they are more popular)
            filteredMovies = moviesData.filter(movie => 
                (movie.rating && parseFloat(movie.rating) >= 7.5) || 
                (movie.image && movie.image !== null)
            );
            break;
        case 'year':
            filteredMovies = [...moviesData];
            break;
        case 'rating':
            filteredMovies = moviesData.filter(movie => movie.rating !== null);
            break;
        case 'atoz':
            filteredMovies = [...moviesData].filter(movie => movie.title !== null);
            break;
        case 'favorites':
            // Filter movies that are in the favorites list
            filteredMovies = moviesData.filter(movie => favoriteMovies.includes(movie.index));
            break;
        default:
            filteredMovies = moviesData;
    }
    
    // Apply year filter if not "all" and category is not favorites
    if (currentYearFilter !== 'all' && category !== 'favorites') {
        filteredMovies = filteredMovies.filter(movie => movie.year == currentYearFilter);
    }
    
    // Apply actor filter if not "all" and category is not favorites
    if (currentActorFilter !== 'all' && category !== 'favorites') {
        // Filter movies by actor
        filteredMovies = filteredMovies.filter(movie => {
            if (movie.cast && Array.isArray(movie.cast)) {
                return movie.cast.some(actor => actor && actor.includes(currentActorFilter));
            }
            return false;
        });
    }
    
    return filteredMovies;
}

// Sort movies based on criteria
function getSortedMovies(movies) {
    switch(currentCategory) {
        case 'popular':
            // Sort by rating (highest first) then by year (newest first)
            return movies.sort((a, b) => {
                const ratingA = a.rating ? parseFloat(a.rating) : 0;
                const ratingB = b.rating ? parseFloat(b.rating) : 0;
                if (ratingA !== ratingB) {
                    return currentSort === 'desc' ? ratingB - ratingA : ratingA - ratingB;
                }
                const yearA = parseInt(a.year) || 0;
                const yearB = parseInt(b.year) || 0;
                return currentSort === 'desc' ? yearB - yearA : yearA - yearB;
            });
        case 'year':
            return movies.sort((a, b) => {
                const yearA = parseInt(a.year) || 0;
                const yearB = parseInt(b.year) || 0;
                return currentSort === 'desc' ? yearB - yearA : yearA - yearB;
            });
        case 'rating':
            return movies.sort((a, b) => {
                const ratingA = parseFloat(a.rating) || 0;
                const ratingB = parseFloat(b.rating) || 0;
                return currentSort === 'desc' ? ratingB - ratingA : ratingA - ratingB;
            });
        case 'atoz':
            return movies.sort((a, b) => {
                const titleA = a.title || '';
                const titleB = b.title || '';
                if (currentSort === 'desc') {
                    return titleB.localeCompare(titleA);
                }
                return titleA.localeCompare(titleB);
            });
        case 'favorites':
            // Keep the order as is for favorites
            return movies;
        default:
            return movies;
    }
}

// Function to create movie card HTML
function createMovieCard(movie) {
    // Add cast information if available
    let castInfo = '';
    if (movie.cast && movie.cast.length > 0) {
        // Show first 3 cast members
        const castMembers = movie.cast.slice(0, 3).join(', ');
        castInfo = `<div class="movie-cast">Cast: ${castMembers}${movie.cast.length > 3 ? '...' : ''}</div>`;
    }
    
    // Add director information if available
    let directorInfo = '';
    if (movie.director) {
        directorInfo = `<div class="movie-director">Director: ${movie.director}</div>`;
    }
    
    // Use poster if available, otherwise use image
    const imageUrl = movie.poster || movie.image;
    
    return `
        <div class="movie-card" data-index="${movie.index}">
            <div class="movie-poster">
                ${imageUrl && imageUrl !== 'null' ? 
                    `<img src="${imageUrl}" alt="${movie.title}" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'movie-placeholder\\'><i class=\\'fas fa-film\\'></i></div>';">` : 
                    `<div class="movie-placeholder"><i class="fas fa-film"></i></div>`
                }
                <div class="movie-rating">${movie.rating && movie.rating !== 'null' ? movie.rating : 'N/A'}</div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-year">${movie.year || 'N/A'}</div>
                ${directorInfo}
                ${castInfo}
            </div>
        </div>
    `;
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
    
    // Update UI
    updateFavoriteCount();
    
    // If we're on the favorites page, refresh the display
    if (currentCategory === 'favorites') {
        currentPage = 1;
        displayMovies(getSortedMovies(getFilteredMovies(currentCategory)));
    }
}

// Update favorite count in UI
function updateFavoriteCount() {
    const favoriteCountElement = document.getElementById('favoriteCount');
    if (favoriteCountElement) {
        favoriteCountElement.textContent = favoriteMovies.length;
    }
    
    // Also update any favorite buttons in the current view
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const movieId = parseInt(btn.getAttribute('data-movie-id'));
        if (favoriteMovies.includes(movieId)) {
            btn.classList.add('favorited');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            btn.classList.remove('favorited');
            btn.innerHTML = '<i class="far fa-heart"></i>';
        }
    });
}

// Display movies in the grid with pagination
function displayMovies(movies) {
    const container = document.getElementById('moviesContainer');
    const paginationContainer = document.getElementById('paginationContainer');
    const movieCountElement = document.getElementById('movieCount');
    
    // Update movie count
    movieCountElement.textContent = `Total Movies: ${movies.length}`;
    
    if (movies.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No Movies Found</h3>
                <p>${currentCategory === 'favorites' ? 
                    'You haven\'t added any movies to your favorites yet. Start browsing and heart the movies you love!' : 
                    'Try adjusting your search or filter criteria'}</p>
            </div>
        `;
        paginationContainer.innerHTML = '';
        return;
    }
    
    // Calculate pagination
    const totalPages = Math.ceil(movies.length / moviesPerPage);
    const startIndex = (currentPage - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    const moviesToDisplay = movies.slice(startIndex, endIndex);
    
    // Display movies
    container.innerHTML = moviesToDisplay.map(movie => {
        // Use poster if available, otherwise use image
        const imageUrl = movie.poster || movie.image;
        
        // Add cast information if available
        let castInfo = '';
        if (movie.cast && movie.cast.length > 0) {
            // Show first 3 cast members
            const castMembers = movie.cast.slice(0, 3).join(', ');
            castInfo = `<div class="movie-cast">Cast: ${castMembers}${movie.cast.length > 3 ? '...' : ''}</div>`;
        }
        
        // Add director information if available
        let directorInfo = '';
        if (movie.director) {
            directorInfo = `<div class="movie-director">Director: ${movie.director}</div>`;
        }
        
        return `
        <div class="movie-card" data-id="${movie.index}">
            ${imageUrl && imageUrl !== 'null' ? 
                `<img src="${imageUrl}" alt="${movie.title}" class="movie-poster" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'movie-placeholder\\'><i class=\\'fas fa-film\\'></i></div>'+this.parentElement.innerHTML;">` : 
                `<div class="movie-placeholder"><i class="fas fa-film"></i></div>`
            }
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-year">${movie.year || 'N/A'}</p>
                ${directorInfo}
                ${castInfo}
                <div class="movie-rating">
                    <i class="fas fa-star"></i>
                    <span class="rating-value">${movie.rating && movie.rating !== 'null' ? movie.rating : '<span class="no-rating">No rating</span>'}</span>
                </div>
                <button class="favorite-btn ${favoriteMovies.includes(movie.index) ? 'favorited' : ''}" data-movie-id="${movie.index}">
                    <i class="${favoriteMovies.includes(movie.index) ? 'fas fa-heart' : 'far fa-heart'}"></i>
                </button>
            </div>
        </div>
    `}).join('');
    
    // Add click event listeners to movie cards
    document.querySelectorAll('.movie-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on the favorite button
            if (!e.target.classList.contains('favorite-btn') && !e.target.parentElement.classList.contains('favorite-btn')) {
                const movieId = this.getAttribute('data-id');
                window.location.href = `movie-detail.html?id=${movieId}`;
            }
        });
    });
    
    // Add click event listeners to favorite buttons
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click event
            const movieId = parseInt(this.getAttribute('data-movie-id'));
            toggleFavorite(movieId);
        });
    });
    
    // Display pagination controls
    displayPagination(totalPages);
}

// Display pagination controls
function displayPagination(totalPages) {
    const paginationContainer = document.getElementById('paginationContainer');
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            paginationHTML += `
                <button class="${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            paginationHTML += `<span>...</span>`;
        }
    }
    
    // Next button
    paginationHTML += `
        <button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    currentPage = page;
    displayMovies(getSortedMovies(getFilteredMovies(currentCategory)));
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Top navigation tabs
    const topTabs = document.querySelectorAll('.tab');
    topTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            topTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update category
            currentCategory = this.getAttribute('data-category');
            
            // Update title
            const titleMap = {
                'popular': 'Popular Movies',
                'year': 'Movies by Year',
                'rating': 'Movies by Rating',
                'atoz': 'Movies A-Z',
                'favorites': 'Favorite Movies'
            };
            document.getElementById('categoryTitle').textContent = titleMap[currentCategory];
            
            // Show/hide filter sections based on category
            const yearFilterSection = document.getElementById('yearFilterSection');
            const actorFilterSection = document.getElementById('actorFilterSection');
            
            if (currentCategory === 'year') {
                yearFilterSection.style.display = 'block';
                actorFilterSection.style.display = 'none';
            } else if (currentCategory === 'atoz') {
                yearFilterSection.style.display = 'none';
                actorFilterSection.style.display = 'block';
                currentYearFilter = 'all';
                document.getElementById('yearFilter').value = 'all';
            } else {
                yearFilterSection.style.display = 'none';
                actorFilterSection.style.display = 'none';
                currentYearFilter = 'all';
                currentActorFilter = 'all';
                document.getElementById('yearFilter').value = 'all';
                document.getElementById('actorFilter').value = 'all';
            }
            
            // Reset sort order for A-Z to ascending
            if (currentCategory === 'atoz') {
                currentSort = 'asc';
                document.getElementById('sortSelect').value = 'asc';
            } else {
                currentSort = 'desc';
                document.getElementById('sortSelect').value = 'desc';
            }
            
            // Reset to first page
            currentPage = 1;
            
            // Display movies
            displayMovies(getSortedMovies(getFilteredMovies(currentCategory)));
        });
    });
    
    // Bottom navigation tabs
    const bottomTabs = document.querySelectorAll('.tab-bottom');
    bottomTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab in both top and bottom nav
            bottomTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Find corresponding top tab and activate it
            const category = this.getAttribute('data-category');
            topTabs.forEach(t => {
                if (t.getAttribute('data-category') === category) {
                    topTabs.forEach(tt => tt.classList.remove('active'));
                    t.classList.add('active');
                }
            });
            
            // Update category
            currentCategory = category;
            
            // Update title
            const titleMap = {
                'popular': 'Popular Movies',
                'year': 'Movies by Year',
                'rating': 'Movies by Rating',
                'atoz': 'Movies A-Z',
                'favorites': 'Favorite Movies'
            };
            document.getElementById('categoryTitle').textContent = titleMap[currentCategory];
            
            // Show/hide filter sections based on category
            const yearFilterSection = document.getElementById('yearFilterSection');
            const actorFilterSection = document.getElementById('actorFilterSection');
            
            if (currentCategory === 'year') {
                yearFilterSection.style.display = 'block';
                actorFilterSection.style.display = 'none';
            } else if (currentCategory === 'atoz') {
                yearFilterSection.style.display = 'none';
                actorFilterSection.style.display = 'block';
                currentYearFilter = 'all';
                document.getElementById('yearFilter').value = 'all';
            } else {
                yearFilterSection.style.display = 'none';
                actorFilterSection.style.display = 'none';
                currentYearFilter = 'all';
                currentActorFilter = 'all';
                document.getElementById('yearFilter').value = 'all';
                document.getElementById('actorFilter').value = 'all';
            }
            
            // Reset sort order for A-Z to ascending
            if (currentCategory === 'atoz') {
                currentSort = 'asc';
                document.getElementById('sortSelect').value = 'asc';
            } else {
                currentSort = 'desc';
                document.getElementById('sortSelect').value = 'desc';
            }
            
            // Reset to first page
            currentPage = 1;
            
            // Display movies
            displayMovies(getSortedMovies(getFilteredMovies(currentCategory)));
        });
    });
    
    // Sort select change
    document.getElementById('sortSelect').addEventListener('change', function() {
        currentSort = this.value;
        currentPage = 1; // Reset to first page when sorting changes
        displayMovies(getSortedMovies(getFilteredMovies(currentCategory)));
    });
    
    // Year filter change
    document.getElementById('yearFilter').addEventListener('change', function() {
        currentYearFilter = this.value;
        currentPage = 1; // Reset to first page when filter changes
        displayMovies(getSortedMovies(getFilteredMovies(currentCategory)));
    });
    
    // Actor filter change
    document.getElementById('actorFilter').addEventListener('change', function() {
        currentActorFilter = this.value;
        currentPage = 1; // Reset to first page when filter changes
        displayMovies(getSortedMovies(getFilteredMovies(currentCategory)));
    });
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm === '') {
            currentPage = 1; // Reset to first page
            displayMovies(getSortedMovies(getFilteredMovies(currentCategory)));
            return;
        }
        
        const filteredMovies = moviesData.filter(movie => 
            movie.title && movie.title.toLowerCase().includes(searchTerm)
        );
        
        currentPage = 1; // Reset to first page
        displayMovies(filteredMovies);
    }
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Add disclaimer at the bottom
    const disclaimer = document.createElement('div');
    disclaimer.className = 'disclaimer';
    disclaimer.innerHTML = '<p><strong>Disclaimer:</strong> We do not host any movies or content. We are not responsible for the availability or quality of videos on external platforms. Results are based on YouTube search and we cannot guarantee that the exact movie will be available.</p>';
    document.querySelector('main').appendChild(disclaimer);
});