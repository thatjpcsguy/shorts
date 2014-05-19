var http = require('http');
var sys = require('sys');
var url = require('url');
var request = require("request");

var express = require('express');
var app = express();

var cors = require('cors');
var nn = require('nearest-neighbor');
var fs = require('fs');
var bodyParser = require('body-parser')
var mysql      = require('mysql');


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'shorts'
});

connection.connect();


app.use(bodyParser());


var items = [];

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
        name: "class",
        measure: nn.comparisonMethods.number,
        max: 1
    }
    , {
        name: "humidity",
        measure: nn.comparisonMethods.number,
        max: 100
    }
];

connection.query('SELECT * FROM learning ORDER BY DATE DESC LIMIT 2500', function(err, rows) {
    for (var i = 0; i < rows.length; i++)
    {
        data = {'max_temp': rows[i]['max_temp'], 
                'min_temp': rows[i]['min_temp'], 
                'mean_wind': rows[i]['mean_wind'], 
                'precipitation': rows[i]['precipitation'], 
                'cloud_cover': rows[i]['cloud_cover'], 
                'humidity': rows[i]['mean_humidity'], 
                'class': rows[i]['class']};
        items.push(data);
    }
});


app.set('title', 'Shorts?');
app.get('/weather/:lat/:lon', cors(), function(req, res) {

    request("http://api.openweathermap.org/data/2.5/forecast/daily?cnt=1&units=metric&lat=" + req.params.lat + "&lon=" + req.params.lon + "&mode=json", function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);

            var query = {
                max_temp: data.list[0].temp.max,
                min_temp: data.list[0].temp.min,
                mean_wind: data.list[0].speed,
                cloud_cover: data.list[0].clouds,
                humidity: data.list[0].humidity,
                class: 0.5 // equal distance from 0 and 1
            };

            if (data.list[0].rain) {
                query.precipitation = data.list[0].rain;
            } else {
                query.precipitation = 0;
            }

            var out;
            nn.findMostSimilar(query, items, fields, function(nearestNeighbor, probability) {
                console.log(nearestNeighbor);
                if (nearestNeighbor) {

                    query.pred_class = nearestNeighbor.class;
                    query.city = data.city.name;

                    query.prob = probability;
                     query.events = data.list[0].weather[0].main;

                } else {

                    query.pred_class = 0.5;
                    query.city = data.city.name;

                    query.prob = 0.0;
                     query.events = data.list[0].weather[0].main;
                }

            });


            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(query));
        } else {
            // HANDLE THE ERROR
        }
    });

});



app.post('/savePrediction', function(line, res) {
    connection.query("INSERT INTO learning (date, class, events, city, cloud_cover, mean_wind, max_temp, min_temp, precipitation, mean_humidity) VALUES (NOW(), '"+line.body['pred_class']+"', '"+line.body['events']+"', '"+line.body['city']+"', '"+line.body['cloud_cover']+"', '"+line.body['mean_wind']+"', '"+line.body['max_temp']+"', '"+line.body['min_temp']+"', '"+line.body['precipitation']+"', '"+line.body['humidity']+"')");
    console.log("Good Prediction! :)");
    console.log(line.body);
});

app.post('/discardPrediction', function(line, res) {
    var pred_class = 0;
    if (line.body['pred_class'] == 0)
    {
        pred_class = 1;
    }

    connection.query("INSERT INTO learning (date, class, events, city, cloud_cover, mean_wind, max_temp, min_temp, precipitation, mean_humidity) VALUES (NOW(), '"+pred_class+"', '"+line.body['events']+"', '"+line.body['city']+"', '"+line.body['cloud_cover']+"', '"+line.body['mean_wind']+"', '"+line.body['max_temp']+"', '"+line.body['min_temp']+"', '"+line.body['precipitation']+"', '"+line.body['humidity']+"')");
    console.log("Bad Prediction! :(");
    console.log(line.body);
});


var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
