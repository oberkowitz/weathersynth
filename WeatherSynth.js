function WeatherSynth(dataBuffer, audioCtx, canvas) {
	this.audioCtx = audioCtx;
	this.canvas = canvas;
	this.dataBuffer = dataBuffer;
	this.currentBuffer = dataBuffer;
	this.analyser = this.audioCtx.createAnalyser();
	this.analyser.connect(this.audioCtx.destination);
	this.activeKeys = {};
	this.startVisualizer(this.analyser);
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
	source.loop = true; // TODO: Looping the source prevents automatic garbage collection, release it when finished
	source.playbackRate.value = playbackRate;

	source.connect(gain);
	gain.connect(biquadFilter);
	envelope.connect(gain.gain);
	biquadFilter.connect(this.analyser);
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
	if (this.activeKeys[note]) {
		// this.activeKeys[note].source.stop();
		delete this.activeKeys[note];
	}
	this.activeKeys[note] = this.createBufferForNote(note, velocity);
	this.activeKeys[note].source.start();
	this.activeKeys[note].envelope.trigger();
	console.log(this.activeKeys);

}

WeatherSynth.prototype.noteOff = function(note) {
	var note = this.activeKeys[note];
	if (!note) return;
	note.envelope.release();
	var that = this;
	setTimeout(function() {
		console.log(note);
		note.source.stop();
		console.log("stop");
	}, Math.floor(note.envelope.releaseTime * 1000));
}

WeatherSynth.prototype.startVisualizer = function(analyser) {
	WIDTH = this.canvas.width;
	HEIGHT = this.canvas.height;
	var canvasCtx = this.canvas.getContext("2d");

	analyser.fftSize = 2048;
	var bufferLength = analyser.frequencyBinCount;
	console.log(bufferLength);
	var dataArray = new Uint8Array(bufferLength);

	canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);


	var that = this;
	function draw() {

		drawVisual = requestAnimationFrame(draw);

		analyser.getByteTimeDomainData(dataArray);

		canvasCtx.fillStyle = 'rgb(0, 0, 0)';
		canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

		canvasCtx.lineWidth = 2;
		canvasCtx.strokeStyle = 'rgb(255, 255, 255)';

		canvasCtx.beginPath();

		var sliceWidth = WIDTH * 1.0 / bufferLength;
		var x = 0;

		for(var i = 0; i < bufferLength; i++) {

			var v = dataArray[i] / 128.0;
			var y = v * HEIGHT/2;

			if(i === 0) {
			  canvasCtx.moveTo(x, y);
			} else {
			  canvasCtx.lineTo(x, y);
			}

			x += sliceWidth;
		}

		canvasCtx.lineTo(that.canvas.width, that.canvas.height/2);
		canvasCtx.stroke();
	}

	draw();
}
