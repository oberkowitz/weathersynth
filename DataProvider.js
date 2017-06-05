var msPerDay = 86400000 // 24 * 60 * 60 * 1000
var samplesPerDay = 200;

function DataProvider(url, columnNameForX, columnNameForY) {
    this.url = url;
    this.columnNameForY = columnNameForY;
    this.columnNameForX = columnNameForX;
    this.data = null;
    this.audioBufferTimeseries = null;
}

DataProvider.prototype.postMessageToWorker = function(array, increment, success, failure) {
    var worker = new Worker("timeseriesworker.js");

    worker.onmessage = function(e) {
        this.audioBufferTimeseries = e.data;
        if (success) success(this.audioBufferTimeseries);
    }

    worker.onerror = function(e) {
        if (failure) failure(e);
    }

    var workerArgs = {
        "increment" : increment,
        "array" : array
    }
    worker.postMessage(workerArgs);
}

DataProvider.prototype.fetchDataFromSource = function(success, failure) {
    var that = this;
    d3.tsv(this.url, function(d) {
        obj = {};
        obj.x = parseDate(d[that.columnNameForX]);
        obj.y = +d[that.columnNameForY].replace(/[^\d.-]/g, '');
        return obj;
    }, function(error, data) {
        if (error) failure(error);
        that.data = data;
        success(that.data);
    });
}

DataProvider.prototype.getTimeseries = function() {
    return new Promise(
        (resolve, reject) => {
            if (this.audioBufferTimeseries != null){
                resolve(this.audioBufferTimeseries);
            } else {
                if (this.data != null) {
                    this.postMessageToWorker(data.slice(), msPerDay / samplesPerDay, resolve, reject);
                } else {
                    var that = this;
                    this.fetchDataFromSource(function(data) {
                        that.postMessageToWorker(data.slice(), msPerDay / samplesPerDay, resolve, reject);
                    }, reject);
                }
            }
        }
    );
};

DataProvider.prototype.getData = function() {
    return new Promise(
        (resolve, reject) => {
            if (this.data != null){
                resolve(this.data);
            } else {
                this.fetchDataFromSource(resolve, reject);
            }
        }
    );
};