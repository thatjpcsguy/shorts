var http = require('http');
var sys = require('sys');
var url = require('url');
var request = require("request");
var bayes = require('bayes');
var classifier = bayes();

var server = http.createServer(function(req, res) {
    var up = url.parse(req.url, true);
    var query = up.query;
    _classifierLearn(); // Set up the classifier

    if (up.pathname == '/weather') { // Getting weather, delegate to function
        if (query.latitude && query.longitude) {
            getWeather(query.latitude, query.longitude, res);
        } else {
            // HANDLE THE ERROR
        }
    }
});

server.listen(8124, "127.0.0.1");
console.log('Server running at http://127.0.0.1:8124/');

function getWeather(lat, lon, res) {
    request("http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + lat + "&lon=" + lon + "&mode=json", function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            var r = buildWeather(data.list[0]);

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(r));
        } else {
            // HANDLE THE ERROR
        }
    })
}

function buildWeather(data) {
    // console.log('BUILDING WEATHER FROM DATA:');
    // console.log(data);
    var obj = {
        max_temp: _kelvinToCelcius(data.temp.max),
        min_temp: _kelvinToCelcius(data.temp.min),
        humidity: data.humidity,
        precipitation: data.rain,
        wind: data.speed,
        cloud_cover: data.clouds,
        events: data.weather[0].main,
        class: classifier.categorize(_getValuesFromJSON(obj))
    };

    // console.log(obj);
    return obj;
}

function _kelvinToCelcius(temp) {
    return parseInt(temp - 273.15);
}

function _getValuesFromJSON(r) {
    // Get the values as a string
    var values = [];
    for (var key in r) {
        if (r.hasOwnProperty(key)) {
            var val = r[key];
            values.push(val);
        }
    }

    return values.join(',');
}

function _classifierLearn() {
    classifier.learn("27,21,74,0,24,3,", "1")
    classifier.learn("29,22,61,0,23,2,", "1")
    classifier.learn("29,22,54,0,29,1,", "1")
    classifier.learn("25,19,74,1,27,6,Rain", "0")
    classifier.learn("22,18,51,0,27,6,", "1")
    classifier.learn("23,17,59,0,14,5,Rain", "0")
    classifier.learn("27,16,55,0,14,2,", "1")
    classifier.learn("30,19,56,0,21,1,", "1")
    classifier.learn("30,21,61,0,24,2,", "1")
    classifier.learn("23,20,78,0,27,6,Rain", "0")
    classifier.learn("25,20,78,0,19,6,Rain", "0")
    classifier.learn("27,21,74,0,21,6,Rain", "0")
    classifier.learn("29,21,64,0,18,6,Rain", "0")
    classifier.learn("25,21,73,0,14,7,Rain", "0")
    classifier.learn("27,21,82,1,14,8,Rain", "0")
    classifier.learn("24,19,88,4,19,7,Rain", "0")
    classifier.learn("24,18,76,0,24,4,Rain", "0")
    classifier.learn("24,19,72,0,11,5,Rain", "0")
    classifier.learn("29,21,82,19,14,6,Rain", "0")
    classifier.learn("26,20,53,0,16,6,", "1")
    classifier.learn("25,18,45,0,21,1,", "1")
    classifier.learn("24,19,63,0,21,5,Rain", "0")
    classifier.learn("24,19,58,0,23,4,", "1")
    classifier.learn("26,19,62,0,13,3,", "1")
    classifier.learn("29,20,63,0,18,2,", "1")
    classifier.learn("34,21,61,4,18,3,Rain-Thunderstorm", "0")
    classifier.learn("22,19,85,0,24,6,Rain", "0")
    classifier.learn("22,18,74,1,27,6,Rain", "0")
    classifier.learn("23,18,87,2,18,6,Rain", "0")
    classifier.learn("23,18,80,0,19,6,Rain", "0")
    classifier.learn("24,19,76,3,18,5,Rain", "0")
    classifier.learn("26,19,72,0,11,4,Rain", "0")
    classifier.learn("30,18,69,13,13,3,Rain-Thunderstorm", "0")
    classifier.learn("24,19,78,0,24,5,", "1")
    classifier.learn("27,19,68,0,13,4,Rain-Thunderstorm", "0")
    classifier.learn("28,21,66,0,18,3,", "1")
    classifier.learn("27,20,63,0,11,3,Rain", "0")
    classifier.learn("28,22,58,0,16,2,", "1")
    classifier.learn("28,19,59,0,14,2,", "1")
    classifier.learn("28,19,63,28,14,4,Rain", "0")
    classifier.learn("24,18,82,0,26,4,Rain-Thunderstorm", "0")
    classifier.learn("28,18,65,0,14,4,", "1")
    classifier.learn("27,20,66,10,18,4,Rain-Thunderstorm", "0")
    classifier.learn("29,19,52,4,18,2,Rain-Thunderstorm", "0")
    classifier.learn("28,15,40,0,18,1,", "1")
    classifier.learn("29,16,44,0,13,0,", "1")
    classifier.learn("24,18,72,0,18,3,", "1")
    classifier.learn("27,19,65,0,16,3,Rain", "0")
    classifier.learn("27,21,64,0,14,4,Rain-Thunderstorm", "0")
    classifier.learn("30,18,68,1,14,3,Rain-Thunderstorm", "0")
    classifier.learn("29,20,70,0,19,5,", "1")
    classifier.learn("23,17,85,35,29,4,Rain-Thunderstorm", "0")
    classifier.learn("25,17,80,0,13,5,Rain", "0")
    classifier.learn("25,20,85,13,13,6,Rain", "0")
    classifier.learn("23,19,82,5,13,7,Rain", "0")
    classifier.learn("25,18,77,1,10,6,Rain", "0")
    classifier.learn("23,19,75,0,19,6,", "1")
    classifier.learn("25,19,73,2,14,4,Rain-Thunderstorm", "0")
    classifier.learn("24,18,74,0,13,2,", "1")
    classifier.learn("28,17,68,0,13,4,", "1")
    classifier.learn("27,18,73,0,11,1,", "1")
    classifier.learn("28,19,73,0,13,4,Fog", "1")
    classifier.learn("22,19,85,3,26,6,Rain-Thunderstorm", "0")
    classifier.learn("23,18,80,0,18,4,Fog", "1")
    classifier.learn("21,17,81,8,24,6,Rain", "0")
    classifier.learn("22,16,67,2,24,5,Rain", "0")
    classifier.learn("23,17,65,0,11,5,Rain", "0")
    classifier.learn("24,16,64,0,11,5,", "1")
    classifier.learn("22,18,79,2,10,7,Rain", "0")
    classifier.learn("27,19,76,7,16,6,Rain", "0")
    classifier.learn("21,17,74,1,31,5,Rain", "0")
    classifier.learn("21,16,73,2,27,5,Rain", "0")
    classifier.learn("19,14,74,1,24,5,Rain", "0")
    classifier.learn("21,14,76,9,23,5,Rain", "0")
    classifier.learn("21,14,70,0,24,3,Rain", "0")
    classifier.learn("21,13,66,0,19,3,", "1")
    classifier.learn("26,13,54,0,18,1,", "1")
    classifier.learn("19,16,56,0,19,2,", "1")
    classifier.learn("24,12,58,0,13,2,", "1")
    classifier.learn("23,12,49,0,13,1,", "1")
    classifier.learn("25,12,51,0,13,0,", "1")
    classifier.learn("24,13,53,0,13,0,", "1")
    classifier.learn("30,14,52,0,16,1,", "1")
    classifier.learn("22,17,68,5,26,4,Rain", "0")
    classifier.learn("24,14,66,0,11,6,", "1")
    classifier.learn("19,16,78,2,23,5,Rain", "0")
    classifier.learn("22,16,71,0,13,5,Rain", "0")
    classifier.learn("26,14,62,0,16,4,", "1")
    classifier.learn("23,16,57,0,19,3,Rain", "0")
}
