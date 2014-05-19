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
var fs = require('fs');

// app.use(express.bodyParser());

// var corsOptions = {
//   origin: 'http://shorts.today'
// };

var items = [{
    max_temp: 27,
    min_temp: 21,
    mean_wind: 24,
    precipitation: 0,
    cloud_cover: 3,
    events: 'Clear',
    class: 1
}, {
    max_temp: 29,
    min_temp: 22,
    mean_wind: 23,
    precipitation: 0,
    cloud_cover: 2,
    events: 'Clear',
    class: 1
}, {
    max_temp: 29,
    min_temp: 22,
    mean_wind: 29,
    precipitation: 0,
    cloud_cover: 1,
    events: 'Clear',
    class: 1
}, {
    max_temp: 25,
    min_temp: 19,
    mean_wind: 27,
    precipitation: 1,
    cloud_cover: 6,
    events: 'Rain',
    class: 1
}, {
    max_temp: 22,
    min_temp: 18,
    mean_wind: 27,
    precipitation: 0,
    cloud_cover: 6,
    events: 'Clear',
    class: 0
}, {
    max_temp: 23,
    min_temp: 17,
    mean_wind: 14,
    precipitation: 0,
    cloud_cover: 5,
    events: 'Rain',
    class: 0
}, {
    max_temp: 27,
    min_temp: 16,
    mean_wind: 14,
    precipitation: 0,
    cloud_cover: 2,
    events: 'Clear',
    class: 1
}, {
    max_temp: 30,
    min_temp: 19,
    mean_wind: 21,
    precipitation: 0,
    cloud_cover: 1,
    events: 'Clear',
    class: 1
}, {
    max_temp: 30,
    min_temp: 21,
    mean_wind: 24,
    precipitation: 0,
    cloud_cover: 2,
    events: 'Clear',
    class: 1
}, {
    max_temp: 23,
    min_temp: 20,
    mean_wind: 27,
    precipitation: 0,
    cloud_cover: 6,
    events: 'Rain',
    class: 0
}, {
    max_temp: 25,
    min_temp: 20,
    mean_wind: 19,
    precipitation: 0,
    cloud_cover: 6,
    events: 'Rain',
    class: 1
}, {
    max_temp: 27,
    min_temp: 21,
    mean_wind: 21,
    precipitation: 0,
    cloud_cover: 6,
    events: 'Rain',
    class: 1
}, {
    max_temp: 29,
    min_temp: 21,
    mean_wind: 18,
    precipitation: 0,
    cloud_cover: 6,
    events: 'Rain',
    class: 1
}, {
    max_temp: 25,
    min_temp: 21,
    mean_wind: 14,
    precipitation: 0,
    cloud_cover: 7,
    events: 'Rain',
    class: 0
}, {
    max_temp: 27,
    min_temp: 21,
    mean_wind: 14,
    precipitation: 1,
    cloud_cover: 8,
    events: 'Rain',
    class: 1
}, {
    max_temp: 24,
    min_temp: 19,
    mean_wind: 19,
    precipitation: 4,
    cloud_cover: 7,
    events: 'Rain',
    class: 0
}, {
    max_temp: 24,
    min_temp: 18,
    mean_wind: 24,
    precipitation: 0,
    cloud_cover: 4,
    events: 'Rain',
    class: 0
}, {
    max_temp: 24,
    min_temp: 19,
    mean_wind: 11,
    precipitation: 0,
    cloud_cover: 5,
    events: 'Rain',
    class: 0
}, {
    max_temp: 29,
    min_temp: 21,
    mean_wind: 14,
    precipitation: 19,
    cloud_cover: 6,
    events: 'Rain',
    class: 1
}, {
    max_temp: 26,
    min_temp: 20,
    mean_wind: 16,
    precipitation: 0,
    cloud_cover: 6,
    events: 'Clear',
    class: 1
}, {
    max_temp: 25,
    min_temp: 18,
    mean_wind: 21,
    precipitation: 0,
    cloud_cover: 1,
    events: 'Clear',
    class: 1
}, {
    max_temp: 24,
    min_temp: 19,
    mean_wind: 21,
    precipitation: 0,
    cloud_cover: 5,
    events: 'Rain',
    class: 0
}, {
    max_temp: 24,
    min_temp: 19,
    mean_wind: 23,
    precipitation: 0,
    cloud_cover: 4,
    events: 'Clear',
    class: 0
}, {
    max_temp: 26,
    min_temp: 19,
    mean_wind: 13,
    precipitation: 0,
    cloud_cover: 3,
    events: 'Clear',
    class: 1
}, {
    max_temp: 29,
    min_temp: 20,
    mean_wind: 18,
    precipitation: 0,
    cloud_cover: 2,
    events: 'Clear',
    class: 1
}, {
    max_temp: 34,
    min_temp: 21,
    mean_wind: 18,
    precipitation: 4,
    cloud_cover: 3,
    events: 'Rain-Thunderstorm',
    class: 1
}, {
    max_temp: 22,
    min_temp: 19,
    mean_wind: 24,
    precipitation: 0,
    cloud_cover: 6,
    events: 'Rain',
    class: 0
}, {
    max_temp: 22,
    min_temp: 18,
    mean_wind: 27,
    precipitation: 1,
    cloud_cover: 6,
    events: 'Rain',
    class: 0
}, {
    max_temp: 23,
    min_temp: 18,
    mean_wind: 18,
    precipitation: 2,
    cloud_cover: 6,
    events: 'Rain',
    class: 0
}, {
    max_temp: 23,
    min_temp: 18,
    mean_wind: 19,
    precipitation: 0,
    cloud_cover: 6,
    events: 'Rain',
    class: 0
}, {
    max_temp: 24,
    min_temp: 19,
    mean_wind: 18,
    precipitation: 3,
    cloud_cover: 5,
    events: 'Rain',
    class: 0
}, {
    max_temp: 26,
    min_temp: 19,
    mean_wind: 11,
    precipitation: 0,
    cloud_cover: 4,
    events: 'Rain',
    class: 0
}, {
    max_temp: 30,
    min_temp: 18,
    mean_wind: 13,
    precipitation: 13,
    cloud_cover: 3,
    events: 'Rain-Thunderstorm',
    class: 1
}, {
    max_temp: 24,
    min_temp: 19,
    mean_wind: 24,
    precipitation: 0,
    cloud_cover: 5,
    events: 'Clear',
    class: 0
}, {
    max_temp: 27,
    min_temp: 19,
    mean_wind: 13,
    precipitation: 0,
    cloud_cover: 4,
    events: 'Rain-Thunderstorm',
    class: 1
}, {
    max_temp: 28,
    min_temp: 21,
    mean_wind: 18,
    precipitation: 0,
    cloud_cover: 3,
    events: 'Clear',
    class: 1
}, {
    max_temp: 27,
    min_temp: 20,
    mean_wind: 11,
    precipitation: 0,
    cloud_cover: 3,
    events: 'Rain',
    class: 1
}, {
    max_temp: 28,
    min_temp: 22,
    mean_wind: 16,
    precipitation: 0,
    cloud_cover: 2,
    events: 'Clear',
    class: 1
}, {
    max_temp: 28,
    min_temp: 19,
    mean_wind: 14,
    precipitation: 0,
    cloud_cover: 2,
    events: 'Clear',
    class: 1
}, {
    max_temp: 28,
    min_temp: 19,
    mean_wind: 14,
    precipitation: 28,
    cloud_cover: 4,
    events: 'Rain',
    class: 1
}, {
    max_temp: 24,
    min_temp: 18,
    mean_wind: 26,
    precipitation: 0,
    cloud_cover: 4,
    events: 'Rain-Thunderstorm',
    class: 0
}, {
    max_temp: 28,
    min_temp: 18,
    mean_wind: 14,
    precipitation: 0,
    cloud_cover: 4,
    events: 'Clear',
    class: 1
}, {
    max_temp: 27,
    min_temp: 20,
    mean_wind: 18,
    precipitation: 10,
    cloud_cover: 4,
    events: 'Rain-Thunderstorm',
    class: 1
}, {
    max_temp: 29,
    min_temp: 19,
    mean_wind: 18,
    precipitation: 4,
    cloud_cover: 2,
    events: 'Rain-Thunderstorm',
    class: 1
}, {
    max_temp: 28,
    min_temp: 15,
    mean_wind: 18,
    precipitation: 0,
    cloud_cover: 1,
    events: 'Clear',
    class: 1
}, {
    max_temp: 29,
    min_temp: 16,
    mean_wind: 13,
    precipitation: 0,
    cloud_cover: 0,
    events: 'Clear',
    class: 1
}, {
    max_temp: 24,
    min_temp: 18,
    mean_wind: 18,
    precipitation: 0,
    cloud_cover: 3,
    events: 'Clear',
    class: 0
}, {
    max_temp: 27,
    min_temp: 19,
    mean_wind: 16,
    precipitation: 0,
    cloud_cover: 3,
    events: 'Rain',
    class: 0
}, {
    max_temp: 27,
    min_temp: 21,
    mean_wind: 14,
    precipitation: 0,
    cloud_cover: 4,
    events: 'Rain-Thunderstorm',
    class: 0
}, {
    max_temp: 30,
    min_temp: 18,
    mean_wind: 14,
    precipitation: 1,
    cloud_cover: 3,
    events: 'Rain-Thunderstorm',
    class: 1
}, {
    max_temp: 29,
    min_temp: 20,
    mean_wind: 19,
    precipitation: 0,
    cloud_cover: 5,
    events: 'Clear',
    class: 1
}, {
    max_temp: 23,
    min_temp: 17,
    mean_wind: 29,
    precipitation: 35,
    cloud_cover: 4,
    events: 'Rain-Thunderstorm',
    class: 0
}, {
    max_temp: 25,
    min_temp: 17,
    mean_wind: 13,
    precipitation: 0,
    cloud_cover: 5,
    events: 'Rain',
    class: 0
}, {
    max_temp: 25,
    min_temp: 20,
    mean_wind: 13,
    precipitation: 13,
    cloud_cover: 6,
    events: 'Rain',
    class: 0
}, {
    max_temp: 23,
    min_temp: 19,
    mean_wind: 13,
    precipitation: 5,
    cloud_cover: 7,
    events: 'Rain',
    class: 0
}, {
    max_temp: 25,
    min_temp: 18,
    mean_wind: 10,
    precipitation: 1,
    cloud_cover: 6,
    events: 'Rain',
    class: 0
}, {
    max_temp: 23,
    min_temp: 19,
    mean_wind: 19,
    precipitation: 0,
    cloud_cover: 6,
    events: 'Clear',
    class: 1
}, {
    max_temp: 25,
    min_temp: 19,
    mean_wind: 14,
    precipitation: 2,
    cloud_cover: 4,
    events: 'Rain-Thunderstorm',
    class: 0
}, {
    max_temp: 24,
    min_temp: 18,
    mean_wind: 13,
    precipitation: 0,
    cloud_cover: 2,
    events: 'Clear',
    class: 0
}, {
    max_temp: 28,
    min_temp: 17,
    mean_wind: 13,
    precipitation: 0,
    cloud_cover: 4,
    events: 'Clear',
    class: 1
}, {
    max_temp: 27,
    min_temp: 18,
    mean_wind: 11,
    precipitation: 0,
    cloud_cover: 1,
    events: 'Clear',
    class: 1
}, {
    max_temp: 28,
    min_temp: 19,
    mean_wind: 13,
    precipitation: 0,
    cloud_cover: 4,
    events: 'Fog',
    class: 1
}, {
    max_temp: 22,
    min_temp: 19,
    mean_wind: 26,
    precipitation: 3,
    cloud_cover: 6,
    events: 'Rain-Thunderstorm',
    class: 0
}, {
    max_temp: 23,
    min_temp: 18,
    mean_wind: 18,
    precipitation: 0,
    cloud_cover: 4,
    events: 'Fog',
    class: 1
}, {
    max_temp: 21,
    min_temp: 17,
    mean_wind: 24,
    precipitation: 8,
    cloud_cover: 6,
    events: 'Rain',
    class: 0
}, {
    max_temp: 22,
    min_temp: 16,
    mean_wind: 24,
    precipitation: 2,
    cloud_cover: 5,
    events: 'Rain',
    class: 0
}, {
    max_temp: 23,
    min_temp: 17,
    mean_wind: 11,
    precipitation: 0,
    cloud_cover: 5,
    events: 'Rain',
    class: 0
}, {
    max_temp: 24,
    min_temp: 16,
    mean_wind: 11,
    precipitation: 0,
    cloud_cover: 5,
    events: 'Clear',
    class: 0
}, {
    max_temp: 22,
    min_temp: 18,
    mean_wind: 10,
    precipitation: 2,
    cloud_cover: 7,
    events: 'Rain',
    class: 0
}, {
    max_temp: 27,
    min_temp: 19,
    mean_wind: 16,
    precipitation: 7,
    cloud_cover: 6,
    events: 'Rain',
    class: 1
}, {
    max_temp: 21,
    min_temp: 17,
    mean_wind: 31,
    precipitation: 1,
    cloud_cover: 5,
    events: 'Rain',
    class: 0
}, {
    max_temp: 21,
    min_temp: 16,
    mean_wind: 27,
    precipitation: 2,
    cloud_cover: 5,
    events: 'Rain',
    class: 0
}, {
    max_temp: 19,
    min_temp: 14,
    mean_wind: 24,
    precipitation: 1,
    cloud_cover: 5,
    events: 'Rain',
    class: 0
}, {
    max_temp: 21,
    min_temp: 14,
    mean_wind: 23,
    precipitation: 9,
    cloud_cover: 5,
    events: 'Rain',
    class: 0
}, {
    max_temp: 21,
    min_temp: 14,
    mean_wind: 24,
    precipitation: 0,
    cloud_cover: 3,
    events: 'Rain',
    class: 0
}, {
    max_temp: 21,
    min_temp: 13,
    mean_wind: 19,
    precipitation: 0,
    cloud_cover: 3,
    events: 'Clear',
    class: 0
}, {
    max_temp: 26,
    min_temp: 13,
    mean_wind: 18,
    precipitation: 0,
    cloud_cover: 1,
    events: 'Clear',
    class: 1
}, {
    max_temp: 19,
    min_temp: 16,
    mean_wind: 19,
    precipitation: 0,
    cloud_cover: 2,
    events: 'Clear',
    class: 0
}, {
    max_temp: 24,
    min_temp: 12,
    mean_wind: 13,
    precipitation: 0,
    cloud_cover: 2,
    events: 'Clear',
    class: 0
}, {
    max_temp: 23,
    min_temp: 12,
    mean_wind: 13,
    precipitation: 0,
    cloud_cover: 1,
    events: 'Clear',
    class: 1
}, {
    max_temp: 25,
    min_temp: 12,
    mean_wind: 13,
    precipitation: 0,
    cloud_cover: 0,
    events: 'Clear',
    class: 1
}, {
    max_temp: 24,
    min_temp: 13,
    mean_wind: 13,
    precipitation: 0,
    cloud_cover: 0,
    events: '',
    class: 1
}, {
    max_temp: 30,
    min_temp: 14,
    mean_wind: 16,
    precipitation: 0,
    cloud_cover: 1,
    events: 'Clear',
    class: 1
}, {
    max_temp: 22,
    min_temp: 17,
    mean_wind: 26,
    precipitation: 5,
    cloud_cover: 4,
    events: 'Rain',
    class: 0
}, {
    max_temp: 24,
    min_temp: 14,
    mean_wind: 11,
    precipitation: 0,
    cloud_cover: 6,
    events: 'Clouds',
    class: 1
}, {
    max_temp: 19,
    min_temp: 16,
    mean_wind: 23,
    precipitation: 2,
    cloud_cover: 5,
    events: 'Rain',
    class: 0
}, {
    max_temp: 22,
    min_temp: 16,
    mean_wind: 13,
    precipitation: 0,
    cloud_cover: 5,
    events: 'Rain',
    class: 0
}, {
    max_temp: 26,
    min_temp: 14,
    mean_wind: 16,
    precipitation: 0,
    cloud_cover: 4,
    events: 'Clouds',
    class: 1
}, {
    max_temp: 36,
    min_temp: 26,
    mean_wind: 16,
    precipitation: 0,
    cloud_cover: 0,
    events: 'Clear',
    class: 1
}, {
    max_temp: 37,
    min_temp: 27,
    mean_wind: 14,
    precipitation: 0,
    cloud_cover: 0,
    events: 'Clear',
    class: 1
}, {
    max_temp: 39,
    min_temp: 28,
    mean_wind: 13,
    precipitation: 0,
    cloud_cover: 0,
    events: 'Clear',
    class: 1
}, {
    max_temp: 36,
    min_temp: 30,
    mean_wind: 13,
    precipitation: 0,
    cloud_cover: 0,
    events: 'Clear',
    class: 1
}, {
    max_temp: 34,
    min_temp: 26,
    mean_wind: 18,
    precipitation: 0,
    cloud_cover: 0,
    events: 'Clear',
    class: 1
}, {
    max_temp: 33,
    min_temp: 26,
    mean_wind: 19,
    precipitation: 0,
    cloud_cover: 0,
    events: 'Clear',
    class: 1
}, {
    max_temp: 18,
    min_temp: 6,
    mean_wind: 18,
    precipitation: 0,
    cloud_cover: 3,
    events: 'Clear',
    class: 0
}, {
    max_temp: 17,
    min_temp: 1,
    mean_wind: 8,
    precipitation: 0,
    cloud_cover: 1,
    events: 'Clear',
    class: 0
}, {
    max_temp: 18,
    min_temp: 4,
    mean_wind: 14,
    precipitation: 0,
    cloud_cover: 4,
    events: 'Clouds',
    class: 0
}, {
    max_temp: 19,
    min_temp: 7,
    mean_wind: 11,
    precipitation: 0,
    cloud_cover: 5,
    events: 'Clouds',
    class: 0
}, {
    max_temp: 24,
    min_temp: 12,
    mean_wind: 19,
    precipitation: 0,
    cloud_cover: 6,
    events: 'Clouds',
    class: 0
}, {
    max_temp: 19,
    min_temp: 12,
    mean_wind: 4,
    precipitation: 0,
    cloud_cover: 6,
    events: 'Clouds',
    class: 0
}];




var fields = [{
        name: "max_temp",
        measure: nn.comparisonMethods.number,
        max: 100
    }, {
        name: "min_temp",
        measure: nn.comparisonMethods.number,
        max: 100
    }, {
        name: "mean_wind",
        measure: nn.comparisonMethods.number,
        max: 1000
    }, {
        name: "precipitation",
        measure: nn.comparisonMethods.number,
        max: 1000
    }, {
        name: "cloud_cover",
        measure: nn.comparisonMethods.number,
        max: 10
    }, {
        name: "events",
        measure: nn.comparisonMethods.word
    }, {
        name: "class",
        measure: nn.comparisonMethods.number,
        max: 1
    },

];


app.set('title', 'Shorts?');
app.get('/weather/:lat/:lon', cors(), function(req, res) {

    request("http://api.openweathermap.org/data/2.5/forecast/daily?cnt=1&units=metric&lat=" + req.params.lat + "&lon=" + req.params.lon + "&mode=json", function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);

            console.log('WEATHER DATA!');
            console.log(data);

            var query = {
                max_temp: data.list[0].temp.max,
                min_temp: data.list[0].temp.min,
                mean_wind: data.list[0].speed,
                cloud_cover: data.list[0].clouds,
                events: data.list[0].weather[0].main,
                class: 0.5 // equal distance from 0 and 1
            };

            if (data.list[0].rain) {
                query.precipitation = data.list[0].rain;
            } else {
                query.precipitation = 0;
            }

            console.log('QUERY!');
            console.log(query);

            nn.findMostSimilar(query, items, fields, function(nearestNeighbor, probability) {
                console.log(nearestNeighbor);
                if (nearestNeighbor) {

                    query.pred_class = nearestNeighbor.class;
                    query.city = data.city.name;

                    query.prob = probability;
                } else {

                    query.pred_class = 0.5;
                    query.city = data.city.name;

                    query.prob = 0.0;
                }

            });


            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(query));
        } else {
            // HANDLE THE ERROR
        }
    });

});



app.post('/savePrediction', function(req, res) {
    console.log('SAVING PREDICTION');
    console.log(req.body);

    fs.appendFile("saved-predictions.txt", JSON.stringify(req.body), function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    });
});


var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
