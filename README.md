# weathersynth
play the weather

# Set up
you'll need to run the script `yearlyscraper.sh` with the airport code and year you want to use. you'll also need to make the tablescrape.py file executable to do that. ```chmod +x tablescrape.py``` And you need python installed.

# Running the test
First, open chrome with the `--allow-file-access-from-files` argument. For example on Mac: `open /Applications/Google\ Chrome.app --args --allow-file-access-from-files`. This allows you to get around the Same Origin Policy while testing locally. I don't have a solution for this yet if I were to launch this but probably a proxy or something.