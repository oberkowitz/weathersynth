importScripts("./js/d3.v4.min.js");
importScripts("./js/util.js");
var msPerDay = 86400000 // 24 * 60 * 60 * 1000

var bisectDate = d3.bisector(d => d.x).left;

onmessage = function(e) {
  console.log('Message received from main script');
  var workerResult = generateSamples(e.data.array, e.data.increment);

  console.log('Posting message back to main script');
  postMessage(workerResult);
}

function generateSamples(data, increment) {
    data.sort((a, b) => a.x - b.x);	
    var xMin = d3.min(data, function(d) { return d.x; }).getTime();
    var xMax = d3.max(data, function(d) { return d.x; }).getTime();

    if (increment <= 0 || xMin >= xMax) {
        return;
    }
    
    var numSamples = Math.floor((xMax - xMin) / increment);
    var buf = [];
    for (var i = 0; i < numSamples; i++) {
        buf.push(getYForX(i * increment + xMin, data));
    }

    // Methods are defined in util.js
	var min = buf.min();
	var max = buf.max();
    var normies = buf.map(function(x) { // Normalize the data
        return ardmap(x, min, max, -1.0, 1.0);
    })
    return normies;
}   

// Pass in the already inverted x value
function getYForX(x, data) {
    var i = bisectDate(data, x, 1);
    var d0 = data[i - 1];
    var d1 = data[i];
    // If the y's are equal, just return one so we don't divide by zero
    if (d0.y == d1.y) {
        return d0.y;
    }
    // Interpolate
    var interp = d3.interpolateObject(d0, d1);
    var p = (x - d0.x) / (d1.x - d0.x);
    var d = interp(p);
    return d.y;

}

