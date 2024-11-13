# This file takes a CSV file and creates an audio file out of it.
import numpy as np
import numpy.lib.recfunctions
from scipy.io.wavfile import write

records = np.genfromtxt('./KLGB_20240418_2024-04-19.csv', delimiter=',', names=True, dtype=None)

datetimes = records['datetime'].astype(np.datetime64)
# Convert to float (Unix seconds) 
# TODO: this number is quite big, floating point roundoff could become an issue. Best to use deltas instead of actual time.
xp = datetimes.astype(np.float64) # returns seconds, not ms
## use linspace for even spacing between start and end
x = np.linspace(xp.min(), xp.max(), num=184, endpoint=True)
## Use arange for known step value
## 86,400 seconds in a day
## Middle C is 261 Hz
## Assume sample rate of 48 kHz
## 48000/261 = 183.908045977 samples in one cycle, if there will be 261 cycles per second. One day should have that many samples
## dividing a day into that many samples means incrementing with arange by 469.8205546492659
seconds_per_day = 86400.0
sample_rate = 44100.0
middle_c = 261.0
samples_per_cycle = 1024.0
step_in_seconds = seconds_per_day / samples_per_cycle


x2 = np.arange(xp.min(), xp.max(), step=step_in_seconds)

fp = records['temp']

y = np.interp(x2, xp, fp)
audio = y 
# Normalize to [-1,1]
audio = 2.*(audio - np.min(audio))/np.ptp(audio)-1

write("test.wav", int(sample_rate), audio.astype(np.float32))