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