# Tamil Movies Catalog with Enhanced Features

This project provides an enhanced Tamil movies catalog with additional information such as cast, director, and poster images fetched from the OMDB API.

## Features

- Movie listings with cast information
- Director information for each movie
- High-quality poster images
- Sorting by year (descending order by default)
- Search functionality
- Favorites system using localStorage
- Responsive design for mobile and desktop

## Files

- `update_movies_with_details.py` - Python script to fetch movie details from OMDB API
- `run_update.bat` - Windows batch file to run the update script
- `imdb_tamil_movies_full.json` - Original movie data
- `imdb_tamil_movies_with_cast.json` - Updated movie data with cast, director, and poster information
- `index.html` - Main catalog page
- `movie-detail.html` - Movie detail page
- `script.js` - Main JavaScript functionality
- `movie-detail.js` - Movie detail page JavaScript
- `styles.css` - Styling for the entire application

## How to Update Movie Information

1. Run `run_update.bat` (Windows) or execute `python update_movies_with_details.py` (other systems)
2. The script will:
   - Process movies in descending order by year
   - Fetch cast, director, and poster information for up to 1000 movies
   - Save the updated data to `imdb_tamil_movies_with_cast.json`
   - Respect API rate limits with delays between requests

## How to View the Catalog

1. Start a local web server in the project directory:
   ```bash
   python -m http.server 8000
   ```
2. Open your browser and navigate to `http://localhost:8000`

## API Key Information

The project uses the OMDB API with the key: 1916b9ca

## Customization

You can modify the following parameters in `update_movies_with_details.py`:
- `max_requests`: Maximum number of API requests (default: 1000)
- `delay`: Delay between requests in seconds (default: 1)

## Notes

- The application will automatically use the enhanced data file (`imdb_tamil_movies_with_cast.json`) if available
- If the enhanced data file is not found, it will fall back to the original data file
- Movie posters are displayed in both the catalog view and detail view
- Director information is shown below the year in the catalog view and in a dedicated section in the detail view