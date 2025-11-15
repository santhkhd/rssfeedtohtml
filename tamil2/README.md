# Tamil Movie Directory

A modern, responsive web application for browsing Tamil movies with a clean and elegant interface.

## Features

- **Responsive Design**: Works on all device sizes
- **Movie Directory**: Browse Tamil movies with posters, titles, years, and ratings
- **Search & Filter**: Search movies by title, director, or cast members
- **Sorting Options**: Sort by year, rating, or alphabetically
- **Movie Details**: View comprehensive information about each movie
- **Favorites System**: Save your favorite movies using localStorage
- **Dark Mode**: Toggle between light and dark themes
- **Trailer Viewing**: Watch movie trailers on YouTube
- **Share Functionality**: Share movie links with others
- **Streaming Information**: See where movies are available for streaming

## Pages

1. **Home Page** - Browse all movies with search, filter, and sort capabilities
2. **Movie Detail Page** - View comprehensive information about a specific movie
3. **Favorites Page** - Manage your saved favorite movies
4. **About Page** - Learn more about the application

## Technologies Used

- HTML5
- CSS3 (Tailwind CSS)
- JavaScript (ES6+)
- Font Awesome (Icons)
- LocalStorage (for favorites persistence)

## How to Run

### Method 1: Using Node.js Server

1. Make sure you have Node.js installed on your system
2. Open a terminal/command prompt in the project directory
3. Run the server:
   ```
   node server.js
   ```
4. Open your browser and navigate to `http://localhost:3000`

### Method 2: Using Live Server (VS Code)

1. If you're using Visual Studio Code, install the "Live Server" extension
2. Right-click on `index.html` and select "Open with Live Server"
3. The application will open in your default browser

### Method 3: Direct Browser Opening

1. Simply double-click on `index.html` to open it in your browser
2. Note: Some features may not work properly due to browser security restrictions

## Project Structure

```
tamil-movie-directory/
├── index.html          # Home page
├── movie.html          # Movie detail page
├── favorites.html      # Favorites page
├── about.html          # About page
├── 404.html            # Error page
├── styles.css          # Custom styles
├── script.js           # Home page JavaScript
├── movie.js            # Movie detail page JavaScript
├── favorites.js        # Favorites page JavaScript
├── about.js            # About page JavaScript
├── server.js           # Simple Node.js server
├── imdb_tamil_movies_with_cast.json  # Movie data
└── README.md           # This file
```

## JSON Data Format

The movie data is stored in `imdb_tamil_movies_with_cast.json` with the following structure:

```json
{
  "index": 1,
  "title": "Movie Title",
  "year": "2020",
  "rating": "8.5",
  "image": "poster_image_url",
  "cast": ["Actor 1", "Actor 2", "Actor 3"],
  "director": "Director Name",
  "poster": "large_poster_image_url",
  "released": "15 Oct 2020",
  "runtime": "120 min",
  "genre": "Action, Drama",
  "writer": "Writer Name",
  "plot": "Movie plot summary",
  "awards": "Award information",
  "streaming": ["Netflix", "Prime"]
}
```

## LocalStorage Usage

The application uses localStorage to persist user preferences:

- `favoriteMovies`: Array of favorite movie IDs
- `darkMode`: Boolean for dark mode preference

## Browser Support

The application works best on modern browsers that support:
- ES6 JavaScript features
- localStorage API
- Flexbox and Grid CSS
- fetch API

## Development

To modify the application:

1. Edit HTML files for structure changes
2. Modify `styles.css` for custom styling
3. Update JavaScript files for functionality changes
4. Add or modify movie data in `imdb_tamil_movies_with_cast.json`

## Contributing

Feel free to fork this project and submit pull requests for improvements or bug fixes.

## License

This project is open source and available under the MIT License.