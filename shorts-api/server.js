var http = require('http');
var sys = require('sys');
var url = require('url');
var request = require("request");
var bayes = require('bayes');
var classifier = bayes();
var express = require('express');
var app = express();
var cors = require('cors');
var nn = require('nearest-neighbor');

var corsOptions = {
  origin: 'http://shorts.today'
};

var items = [
    { max_temp: 27, min_temp: 21, mean_temp: 24, max_humidity: 88, min_humidity: 48, mean_humidity: 74, max_wind: 34, mean_wind: 24, precipitation: 0, cloud_cover: 3, events: '', class: 1},
    { max_temp: 29, min_temp: 22, mean_temp: 26, max_humidity: 83, min_humidity: 33, mean_humidity: 61, max_wind: 40, mean_wind: 23, precipitation: 0, cloud_cover: 2, events: '', class: 1},
    { max_temp: 29, min_temp: 22, mean_temp: 26, max_humidity: 73, min_humidity: 21, mean_humidity: 54, max_wind: 50, mean_wind: 29, precipitation: 0, cloud_cover: 1, events: '', class: 1},
    { max_temp: 25, min_temp: 19, mean_temp: 22, max_humidity: 94, min_humidity: 39, mean_humidity: 74, max_wind: 50, mean_wind: 27, precipitation: 1, cloud_cover: 6, events: 'Rain', class: 0},
    { max_temp: 22, min_temp: 18, mean_temp: 20, max_humidity: 64, min_humidity: 33, mean_humidity: 51, max_wind: 37, mean_wind: 27, precipitation: 0, cloud_cover: 6, events: '', class: 1},
    { max_temp: 23, min_temp: 17, mean_temp: 20, max_humidity: 77, min_humidity: 34, mean_humidity: 59, max_wind: 26, mean_wind: 14, precipitation: 0, cloud_cover: 5, events: 'Rain', class: 0},
    { max_temp: 27, min_temp: 16, mean_temp: 21, max_humidity: 77, min_humidity: 31, mean_humidity: 55, max_wind: 37, mean_wind: 14, precipitation: 0, cloud_cover: 2, events: '', class: 1},
    { max_temp: 30, min_temp: 19, mean_temp: 24, max_humidity: 78, min_humidity: 25, mean_humidity: 56, max_wind: 42, mean_wind: 21, precipitation: 0, cloud_cover: 1, events: '', class: 1},
    { max_temp: 30, min_temp: 21, mean_temp: 26, max_humidity: 88, min_humidity: 30, mean_humidity: 61, max_wind: 42, mean_wind: 24, precipitation: 0, cloud_cover: 2, events: '', class: 1},
    { max_temp: 23, min_temp: 20, mean_temp: 22, max_humidity: 94, min_humidity: 61, mean_humidity: 78, max_wind: 53, mean_wind: 27, precipitation: 0, cloud_cover: 6, events: 'Rain', class: 0},
    { max_temp: 25, min_temp: 20, mean_temp: 22, max_humidity: 94, min_humidity: 60, mean_humidity: 78, max_wind: 27, mean_wind: 19, precipitation: 0, cloud_cover: 6, events: 'Rain', class: 0},
    { max_temp: 27, min_temp: 21, mean_temp: 24, max_humidity: 88, min_humidity: 48, mean_humidity: 74, max_wind: 32, mean_wind: 21, precipitation: 0, cloud_cover: 6, events: 'Rain', class: 0},
    { max_temp: 29, min_temp: 21, mean_temp: 26, max_humidity: 94, min_humidity: 32, mean_humidity: 64, max_wind: 35, mean_wind: 18, precipitation: 0, cloud_cover: 6, events: 'Rain', class: 0},
    { max_temp: 25, min_temp: 21, mean_temp: 23, max_humidity: 83, min_humidity: 57, mean_humidity: 73, max_wind: 24, mean_wind: 14, precipitation: 0, cloud_cover: 7, events: 'Rain', class: 0},
    { max_temp: 27, min_temp: 21, mean_temp: 24, max_humidity: 94, min_humidity: 55, mean_humidity: 82, max_wind: 27, mean_wind: 14, precipitation: 1, cloud_cover: 8, events: 'Rain', class: 0},
    { max_temp: 24, min_temp: 19, mean_temp: 22, max_humidity: 100, min_humidity: 73, mean_humidity: 88, max_wind: 42, mean_wind: 19, precipitation: 4, cloud_cover: 7, events: 'Rain', class: 0},
    { max_temp: 24, min_temp: 18, mean_temp: 21, max_humidity: 94, min_humidity: 40, mean_humidity: 76, max_wind: 35, mean_wind: 24, precipitation: 0, cloud_cover: 4, events: 'Rain', class: 0},
    { max_temp: 24, min_temp: 19, mean_temp: 22, max_humidity: 83, min_humidity: 53, mean_humidity: 72, max_wind: 24, mean_wind: 11, precipitation: 0, cloud_cover: 5, events: 'Rain', class: 0},
    { max_temp: 29, min_temp: 21, mean_temp: 25, max_humidity: 100, min_humidity: 48, mean_humidity: 82, max_wind: 34, mean_wind: 14, precipitation: 19, cloud_cover: 6, events: 'Rain', class: 0},
    { max_temp: 26, min_temp: 20, mean_temp: 23, max_humidity: 94, min_humidity: 21, mean_humidity: 53, max_wind: 29, mean_wind: 16, precipitation: 0, cloud_cover: 6, events: '', class: 1},
    { max_temp: 25, min_temp: 18, mean_temp: 22, max_humidity: 65, min_humidity: 17, mean_humidity: 45, max_wind: 32, mean_wind: 21, precipitation: 0, cloud_cover: 1, events: '', class: 1},
    { max_temp: 24, min_temp: 19, mean_temp: 21, max_humidity: 83, min_humidity: 47, mean_humidity: 63, max_wind: 26, mean_wind: 21, precipitation: 0, cloud_cover: 5, events: 'Rain', class: 0},
    { max_temp: 24, min_temp: 19, mean_temp: 21, max_humidity: 73, min_humidity: 43, mean_humidity: 58, max_wind: 27, mean_wind: 23, precipitation: 0, cloud_cover: 4, events: '', class: 1},
    { max_temp: 26, min_temp: 19, mean_temp: 22, max_humidity: 73, min_humidity: 44, mean_humidity: 62, max_wind: 34, mean_wind: 13, precipitation: 0, cloud_cover: 3, events: '', class: 1},
    { max_temp: 29, min_temp: 20, mean_temp: 24, max_humidity: 88, min_humidity: 31, mean_humidity: 63, max_wind: 39, mean_wind: 18, precipitation: 0, cloud_cover: 2, events: '', class: 1},
    { max_temp: 34, min_temp: 21, mean_temp: 27, max_humidity: 94, min_humidity: 20, mean_humidity: 61, max_wind: 37, mean_wind: 18, precipitation: 4, cloud_cover: 3, events: 'Rain-Thunderstorm', class: 0},
    { max_temp: 22, min_temp: 19, mean_temp: 21, max_humidity: 94, min_humidity: 71, mean_humidity: 85, max_wind: 40, mean_wind: 24, precipitation: 0, cloud_cover: 6, events: 'Rain', class: 0},
    { max_temp: 22, min_temp: 18, mean_temp: 20, max_humidity: 94, min_humidity: 51, mean_humidity: 74, max_wind: 34, mean_wind: 27, precipitation: 1, cloud_cover: 6, events: 'Rain', class: 0},
    { max_temp: 23, min_temp: 18, mean_temp: 21, max_humidity: 94, min_humidity: 57, mean_humidity: 87, max_wind: 35, mean_wind: 18, precipitation: 2, cloud_cover: 6, events: 'Rain', class: 0},
    { max_temp: 23, min_temp: 18, mean_temp: 21, max_humidity: 94, min_humidity: 52, mean_humidity: 80, max_wind: 32, mean_wind: 19, precipitation: 0, cloud_cover: 6, events: 'Rain', class: 0},
    { max_temp: 24, min_temp: 19, mean_temp: 21, max_humidity: 94, min_humidity: 56, mean_humidity: 76, max_wind: 27, mean_wind: 18, precipitation: 3, cloud_cover: 5, events: 'Rain', class: 0},
    { max_temp: 26, min_temp: 19, mean_temp: 22, max_humidity: 94, min_humidity: 42, mean_humidity: 72, max_wind: 21, mean_wind: 11, precipitation: 0, cloud_cover: 4, events: 'Rain', class: 0},
    { max_temp: 30, min_temp: 18, mean_temp: 24, max_humidity: 100, min_humidity: 27, mean_humidity: 69, max_wind: 42, mean_wind: 13, precipitation: 13, cloud_cover: 3, events: 'Rain-Thunderstorm', class: 0},
    { max_temp: 24, min_temp: 19, mean_temp: 22, max_humidity: 88, min_humidity: 60, mean_humidity: 78, max_wind: 47, mean_wind: 24, precipitation: 0, cloud_cover: 5, events: '', class: 1},
    { max_temp: 27, min_temp: 19, mean_temp: 23, max_humidity: 83, min_humidity: 45, mean_humidity: 68, max_wind: 26, mean_wind: 13, precipitation: 0, cloud_cover: 4, events: 'Rain-Thunderstorm', class: 0},
    { max_temp: 28, min_temp: 21, mean_temp: 24, max_humidity: 88, min_humidity: 23, mean_humidity: 66, max_wind: 34, mean_wind: 18, precipitation: 0, cloud_cover: 3, events: '', class: 1},
    { max_temp: 27, min_temp: 20, mean_temp: 23, max_humidity: 88, min_humidity: 33, mean_humidity: 63, max_wind: 27, mean_wind: 11, precipitation: 0, cloud_cover: 3, events: 'Rain', class: 0},
    { max_temp: 28, min_temp: 22, mean_temp: 25, max_humidity: 78, min_humidity: 30, mean_humidity: 58, max_wind: 32, mean_wind: 16, precipitation: 0, cloud_cover: 2, events: '', class: 1},
    { max_temp: 28, min_temp: 19, mean_temp: 24, max_humidity: 83, min_humidity: 30, mean_humidity: 59, max_wind: 34, mean_wind: 14, precipitation: 0, cloud_cover: 2, events: '', class: 1},
    { max_temp: 28, min_temp: 19, mean_temp: 23, max_humidity: 83, min_humidity: 37, mean_humidity: 63, max_wind: 29, mean_wind: 14, precipitation: 28, cloud_cover: 4, events: 'Rain', class: 0},
    { max_temp: 24, min_temp: 18, mean_temp: 21, max_humidity: 100, min_humidity: 59, mean_humidity: 82, max_wind: 42, mean_wind: 26, precipitation: 0, cloud_cover: 4, events: 'Rain-Thunderstorm', class: 0},
    { max_temp: 28, min_temp: 18, mean_temp: 23, max_humidity: 94, min_humidity: 29, mean_humidity: 65, max_wind: 37, mean_wind: 14, precipitation: 0, cloud_cover: 4, events: '', class: 1},
    { max_temp: 27, min_temp: 20, mean_temp: 23, max_humidity: 94, min_humidity: 41, mean_humidity: 66, max_wind: 34, mean_wind: 18, precipitation: 10, cloud_cover: 4, events: 'Rain-Thunderstorm', class: 0},
    { max_temp: 29, min_temp: 19, mean_temp: 24, max_humidity: 83, min_humidity: 19, mean_humidity: 52, max_wind: 39, mean_wind: 18, precipitation: 4, cloud_cover: 2, events: 'Rain-Thunderstorm', class: 0},
    { max_temp: 28, min_temp: 15, mean_temp: 21, max_humidity: 59, min_humidity: 14, mean_humidity: 40, max_wind: 34, mean_wind: 18, precipitation: 0, cloud_cover: 1, events: '', class: 1},
    { max_temp: 29, min_temp: 16, mean_temp: 22, max_humidity: 72, min_humidity: 16, mean_humidity: 44, max_wind: 27, mean_wind: 13, precipitation: 0, cloud_cover: 0, events: '', class: 1},
    { max_temp: 24, min_temp: 18, mean_temp: 21, max_humidity: 88, min_humidity: 43, mean_humidity: 72, max_wind: 39, mean_wind: 18, precipitation: 0, cloud_cover: 3, events: '', class: 1},
    { max_temp: 27, min_temp: 19, mean_temp: 23, max_humidity: 83, min_humidity: 40, mean_humidity: 65, max_wind: 32, mean_wind: 16, precipitation: 0, cloud_cover: 3, events: 'Rain', class: 0},
    { max_temp: 27, min_temp: 21, mean_temp: 24, max_humidity: 88, min_humidity: 36, mean_humidity: 64, max_wind: 32, mean_wind: 14, precipitation: 0, cloud_cover: 4, events: 'Rain-Thunderstorm', class: 0},
    { max_temp: 30, min_temp: 18, mean_temp: 24, max_humidity: 88, min_humidity: 33, mean_humidity: 68, max_wind: 32, mean_wind: 14, precipitation: 1, cloud_cover: 3, events: 'Rain-Thunderstorm', class: 0},
    { max_temp: 29, min_temp: 20, mean_temp: 24, max_humidity: 88, min_humidity: 44, mean_humidity: 70, max_wind: 27, mean_wind: 19, precipitation: 0, cloud_cover: 5, events: '', class: 1},
    { max_temp: 23, min_temp: 17, mean_temp: 20, max_humidity: 94, min_humidity: 62, mean_humidity: 85, max_wind: 58, mean_wind: 29, precipitation: 35, cloud_cover: 4, events: 'Rain-Thunderstorm', class: 0},
    { max_temp: 25, min_temp: 17, mean_temp: 21, max_humidity: 94, min_humidity: 55, mean_humidity: 80, max_wind: 24, mean_wind: 13, precipitation: 0, cloud_cover: 5, events: 'Rain', class: 0},
    { max_temp: 25, min_temp: 20, mean_temp: 22, max_humidity: 94, min_humidity: 65, mean_humidity: 85, max_wind: 39, mean_wind: 13, precipitation: 13, cloud_cover: 6, events: 'Rain', class: 0},
    { max_temp: 23, min_temp: 19, mean_temp: 21, max_humidity: 94, min_humidity: 59, mean_humidity: 82, max_wind: 35, mean_wind: 13, precipitation: 5, cloud_cover: 7, events: 'Rain', class: 0},
    { max_temp: 25, min_temp: 18, mean_temp: 21, max_humidity: 94, min_humidity: 53, mean_humidity: 77, max_wind: 16, mean_wind: 10, precipitation: 1, cloud_cover: 6, events: 'Rain', class: 0},
    { max_temp: 23, min_temp: 19, mean_temp: 21, max_humidity: 89, min_humidity: 60, mean_humidity: 75, max_wind: 35, mean_wind: 19, precipitation: 0, cloud_cover: 6, events: '', class: 1},
    { max_temp: 25, min_temp: 19, mean_temp: 22, max_humidity: 94, min_humidity: 50, mean_humidity: 73, max_wind: 27, mean_wind: 14, precipitation: 2, cloud_cover: 4, events: 'Rain-Thunderstorm', class: 0},
    { max_temp: 24, min_temp: 18, mean_temp: 21, max_humidity: 94, min_humidity: 49, mean_humidity: 74, max_wind: 19, mean_wind: 13, precipitation: 0, cloud_cover: 2, events: '', class: 1},
    { max_temp: 28, min_temp: 17, mean_temp: 22, max_humidity: 88, min_humidity: 34, mean_humidity: 68, max_wind: 32, mean_wind: 13, precipitation: 0, cloud_cover: 4, events: '', class: 1},
    { max_temp: 27, min_temp: 18, mean_temp: 22, max_humidity: 88, min_humidity: 44, mean_humidity: 73, max_wind: 26, mean_wind: 11, precipitation: 0, cloud_cover: 1, events: '', class: 1},
    { max_temp: 28, min_temp: 19, mean_temp: 23, max_humidity: 94, min_humidity: 44, mean_humidity: 73, max_wind: 27, mean_wind: 13, precipitation: 0, cloud_cover: 4, events: 'Fog', class: 1},
    { max_temp: 22, min_temp: 19, mean_temp: 20, max_humidity: 94, min_humidity: 72, mean_humidity: 85, max_wind: 37, mean_wind: 26, precipitation: 3, cloud_cover: 6, events: 'Rain-Thunderstorm', class: 0},
    { max_temp: 23, min_temp: 18, mean_temp: 20, max_humidity: 94, min_humidity: 64, mean_humidity: 80, max_wind: 45, mean_wind: 18, precipitation: 0, cloud_cover: 4, events: 'Fog', class: 1},
    { max_temp: 21, min_temp: 17, mean_temp: 19, max_humidity: 94, min_humidity: 56, mean_humidity: 81, max_wind: 45, mean_wind: 24, precipitation: 8, cloud_cover: 6, events: 'Rain', class: 0},
    { max_temp: 22, min_temp: 16, mean_temp: 19, max_humidity: 88, min_humidity: 39, mean_humidity: 67, max_wind: 35, mean_wind: 24, precipitation: 2, cloud_cover: 5, events: 'Rain', class: 0},
    { max_temp: 23, min_temp: 17, mean_temp: 20, max_humidity: 83, min_humidity: 41, mean_humidity: 65, max_wind: 19, mean_wind: 11, precipitation: 0, cloud_cover: 5, events: 'Rain', class: 0},
    { max_temp: 24, min_temp: 16, mean_temp: 20, max_humidity: 82, min_humidity: 45, mean_humidity: 64, max_wind: 21, mean_wind: 11, precipitation: 0, cloud_cover: 5, events: '', class: 1},
    { max_temp: 22, min_temp: 18, mean_temp: 20, max_humidity: 94, min_humidity: 62, mean_humidity: 79, max_wind: 13, mean_wind: 10, precipitation: 2, cloud_cover: 7, events: 'Rain', class: 0},
    { max_temp: 27, min_temp: 19, mean_temp: 23, max_humidity: 100, min_humidity: 40, mean_humidity: 76, max_wind: 35, mean_wind: 16, precipitation: 7, cloud_cover: 6, events: 'Rain', class: 0},
    { max_temp: 21, min_temp: 17, mean_temp: 19, max_humidity: 88, min_humidity: 59, mean_humidity: 74, max_wind: 52, mean_wind: 31, precipitation: 1, cloud_cover: 5, events: 'Rain', class: 0},
    { max_temp: 21, min_temp: 16, mean_temp: 18, max_humidity: 94, min_humidity: 45, mean_humidity: 73, max_wind: 39, mean_wind: 27, precipitation: 2, cloud_cover: 5, events: 'Rain', class: 0},
    { max_temp: 19, min_temp: 14, mean_temp: 17, max_humidity: 88, min_humidity: 57, mean_humidity: 74, max_wind: 40, mean_wind: 24, precipitation: 1, cloud_cover: 5, events: 'Rain', class: 0},
    { max_temp: 21, min_temp: 14, mean_temp: 17, max_humidity: 100, min_humidity: 39, mean_humidity: 76, max_wind: 39, mean_wind: 23, precipitation: 9, cloud_cover: 5, events: 'Rain', class: 0},
    { max_temp: 21, min_temp: 14, mean_temp: 18, max_humidity: 88, min_humidity: 56, mean_humidity: 70, max_wind: 35, mean_wind: 24, precipitation: 0, cloud_cover: 3, events: 'Rain', class: 0},
    { max_temp: 21, min_temp: 13, mean_temp: 17, max_humidity: 82, min_humidity: 40, mean_humidity: 66, max_wind: 35, mean_wind: 19, precipitation: 0, cloud_cover: 3, events: '', class: 1},
    { max_temp: 26, min_temp: 13, mean_temp: 19, max_humidity: 82, min_humidity: 20, mean_humidity: 54, max_wind: 27, mean_wind: 18, precipitation: 0, cloud_cover: 1, events: '', class: 1},
    { max_temp: 19, min_temp: 16, mean_temp: 18, max_humidity: 77, min_humidity: 35, mean_humidity: 56, max_wind: 32, mean_wind: 19, precipitation: 0, cloud_cover: 2, events: '', class: 1},
    { max_temp: 24, min_temp: 12, mean_temp: 18, max_humidity: 83, min_humidity: 32, mean_humidity: 58, max_wind: 26, mean_wind: 13, precipitation: 0, cloud_cover: 2, events: '', class: 1},
    { max_temp: 23, min_temp: 12, mean_temp: 18, max_humidity: 73, min_humidity: 23, mean_humidity: 49, max_wind: 23, mean_wind: 13, precipitation: 0, cloud_cover: 1, events: '', class: 1},
    { max_temp: 25, min_temp: 12, mean_temp: 19, max_humidity: 77, min_humidity: 20, mean_humidity: 51, max_wind: 19, mean_wind: 13, precipitation: 0, cloud_cover: 0, events: '', class: 1},
    { max_temp: 24, min_temp: 13, mean_temp: 19, max_humidity: 72, min_humidity: 26, mean_humidity: 53, max_wind: 16, mean_wind: 13, precipitation: 0, cloud_cover: 0, events: '', class: 1},
    { max_temp: 30, min_temp: 14, mean_temp: 22, max_humidity: 88, min_humidity: 11, mean_humidity: 52, max_wind: 37, mean_wind: 16, precipitation: 0, cloud_cover: 1, events: '', class: 1},
    { max_temp: 22, min_temp: 17, mean_temp: 19, max_humidity: 94, min_humidity: 47, mean_humidity: 68, max_wind: 34, mean_wind: 26, precipitation: 5, cloud_cover: 4, events: 'Rain', class: 0},
    { max_temp: 24, min_temp: 14, mean_temp: 19, max_humidity: 88, min_humidity: 37, mean_humidity: 66, max_wind: 21, mean_wind: 11, precipitation: 0, cloud_cover: 6, events: '', class: 1},
    { max_temp: 19, min_temp: 16, mean_temp: 17, max_humidity: 94, min_humidity: 50, mean_humidity: 78, max_wind: 34, mean_wind: 23, precipitation: 2, cloud_cover: 5, events: 'Rain', class: 0},
    { max_temp: 22, min_temp: 16, mean_temp: 19, max_humidity: 94, min_humidity: 49, mean_humidity: 71, max_wind: 23, mean_wind: 13, precipitation: 0, cloud_cover: 5, events: 'Rain', class: 0},
    { max_temp: 26, min_temp: 14, mean_temp: 20, max_humidity: 88, min_humidity: 29, mean_humidity: 62, max_wind: 27, mean_wind: 16, precipitation: 0, cloud_cover: 4, events: '', class: 1}
];


var fields = [
  { name: "max_temp", measure: nn.comparisonMethods.number, max: 1000 },
  { name: "min_temp", measure: nn.comparisonMethods.number, max: 1000 },
  { name: "mean_humidity", measure: nn.comparisonMethods.number, max: 1000 },
  { name: "mean_wind", measure: nn.comparisonMethods.number, max: 1000 },
  { name: "precipitation", measure: nn.comparisonMethods.number, max: 1000 },
  { name: "cloud_cover", measure: nn.comparisonMethods.number, max: 1000 },
  { name: "events", measure: nn.comparisonMethods.word },
  { name: "class", measure: nn.comparisonMethods.number, max: 10 },

];


app.set('title', 'Shorts?');
app.get('/weather/:lat/:lon', cors(corsOptions), function(req, res){

    request("http://api.openweathermap.org/data/2.5/forecast/daily?cnt=1&units=metric&lat=" + req.params.lat + "&lon=" + req.params.lon + "&mode=json", function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);

            console.log();

            var query = {   max_temp: data.list[0].temp.max, 
                            min_temp: data.list[0].temp.min, 
                            mean_humidity: data.list[0].humidity,
                            precipitation: data.list[0].rain,
                            mean_wind: data.list[0].speed,
                            cloud_cover: data.list[0].clouds,
                            events: data.list[0].weather[0].main,
			    class: 0
                             };


            nn.findMostSimilar(query, items, fields, function(nearestNeighbor, probability) {
              console.log(query);
              console.log(nearestNeighbor);
              console.log(probability);
//              query.class = nearestNeighbor.class;
            });


            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(query));
        } else {
            // HANDLE THE ERROR
        }
    });

});


var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});




