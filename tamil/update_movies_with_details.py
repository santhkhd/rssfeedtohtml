import json
import requests
import time
from urllib.parse import quote_plus

def fetch_movie_details(movie_title, movie_year=None):
    """
    Fetch cast, director, and poster information for a movie using OMDB API
    """
    # Using your provided API key
    api_key = "1916b9ca"
    
    # Construct the API URL with additional parameters to get more details
    # Adding higher quality poster request
    if movie_year:
        url = f"http://www.omdbapi.com/?t={quote_plus(movie_title)}&y={movie_year}&apikey={api_key}&plot=short&type=movie"
    else:
        url = f"http://www.omdbapi.com/?t={quote_plus(movie_title)}&apikey={api_key}&plot=short&type=movie"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            if data.get('Response') == 'True':
                # Extract cast information
                cast = data.get('Actors', '')
                cast_list = []
                if cast and cast != 'N/A':
                    # Split cast into a list
                    cast_list = [actor.strip() for actor in cast.split(',')]
                
                # Extract director information
                director = data.get('Director', '')
                if director == 'N/A':
                    director = ''
                
                # Extract poster image link
                poster = data.get('Poster', '')
                if poster == 'N/A':
                    poster = ''
                else:
                    # Try to get a higher resolution version of the poster
                    # OMDB API returns a lower resolution image by default
                    # We can try to get a higher resolution by modifying the URL
                    if poster and '_V1_' in poster:
                        # Try to get a higher resolution version
                        # Replace SX300/SY300 with higher values for better quality
                        poster = poster.replace('SX300', 'SX600').replace('SY300', 'SY900')
                        # Also try other common size patterns
                        poster = poster.replace('SX200', 'SX600').replace('SY200', 'SY900')
                        poster = poster.replace('SX150', 'SX600').replace('SY150', 'SY900')
                        poster = poster.replace('SX100', 'SX600').replace('SY100', 'SY900')
                
                return {
                    'cast': cast_list,
                    'director': director,
                    'poster': poster
                }
        # Check if we hit the API limit
        elif response.status_code == 429:
            print("API limit reached. Please try again later.")
            return None
        return {'cast': [], 'director': '', 'poster': ''}
    except Exception as e:
        print(f"Error fetching data for {movie_title}: {e}")
        return {'cast': [], 'director': '', 'poster': ''}

def update_movies_with_details(input_file, output_file, delay=1, max_requests=1000):
    """
    Update movies JSON file with cast, director, and poster information
    Processes movies in descending order by year
    Limits requests to avoid API limits
    """
    # Load the existing movies data
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            movies = json.load(f)
    except FileNotFoundError:
        print(f"Error: File {input_file} not found.")
        return
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in file {input_file}.")
        return
    
    # Sort movies by year in descending order (newest first)
    movies.sort(key=lambda x: x.get('year', '') or '', reverse=True)
    
    print(f"Loaded {len(movies)} movies from {input_file}")
    print(f"Will process up to {max_requests} movies to stay within API limits")
    
    # Process movies
    updated_movies = []
    requests_made = 0
    
    for i, movie in enumerate(movies):
        if requests_made >= max_requests:
            print(f"Reached API limit of {max_requests} requests. Stopping to avoid rate limiting.")
            # Add the remaining movies without updating them
            updated_movies.extend(movies[i:])
            break
            
        print(f"Processing {i+1}/{len(movies)}: {movie.get('title', 'Unknown Title')} ({movie.get('year', 'Unknown Year')})")
        
        # Skip if cast already exists
        if 'cast' in movie and movie['cast'] and len(movie['cast']) > 0:
            print(f"  Details already exist, skipping...")
            updated_movies.append(movie)
            continue
        
        # Fetch movie details
        title = movie.get('title', '')
        year = movie.get('year', '')
        
        if title:
            details = fetch_movie_details(title, year)
            # Check if we hit API limit
            if details is None:
                print("API limit reached. Saving progress and stopping.")
                # Add the remaining movies without updating them
                updated_movies.extend(movies[i:])
                break
                
            if details:
                movie['cast'] = details['cast']
                movie['director'] = details['director']
                movie['poster'] = details['poster']
                
                if details['cast']:
                    print(f"  Found {len(details['cast'])} cast members: {', '.join(details['cast'][:3])}{'...' if len(details['cast']) > 3 else ''}")
                if details['director']:
                    print(f"  Director: {details['director']}")
                if details['poster']:
                    print(f"  Poster: {details['poster']}")
            else:
                print(f"  No information found")
                movie['cast'] = []
                movie['director'] = ''
                movie['poster'] = ''
                
            requests_made += 1
        else:
            print(f"  No title found, skipping...")
            movie['cast'] = []
            movie['director'] = ''
            movie['poster'] = ''
        
        updated_movies.append(movie)
        
        # Add delay to avoid overwhelming the API
        if i < len(movies) - 1 and requests_made < max_requests:  # Don't delay after the last item
            time.sleep(delay)
    
    # Save the updated data
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(updated_movies, f, indent=2, ensure_ascii=False)
        print(f"\nUpdated movies data saved to {output_file}")
        print(f"Successfully processed {requests_made} movies")
        print(f"Made {requests_made} API requests")
    except Exception as e:
        print(f"Error saving file: {e}")

# Run the update
if __name__ == "__main__":
    print("Starting Tamil Movies Update...")
    print("Using API Key: 1916b9ca")
    print("Processing movies in descending order by year")
    print("Limited to 1000 requests")
    print("=" * 50)
    update_movies_with_details("imdb_tamil_movies_full.json", "imdb_tamil_movies_with_cast.json")