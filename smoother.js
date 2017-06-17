importScripts("./js/d3.v4.min.js");
importScripts("./js/util.js");

onmessage = function(e) {
  console.log('Smoother Message received from main script');
  var workerResult = smoothSamples(e.data.array, e.data.baseFreq, e.data.percentage);

  console.log('Smoother Posting message back to main script');
  postMessage(workerResult);
}

var smoothSamples = function(buffer, baseFreq, percentage) {
	var buf = [];
	var coz = smoothingWaveGenerator(baseFreq);
	for (var i = 0; i < buffer.length; i++) {
		buf.push(coz(i));
	}

	var interpolator = d3.interpolate(buffer, coz);
	var amount = ardmap(percentage, 0, 100, 0, 1);
	return interpolator(amount);
}

// Return a function that given a sample
var smoothingWaveGenerator = function(baseFreq) {
	// The smoothing wave is a negative cosine
	return function(t) {
		return -1 * Math.cos(2 * Math.PI * baseFreq * t)
	}
}