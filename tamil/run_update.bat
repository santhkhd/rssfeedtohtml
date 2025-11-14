@echo off
echo Starting Tamil Movies Update...
echo This will fetch cast, director, and poster information for up to 1000 movies
echo Movies will be processed in descending order by year
echo.
pause
python update_movies_with_details.py
echo.
echo Update complete!
pause