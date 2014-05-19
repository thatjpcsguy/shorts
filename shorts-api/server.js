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
];

connection.query('SELECT * FROM learning', function(err, rows) {
    for (var i = 0; i < rows.length; i++)
    {
        data = {'max_temp': rows[i]['max_temp'], 
                'min_temp': rows[i]['min_temp'], 
                'mean_wind': rows[i]['mean_wind'], 
                'precipitation': rows[i]['precipitation'], 
                'cloud_cover': rows[i]['cloud_cover'], 
                'class': rows[i]['class']};
        items.push(data);

    }
   
    console.log(items[100]);
});


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



app.post('/savePrediction', function(req, res) {
    // console.log('SAVING PREDICTION');
    // console.log(req.body);

    var str = JSON.stringify(req.body) + "\n\n";

    fs.appendFile("saved-predictions.txt", str, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    });
});

app.post('/discardPrediction', function(req, res) {
    // console.log('SAVING PREDICTION');
    // console.log(req.body);

    var str = JSON.stringify(req.body) + "\n\n";

    fs.appendFile("discarded-predictions.txt", str, function(err) {
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
