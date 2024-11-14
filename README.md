# weathersynth
play the weather

# Set up
Set up Python using this guide
* brew installed pyenv, pipenv
* Installing packages with pipenv


# Goal

The goal of the new wav branch is to do the following things:
1. Use the Visual Crossing API to retreive weather data in CSV form.
2. Massage the data into a .wav file for use with Ableton's Wavetable device

The prepared .wav file should be tuned to middle C (256 Hz) at 44.1 kHZ.

TODO: 
* Each day's wavetable should be balanced over the zero point.
* Apply windowing on each day's waveform in order to have nice zero crossings.

This details the Wavetable device's expectations with regards to wavetable .wav files https://help.ableton.com/hc/en-us/articles/360002719179-User-Wavetables

lol I'm not as creative as I thought https://www.sambilbow.com/projects/weathersynth/


To run:
pipenv run python wav/wav_interp.py


## Different approaches

### Ableton Wavetable with a sprite consisting of 1024-sample wavetables
https://help.ableton.com/hc/en-us/articles/360002719179-User-Wavetables
* Ableton Wavetable Synth can handle 256 wavetables in a sprite, each one 1024 samples in length.
#### One sample point per day to fill ~21 years of data
* Can do 256 months, where each month's wavetable has 1024 samples
* Start with 256 months of daily weather data (about 7.7k records)
* Resample each month of 28-31 days to 1024 samples
* Append them all into one .wav file
### Novation Peak wavetable morphing between 5 wavtables of 512 samples each
This doesn't do the same processing that Ableton's Wavetable synth does
#### Pick 5 years spaced 5 years apart to cover a larger time period to generate the sprite
* Pick this year, 5 years ago, 10 years ago, 15 years ago, and 20 years ago
* 365 records from each year
* Resample to 512 samples per year
* Window/fade and normalize each year
* Output to .wav
https://support.novationmusic.com/hc/en-gb/articles/360009550480-Components-Summit-Peak-Guide

###