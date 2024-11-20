# This file takes a JSON file and creates an audio file out of it.
import numpy as np
import datetime
from scipy.io.wavfile import write
from scipy.signal.windows import tukey
import json

# To avoid confusion, the following definition of words will be used:
#    * Wavetable == a single wavetable
#    * Sprite == A collection of wavetables in an audio file

SAMPLE_RATE = 44100.0

def load_from_json_file(fpath):

    with open(fpath) as f:
        d = json.load(f)
    return d

# Assumes x is monotonically increasing
def generate_wavetable(x, y, num_samples: int, windowing=False):
    ## use linspace for even spacing between start and end
    x2 = np.linspace(x.min(), x.max(), num_samples)
    interpolated = np.interp(x2, x, y)
    normalized = 2.*(interpolated - np.min(interpolated))/np.ptp(interpolated)-1
    
    if windowing:
        window = tukey(num_samples, alpha = .1, sym=True) ## increasing alpha applies windowing to more of the signal. Default = .5, max = 1.0
        output = np.multiply(normalized, window)
    else: 
        output = normalized

    return output

# Assumes x-axis will be `datetimeEpoch`
def generate_yearlong_wavetable(year_json, y_name: str, num_samples: int):
    days = np.array(year_json['days'])
    xys = map(lambda h: (h['datetimeEpoch'], h[y_name]), days)
    npxys = np.array(list(xys), dtype = [('datetimeEpoch', 'i4'), (y_name, 'f4')])
    return generate_wavetable(npxys["datetimeEpoch"], npxys[y_name], num_samples, True)

response_1970 = load_from_json_file("/Users/oberk/git/weathersynth/wav/data/1970/Berlin_1970.json")
response_1976 = load_from_json_file("/Users/oberk/git/weathersynth/wav/data/1976/Berlin_1976.json")
response_1992 = load_from_json_file("/Users/oberk/git/weathersynth/wav/data/1992/Berlin_1992.json")
response_2008 = load_from_json_file("/Users/oberk/git/weathersynth/wav/data/2008/Berlin_2008.json")
response_2024 = load_from_json_file("/Users/oberk/git/weathersynth/wav/data/2024/Berlin_2024.json")

wavetable_1970 = generate_yearlong_wavetable(response_1970, "tempmax", 1024)
wavetable_1976 = generate_yearlong_wavetable(response_1976, "tempmax", 1024)
wavetable_1992 = generate_yearlong_wavetable(response_1992, "tempmax", 1024)
wavetable_2008 = generate_yearlong_wavetable(response_2008, "tempmax", 1024)
wavetable_2024 = generate_yearlong_wavetable(response_2024, "tempmax", 1024)

final_audio = np.concatenate((wavetable_1970, wavetable_1976, wavetable_1992, wavetable_2008, wavetable_2024))
file_name = f"test-{datetime.datetime.now().ctime()}.wav"
write(file_name, int(SAMPLE_RATE), final_audio.astype(np.float32))

print(f"Wrote {len(final_audio)} samples to {file_name}")