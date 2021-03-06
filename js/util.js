var ardmap = function(x, inMin, inMax, outMin, outMax) { // Map value x in range [inMin, inMax] to a value in range [outMin, outMax]
	// Ex: ardmap(5, 0, 10, 2, 4) == 3
	return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}
function pad(n, width, z) {
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function isLeapYear(year) {  
	return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);  
}  

function randomDate(start, end) {
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

Array.prototype.extend = function (other_array) {
	/* you should include a test to check whether other_array really is an array */
	other_array.forEach(function(v) {this.push(v)}, this);    
}

Array.prototype.max = function() {
  var max = Number.MIN_VALUE;
  this.forEach(function(e) {
    if (max <= e) {
      max = e;
    }
  });
  return max;
}

Array.prototype.min = function() {
  var min = Number.MAX_VALUE;
  this.forEach(function(e) {
    if (min >= e) {
      min = e;
    }
  });
  return min;
}
