var msPerDay = 86400000 // 24 * 60 * 60 * 1000
var samplesPerDay = 200;
var dataObj;
var audioBuffer;
var currentBuffer;
// Create outer SVG object
var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 110, left: 40},
    margin2 = {top: 430, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    height2 = +svg.attr("height") - margin2.top - margin2.bottom;
    focus = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// Date parsing functions
var parseDate = d3.timeParse("%Y-%m-%d %I:%M %p"),
    formatDate = d3.timeFormat("%Y");

var bisectDate = d3.bisector(d => d.x).left;

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    x2 = d3.scaleTime().range([0, width]),
    y2 = d3.scaleLinear().range([height2, 0]);

var xAxis = d3.axisBottom(x),
    xAxis2 = d3.axisBottom(x2),
    yAxis = d3.axisLeft(y);

var line = d3.line()
    .x(function(d) { return x(d.x)})
    .y(function(d) { return y(d.y)});

var yGroup = focus.append("g");

var xGroup = focus.append("g")
    .attr("id", "xGroup")
    .attr("transform", "translate(0," + height + ")");

var zoom = d3.zoom()
    .scaleExtent([1, 366])
    .translateExtent([[-width, -Infinity], [2 * width, Infinity]])
    .on("zoom", zoomed);

var zoomRect = svg.append("rect")
    .attr("id", "zoomRect")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .call(zoom);

// Clip path to keep line path within the rectangle
var mask = svg.append("defs")
  .append("clipPath")
  .attr("id", "mask")
  .style("pointer-events", "none")
    .append("rect")
    .attr("width", width)
    .attr("height", height)


var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on("brush end", brushed);

var area2 = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x2(d.x); })
    .y0(height2)
    .y1(function(d) { return y2(d.y); });

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

d3.tsv("http://localhost:8000/weatherData/KOAK/KOAK-2016-complete.tsv", function(d) {
    obj = {};
    obj.x = parseDate(d["Time (PST)"]);
    obj.y = +d["Temp."].replace(/[^\d.-]/g, '');
    return obj;
}, function(error, data) {
    if (error) throw error;

    data.sort((a, b) => a.x - b.x);
    dataObj = data;
    postMessageToWorker(data.slice(), msPerDay / samplesPerDay);
    x.domain(d3.extent(data, function(d) { return d.x; }));
    y.domain([0, d3.max(data, function(d) { return d.y; })]);
    x2.domain(x.domain());
    y2.domain(y.domain());

    // Set the domain of the y axis scale function to go between the min and max of range of y values, adding a pad at the bottom.
    var yMin = d3.min(data, function(d) { return d.y; });
    var yMax = d3.max(data, function(d) { return d.y; });
    y.domain([ yMin - 4, yMax]);

    yGroup.call(yAxis).select(".domain").remove();
    
    var path = focus.append("path")
        .datum(data)
        .attr("id", "path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("clip-path", "url(#mask)")

    var g = path.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis
            .ticks(24)
            .tickSize(-height))

    zoomRect.call(zoom.transform, d3.zoomIdentity);

    context.append("path")
        .datum(data)
        .attr("stroke", "steelblue")
        .attr("fill", "steelblue")
        .attr("class", "area")
        .attr("d", area2);

    context.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

    var brushGroup = context.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, x.range());
    function mousemove() {
        var node = context.select(".brush").node();
        var brushRange = d3.brushSelection(node);
        var transform = d3.zoomTransform(this);
        var xt = transform.rescaleX(x), yt = transform.rescaleY(y);
        var x0 = xt.invert(d3.mouse(this)[0]);
        // console.log(getYForX(x0, path, data));
    }
    zoomRect.on('mousemove', mousemove);

});

function zoomed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore brush-by-zoom
    var t = d3.event.transform;
    var xz = d3.event.transform.rescaleX(x);

    xGroup.call(xAxis.scale(xz));
    focus.select("#path").attr("d", line.x(function(d){return xz(d.x) }));
    xGroup
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(70)")
        .style("text-anchor", "start");
    xGroup
        .selectAll(".tick").attr("stroke", "#777").style("alpha", 0.5).attr("stroke-dasharray", "2,2");

    context.select(".brush").call(brush.move, xz.range().map(t.invertX, t));

    var that = this;
    sampleBrushedRegion(that);

}

function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    var s = d3.event.selection || x2.range();


    var xz = d3.scaleTime().range([0, width]).domain(s.map(x2.invert, x2));
    var brushedRegion = new Array(x2.invert(s[0]), xz.invert(s[1]));

    xGroup.call(xAxis.scale(xz));
        xGroup
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(70)")
        .style("text-anchor", "start");
    xGroup
        .selectAll(".tick").attr("stroke", "#777").style("alpha", 0.5).attr("stroke-dasharray", "2,2");

    focus.select("#path").attr("d", line.x(function(d){return xz(d.x) }));
    zoomRect.call(zoom.transform, d3.zoomIdentity
        .scale(width / (s[1] - s[0]))
        .translate(-s[0], 0));

    var that = this;
    sampleBrushedRegion(that);
}

function sampleBrushedRegion(that) {
    var node = context.select(".brush").node();
    if (!node) return;
    var brushRange = d3.brushSelection(node);
    var transform = d3.zoomTransform(this);
    var xt = transform.rescaleX(x); //, yt = transform.rescaleY(y);

    if (audioBuffer != null) {
        currentBuffer = audioBuffer.slice(0,100);
    }
}

function postMessageToWorker(array, increment) {
    var myWorker = new Worker("worker.js");

    myWorker.onmessage = function(e) {
        audioBuffer = e.data;
    }

    var object = {
        "increment" : increment,
        "array" : array
    }
    // var transfer = JSON.stringify(object);
    myWorker.postMessage(object);
}

function playBuffer() {
    if (currentBuffer != null) {    
        var sound = new WeatherSynth();
        sound.render(currentBuffer);
    }
}
window.onload = function(){

    var button = document.getElementById('trigger');
    button.onclick = playBuffer;
}

