function WeatherSynth(dataBuffer) {
	this.audioCtx = audioCtx;
	this.dataBuffer = dataBuffer;
	this.currentBuffer = dataBuffer;
	this.activeKeys = {};
}

WeatherSynth.prototype.createBufferForNote = function(note, velocity) {
	var playbackRate = frequencyFromNote(note) / 440.0; // TODO: This is the playback rate compared to Middle A, need to get this aligned with sample rate
	var channels = 2;
	var frameCount = this.currentBuffer.length;
	var buffer = this.audioCtx.createBuffer(channels, frameCount, this.audioCtx.sampleRate);

	var source = this.audioCtx.createBufferSource();
	var biquadFilter = this.audioCtx.createBiquadFilter();
	var gain = this.audioCtx.createGain();
	var envelope = new EnvelopeGenerator(this.audioCtx, {});

	for (var channel = 0; channel < channels; channel++) {
		var nowBuffering = buffer.getChannelData(channel);
		for (var i = 0; i < frameCount; i++) {
			nowBuffering[i] = this.currentBuffer[i];
		}
	}

	source.buffer = buffer;
	source.loop = true;
	source.playbackRate.value = playbackRate;

	source.connect(gain);
	gain.connect(biquadFilter);
	envelope.connect(gain.gain);
	biquadFilter.connect(this.audioCtx.destination);
	biquadFilter.type = "lowpass";
	biquadFilter.frequency.value = 10000;

	return {
		"source": source,
		"envelope": envelope
	}
}

WeatherSynth.prototype.setSelection= function(selection) {
    var start = Math.floor(ardmap(selection["start"], 0, 100, 0, this.dataBuffer.length));
    var end = Math.floor(ardmap(selection["end"], 0, 100, 0, this.dataBuffer.length));
    this.currentBuffer = this.dataBuffer.slice(start, end);
}	

// helper functions
function frequencyFromNote(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
}

WeatherSynth.prototype.noteOn = function(note, velocity) {
	if (this.activeKeys[note]) delete this.activeKeys[note];
	this.activeKeys[note] = this.createBufferForNote(note, velocity);
	this.activeKeys[note].source.start();
	this.activeKeys[note].envelope.trigger();

}

WeatherSynth.prototype.noteOff = function(note) {
	if (!this.activeKeys[note]) return;
	this.activeKeys[note].envelope.release();
}
