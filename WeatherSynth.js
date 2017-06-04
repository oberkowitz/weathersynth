var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function WeatherSynth(dataBuffer) {
	this.audioCtx = audioCtx;
	this.dataBuffer = dataBuffer;
}

WeatherSynth.prototype.render = function() {
	console.log(buf.length);
	var channels = 2;
	var frameCount = buf.length;
	var buffer = this.audioCtx.createBuffer(channels, frameCount, this.audioCtx.sampleRate);

	var source = this.audioCtx.createBufferSource();
	var biquadFilter = this.audioCtx.createBiquadFilter();
	var gain = this.audioCtx.createGain();
	var env = new EnvelopeGenerator(this.audioCtx);

	for (var channel = 0; channel < channels; channel++) {
		var nowBuffering = buffer.getChannelData(channel);
		for (var i = 0; i < frameCount; i++) {
			nowBuffering[i] = buf[i];
		}
	}


	source.buffer = buffer;
	source.loop = true;

	source.connect(gain);
	gain.connect(biquadFilter);
	env.connect(gain.gain);
	biquadFilter.connect(this.audioCtx.destination);
	biquadFilter.type = "lowpass";
	biquadFilter.frequency.value = 10000;

	source.start();
	env.trigger();
}