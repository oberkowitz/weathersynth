# weathersynth
play the weather

# Set up
you'll need to run the script `yearlyscraper.sh` with the airport code and year you want to use. you'll also need to make the tablescrape.py file executable to do that. ```chmod +x tablescrape.py``` And you need python installed.

Ex: `sh yearlyscraper.sh KOAK 2016`. Usually, you take the 3 digit airport code and put a K in front of it. That will dump all the weather data to `./weatherData/KOAK/`

# Running the test
First things first, run the scraper so you have the data. If you didn't use the OAK airport, change the code in weather.html to use your airport.
Run `python -m SimpleHTTPServer` in the root directory in order to properly run the example. Visit `http://localhost:8000/weather.html`