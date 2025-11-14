import json
import requests
import time
from urllib.parse import quote_plus

def fetch_movie_cast(movie_title, movie_year=None):
    """
    Fetch cast information for a movie using OMDB API
    Note: You'll need to get a free API key from http://www.omdbapi.com/
    """
    # Replace 'YOUR_API_KEY' with your actual OMDB API key
    api_key = "YOUR_API_KEY"
    
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
        return []
    except Exception as e:
        print(f"Error fetching data for {movie_title}: {e}")
        return []

def update_movies_with_cast(input_file, output_file, delay=1):
    """
    Update movies JSON file with cast information
    
    Args:
        input_file: Path to input JSON file
        output_file: Path to output JSON file
        delay: Delay between API requests (in seconds) to avoid rate limiting
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
    
    # Process each movie
    updated_movies = []
    for i, movie in enumerate(movies):
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
            if cast:
                movie['cast'] = cast
                print(f"  Found {len(cast)} cast members")
            else:
                print(f"  No cast information found")
                movie['cast'] = []
        else:
            print(f"  No title found, skipping...")
            movie['cast'] = []
        
        updated_movies.append(movie)
        
        # Add delay to avoid overwhelming the API
        if i < len(movies) - 1:  # Don't delay after the last item
            time.sleep(delay)
    
    # Save the updated data
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(updated_movies, f, indent=2, ensure_ascii=False)
        print(f"\nUpdated movies data saved to {output_file}")
    except Exception as e:
        print(f"Error saving file: {e}")

def create_sample_with_api_key():
    """
    Create a sample script with instructions for getting an API key
    """
    sample_content = '''
# Sample script to update cast information
# Instructions:
# 1. Get a free API key from http://www.omdbapi.com/
# 2. Replace "YOUR_API_KEY" with your actual API key
# 3. Run this script

import json
import requests
import time
from urllib.parse import quote_plus

def fetch_movie_cast(movie_title, movie_year=None):
    """
    Fetch cast information for a movie using OMDB API
    """
    # Replace 'YOUR_API_KEY' with your actual OMDB API key
    api_key = "YOUR_API_KEY"  # <-- Replace this with your API key
    
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
        return []
    except Exception as e:
        print(f"Error fetching data for {movie_title}: {e}")
        return []

def update_movies_with_cast(input_file, output_file, delay=1):
    """
    Update movies JSON file with cast information
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
    
    # Process each movie
    updated_movies = []
    for i, movie in enumerate(movies):
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
            if cast:
                movie['cast'] = cast
                print(f"  Found {len(cast)} cast members")
            else:
                print(f"  No cast information found")
                movie['cast'] = []
        else:
            print(f"  No title found, skipping...")
            movie['cast'] = []
        
        updated_movies.append(movie)
        
        # Add delay to avoid overwhelming the API
        if i < len(movies) - 1:  # Don't delay after the last item
            time.sleep(delay)
    
    # Save the updated data
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(updated_movies, f, indent=2, ensure_ascii=False)
        print(f"\\nUpdated movies data saved to {output_file}")
    except Exception as e:
        print(f"Error saving file: {e}")

# Run the update
if __name__ == "__main__":
    update_movies_with_cast("imdb_tamil_movies_full.json", "imdb_tamil_movies_with_cast.json")
'''
    
    with open("update_cast_sample.py", "w") as f:
        f.write(sample_content)
    
    print("Sample script with instructions created as 'update_cast_sample.py'")

if __name__ == "__main__":
    print("Tamil Movies Cast Updater")
    print("=" * 30)
    print("This script will update your JSON file with cast information.")
    print("To use this script, you need to:")
    print("1. Get a free API key from http://www.omdbapi.com/")
    print("2. Replace 'YOUR_API_KEY' in the script with your actual API key")
    print("3. Run the script")
    print()
    print("Creating a sample script with instructions...")
    
    create_sample_with_api_key()
    
    print("To run the update:")
    print("1. Edit 'update_cast_sample.py' and add your API key")
    print("2. Run: python update_cast_sample.py")