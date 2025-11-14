import json
import requests
import time
from urllib.parse import quote_plus

def fetch_movie_cast(movie_title, movie_year=None):
    """
    Fetch cast information for a movie using OMDB API
    """
    # Using your provided API key
    api_key = "b5c868a4"
    
    # Construct the API URL
    if movie_year:
        url = f"http://www.omdbapi.com/?t={quote_plus(movie_title)}&y={movie_year}&apikey={api_key}"
    else:
        url = f"http://www.omdbapi.com/?t={quote_plus(movie_title)}&apikey={api_key}"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            if data.get('Response') == 'True':
                # Extract cast information
                cast = data.get('Actors', '')
                if cast:
                    # Split cast into a list
                    cast_list = [actor.strip() for actor in cast.split(',')]
                    return cast_list
        # Check if we hit the API limit
        elif response.status_code == 429:
            print("API limit reached. Please try again later.")
            return None
        return []
    except Exception as e:
        print(f"Error fetching data for {movie_title}: {e}")
        return []

def update_movies_with_cast(input_file, output_file, delay=1, max_requests=900):
    """
    Update movies JSON file with cast information
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
    
    print(f"Loaded {len(movies)} movies from {input_file}")
    print(f"Will process up to {max_requests} movies to stay within API limits")
    
    # Process each movie
    updated_movies = []
    requests_made = 0
    
    for i, movie in enumerate(movies):
        if requests_made >= max_requests:
            print(f"Reached API limit of {max_requests} requests. Stopping to avoid rate limiting.")
            # Add the remaining movies without updating them
            updated_movies.extend(movies[i:])
            break
            
        print(f"Processing {i+1}/{len(movies)}: {movie.get('title', 'Unknown Title')}")
        
        # Skip if cast already exists
        if 'cast' in movie and movie['cast']:
            print(f"  Cast already exists, skipping...")
            updated_movies.append(movie)
            continue
        
        # Fetch cast information
        title = movie.get('title', '')
        year = movie.get('year', '')
        
        if title:
            cast = fetch_movie_cast(title, year)
            # Check if we hit API limit
            if cast is None:
                print("API limit reached. Saving progress and stopping.")
                # Add the remaining movies without updating them
                updated_movies.extend(movies[i:])
                break
                
            if cast:
                movie['cast'] = cast
                print(f"  Found {len(cast)} cast members: {', '.join(cast[:3])}{'...' if len(cast) > 3 else ''}")
            else:
                print(f"  No cast information found")
                movie['cast'] = []
                
            requests_made += 1
        else:
            print(f"  No title found, skipping...")
            movie['cast'] = []
        
        updated_movies.append(movie)
        
        # Add delay to avoid overwhelming the API
        if i < len(movies) - 1 and requests_made < max_requests:  # Don't delay after the last item
            time.sleep(delay)
    
    # Save the updated data
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(updated_movies, f, indent=2, ensure_ascii=False)
        print(f"\nUpdated movies data saved to {output_file}")
        print(f"Successfully processed {len(updated_movies)} movies")
        print(f"Made {requests_made} API requests")
    except Exception as e:
        print(f"Error saving file: {e}")

# Run the update
if __name__ == "__main__":
    print("Starting Tamil Movies Cast Update...")
    print("Using API Key: b5c868a4")
    print("Limited to 900 requests to stay within free API limits")
    print("=" * 50)
    update_movies_with_cast("imdb_tamil_movies_full.json", "imdb_tamil_movies_with_cast.json")