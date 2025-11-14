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
        return []
    except Exception as e:
        # print(f"Error fetching data for {movie_title}: {e}")
        return []

def add_sample_cast_data(movies):
    """
    Add sample cast data to demonstrate the feature
    """
    # Add sample cast data to first few movies that don't have cast info
    sample_cast_data = {
        "Baahubali: The Beginning": ["Prabhas", "Rana Daggubati", "Anushka Shetty", "Tamannaah", "Ramya Krishna"],
        "Baahubali 2: The Conclusion": ["Prabhas", "Rana Daggubati", "Anushka Shetty", "Tamannaah", "Sathyaraj"],
        "Kabali": ["Rajinikanth", "Winston Chao", "Radhika Apte", "Dhansika"],
        "Enthiran": ["Rajinikanth", "Aishwarya Rai Bachchan", "Danny Denzongpa", "Santhanam"],
        "Sivaji: The Boss": ["Rajinikanth", "Shriya Saran", "Vivek", "Suman Setty"],
        "Pokkiri": ["Vijay", "Asin", "Prakash Raj", "Nassar"],
        "Veeram": ["Ajith Kumar", "Tamannaah", "Vidyut Jammwal", "Atul Kulkarni"],
        "Theri": ["Vijay", "Samantha Ruth Prabhu", "Amy Jackson", "Satish Kaushik"],
        "Mersal": ["Vijay", "Samantha Ruth Prabhu", "Kajal Aggarwal", "Nithya Menen"],
        "Bigil": ["Vijay", "Nayanthara", "Raashi Khanna", "Prabhu"],
        "Master": ["Vijay", "Vijay Sethupathi", "Malavika Mohanan", "Andrea Jeremiah"],
        "Soorarai Pottru": ["Suriya", "Madhavan", "Paresh Rawal", "Aparna Balamurali"],
        "Kaithi": ["Karthi", "Narain", "Arunoday Singh", "Zakir Hussain"],
        "Vikram": ["Kamal Haasan", "Vijay Sethupathi", "Fahadh Faasil", "Kalidas Jayaram"],
        "KGF: Chapter 1": ["Yash", "Srinidhi Shetty", "Ramachandra Raju", "Archana Jois"],
        "KGF: Chapter 2": ["Yash", "Srinidhi Shetty", "Raveena Tandon", "Prakash Raj"],
        "Pushpa: The Rise": ["Allu Arjun", "Rashmika Mandanna", "Fahadh Faasil", "Dhananjaya"],
        "RRR": ["N.T. Rama Rao Jr.", "Ram Charan", "Alia Bhatt", "Ajay Devgn"],
        "96": ["Vijay Sethupathi", "Trisha Krishnan", "Hariharan", "Ramya Krishnan"],
        "Asuran": ["Dhanush", "Manju Warrier", "Prakash Raj", "Pasupathy"]
    }
    
    updated_movies = []
    for movie in movies:
        # If cast already exists, keep it
        if 'cast' in movie and movie['cast']:
            updated_movies.append(movie)
            continue
            
        # Try to add sample cast data
        title = movie.get('title', '')
        if title in sample_cast_data:
            movie['cast'] = sample_cast_data[title]
            print(f"Added sample cast for: {title}")
        else:
            # Try to fetch from OMDB for recent movies
            year = movie.get('year', '')
            if year and year.isdigit() and int(year) >= 2010:
                cast = fetch_movie_cast(title, year)
                if cast:
                    movie['cast'] = cast
                    print(f"Fetched cast for: {title} ({year})")
                else:
                    movie['cast'] = []
            else:
                movie['cast'] = []
                
        updated_movies.append(movie)
    
    return updated_movies

def update_movies_with_cast(input_file, output_file):
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
    
    # Add cast information
    updated_movies = add_sample_cast_data(movies)
    
    # Count how many movies have cast information
    movies_with_cast = sum(1 for movie in updated_movies if 'cast' in movie and movie['cast'])
    print(f"Movies with cast information: {movies_with_cast}")
    
    # Save the updated data
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(updated_movies, f, indent=2, ensure_ascii=False)
        print(f"\nUpdated movies data saved to {output_file}")
        print(f"Successfully processed {len(updated_movies)} movies")
    except Exception as e:
        print(f"Error saving file: {e}")

# Run the update
if __name__ == "__main__":
    print("Starting Tamil Movies Cast Update...")
    print("Using API Key: b5c868a4")
    print("Adding sample cast data for popular recent movies")
    print("=" * 50)
    update_movies_with_cast("imdb_tamil_movies_full.json", "imdb_tamil_movies_with_cast.json")