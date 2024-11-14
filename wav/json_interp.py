# This file takes a CSV file and creates an audio file out of it.
import numpy as np
import datetime
from scipy.io.wavfile import write
import json

def load_from_json_file(fpath):

    with open(fpath) as f:
        d = json.load(f)
    return d

def flat_map(f, xs):
    ys = []
    for x in xs:
        ys.extend(f(x))
    return ys

response = load_from_json_file("/Users/oberk/git/weathersynth/wav/data/2024-04-18.json")

days = np.array(response['days'])
xys = flat_map( lambda day: map(lambda h: (h['datetimeEpoch'], h['temp']), day['hours']), days)
npxys = np.array(xys, dtype = [('datetimeEpoch', 'i4'), ('temp', 'f4')])

xp = npxys['datetimeEpoch']
fp = npxys['temp']
## use linspace for even spacing between start and end
# x = np.linspace(xp.min(), xp.max(), num=184, endpoint=True)
## Use arange for known step value
## 86,400 seconds in a day
## Middle C is 261 Hz
## dividing a day into that many samples means incrementing with arange by 469.8205546492659
seconds_per_day = 86400.0
sample_rate = 44100.0
middle_c = 261.0
samples_per_cycle = 1024.0
step_in_seconds = seconds_per_day / samples_per_cycle

# TODO: arange is end-exclusive, so the number of samples is probably a bit shorter than it needs to be. for the test file, it was 2006 samples instead of expected 2048
x2 = np.arange(xp.min(), xp.max(), step=step_in_seconds)

y = np.interp(x2, xp, fp)
audio = y 
# Normalize to [-1,1]
audio = 2.*(audio - np.min(audio))/np.ptp(audio)-1

write(f"test-{datetime.datetime.now().microsecond}.wav", int(sample_rate), audio.astype(np.float32))