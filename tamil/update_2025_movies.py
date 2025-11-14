import json
import requests
import time
from urllib.parse import quote_plus

def fetch_movie_details(movie_title, movie_year=None):
    """
    Fetch cast, director, and poster information for a movie using OMDB API
    """
    # Using your provided API key
    api_key = "b5c868a4"
    
    # Construct the API URL with additional parameters to get more details
    if movie_year:
        url = f"http://www.omdbapi.com/?t={quote_plus(movie_title)}&y={movie_year}&apikey={api_key}&plot=short"
    else:
        url = f"http://www.omdbapi.com/?t={quote_plus(movie_title)}&apikey={api_key}&plot=short"
    
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

def update_2025_movies_with_details(input_file, output_file, delay=1, max_requests=1000):
    """
    Update movies JSON file with cast, director, and poster information
    Focuses on movies from 2025, in descending order
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
    
    # Filter for 2025 movies only
    movies_2025 = [movie for movie in movies if movie.get('year') == '2025']
    
    # Sort in descending order by index (or any other relevant field)
    movies_2025.sort(key=lambda x: x.get('index', 0), reverse=True)
    
    print(f"Loaded {len(movies)} total movies from {input_file}")
    print(f"Found {len(movies_2025)} movies from 2025")
    print(f"Will process up to {max_requests} movies to stay within API limits")
    
    # Process 2025 movies
    updated_movies = []
    requests_made = 0
    
    # First, add all non-2025 movies to the result
    non_2025_movies = [movie for movie in movies if movie not in movies_2025]
    updated_movies.extend(non_2025_movies)
    
    # Process 2025 movies
    for i, movie in enumerate(movies_2025):
        if requests_made >= max_requests:
            print(f"Reached API limit of {max_requests} requests. Stopping to avoid rate limiting.")
            # Add the remaining 2025 movies without updating them
            updated_movies.extend(movies_2025[i:])
            break
            
        print(f"Processing {i+1}/{len(movies_2025)}: {movie.get('title', 'Unknown Title')} ({movie.get('year', 'Unknown Year')})")
        
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
                # Add the remaining 2025 movies without updating them
                updated_movies.extend(movies_2025[i:])
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
        if i < len(movies_2025) - 1 and requests_made < max_requests:  # Don't delay after the last item
            time.sleep(delay)
    
    # Sort all movies by index to maintain original order
    updated_movies.sort(key=lambda x: x.get('index', 0))
    
    # Save the updated data
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(updated_movies, f, indent=2, ensure_ascii=False)
        print(f"\nUpdated movies data saved to {output_file}")
        print(f"Successfully processed {len([m for m in updated_movies if m.get('year') == '2025'])} movies from 2025")
        print(f"Made {requests_made} API requests")
    except Exception as e:
        print(f"Error saving file: {e}")

# Run the update
if __name__ == "__main__":
    print("Starting Tamil Movies Update for 2025...")
    print("Using API Key: b5c868a4")
    print("Focusing on movies from 2025 in descending order")
    print("Limited to 1000 requests")
    print("=" * 50)
    update_2025_movies_with_details("imdb_tamil_movies_full.json", "imdb_tamil_movies_with_cast.json")