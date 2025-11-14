import json

def add_cast_to_specific_movies(input_file, output_file):
    """
    Add cast information to specific Tamil movies in the JSON file
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
    
    # Define cast information for specific movies
    cast_data = {
        "Kaithi": ["Karthi", "Narain", "Arunoday Singh", "Zakir Hussain"],
        "Asuran": ["Dhanush", "Manju Warrier", "Prakash Raj", "Pasupathy"],
        "Vikram": ["Kamal Haasan", "Vijay Sethupathi", "Fahadh Faasil", "Kalidas Jayaram"],
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
        "KGF: Chapter 1": ["Yash", "Srinidhi Shetty", "Ramachandra Raju", "Archana Jois"],
        "KGF: Chapter 2": ["Yash", "Srinidhi Shetty", "Raveena Tandon", "Prakash Raj"],
        "Pushpa: The Rise": ["Allu Arjun", "Rashmika Mandanna", "Fahadh Faasil", "Dhananjaya"],
        "RRR": ["N.T. Rama Rao Jr.", "Ram Charan", "Alia Bhatt", "Ajay Devgn"],
        "96": ["Vijay Sethupathi", "Trisha Krishnan", "Hariharan", "Ramya Krishnan"]
    }
    
    # Update movies with cast information
    updated_count = 0
    for movie in movies:
        title = movie.get('title', '')
        if title in cast_data and ('cast' not in movie or not movie['cast']):
            movie['cast'] = cast_data[title]
            updated_count += 1
            print(f"Added cast for: {title}")
        elif 'cast' not in movie:
            # Add empty cast array if not present
            movie['cast'] = []
    
    print(f"Updated cast information for {updated_count} movies")
    
    # Save the updated data
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(movies, f, indent=2, ensure_ascii=False)
        print(f"\nUpdated movies data saved to {output_file}")
        print(f"Successfully processed {len(movies)} movies")
    except Exception as e:
        print(f"Error saving file: {e}")

# Run the update
if __name__ == "__main__":
    print("Adding cast information to specific Tamil movies...")
    print("=" * 50)
    add_cast_to_specific_movies("imdb_tamil_movies_full.json", "imdb_tamil_movies_with_cast.json")