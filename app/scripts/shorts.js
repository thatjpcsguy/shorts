String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var dataStore;

var url = 'http://shorts.today:3000/';
if (window.location.host.match(/9000/)) { // If we are running this locally, use localhost for the server
    url = 'http://localhost:3000/'
}

function _celciusToFahrenheit(degrees) {
    return degrees * (9 / 5) + 32;
}

var createCookie = function(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

    function getCookie(c_name) {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(c_name + "=");
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) {
                    c_end = document.cookie.length;
                }
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return "";
    }

    function _setTemp(degreesType) {
        if (degreesType == 'celcius') { // Change to fahrenheit
            $('#temp-container').html('<h4>' + dataStore.events + '. ' + Math.ceil(_celciusToFahrenheit(dataStore.max_temp)) + '&deg;F</h4>');
            return 'fahrenheit';
        } else if (degreesType == 'fahrenheit') { // Change to celcius
            $('#temp-container').html('<h4>' + dataStore.events + '. ' + Math.ceil(dataStore.max_temp) + '&deg;C</h4>');
            return 'celcius';
        }
    }

    function savePrediction() {

        $.post(url + 'savePrediction', dataStore, function(response) {});

        $('#prediction-confirm-container').remove();
        alertify.success("Thanks for making us more accurate! <3");
    }

    function dontSave() {
        $.post(url + 'discardPrediction', dataStore, function(response) {});

        $('#prediction-confirm-container').remove();
        alertify.success("Thanks! We'll try better next time!");
    }


$(document).ready(function() {

    document.body.addEventListener('touchmove', function(event) { // Disable the scrolling
        event.preventDefault();
    }, false);

    $("#changeType").click(function() {
        $('#changeType').html('Change to ' + degreesType.capitalize());
        degreesType = _setTemp(degreesType);
        createCookie('degreesType', degreesType, 1000); // Save to the cookie
    });

    var bg = getRandomInt(0, 2);
    console.log(bg);
    if (bg == 0) {
        $('body').addClass('background-one');
    } else if (bg == 1) {
        $('body').addClass('background-two');
    } else if (bg == 2) {
        $('body').addClass('background-three');
    }

    var _shortsPositive = ['Shorts are a go!', 'Show off those legs!'];
    var _shortsNegative = ['Negative on the shorts...', 'Maybe not today...', 'DON\'T DO IT!'];

    var degreesType = 'celcius';

    var c = getCookie('degreesType'); // Get the saved cookie
    if (c) degreesType = c;

    function showPosition(position) {
        getPrediction(position.coords.latitude, position.coords.longitude)
    }

    function getPrediction(latitude, longitude) {

        $.get(url + 'weather/' + latitude + '/' + longitude + '/', function(data) {
            dataStore = data;

            $('.spinner').remove();
            $('.loading').remove();


            if (degreesType == 'fahrenheit') { // Change to fahrenheit
                $('#temp-container').html('<h4>' + dataStore.events + '. ' + Math.ceil(_celciusToFahrenheit(dataStore.max_temp)) + '&deg;F</h4>');
            } else if (degreesType == 'celcius') { // Change to celcius
                $('#temp-container').html('<h4>' + dataStore.events + '. ' + Math.ceil(dataStore.max_temp) + '&deg;C</h4>');
            }

            if ((data.prob * 100).toFixed(1) < 50) {
                $('#prediction-container').html('<h1> Your call dude...</h1>');
            } else if (data.pred_class === 1) {
                var response = _shortsPositive[getRandomInt(0, _shortsPositive.length - 1)];
                $('#prediction-container').html('<h1>' + response + '</h1>');
            } else {
                var response = _shortsNegative[getRandomInt(0, _shortsNegative.length - 1)];
                $('#prediction-container').html('<h1>' + response + '</h1>');
            }

            if (degreesType == 'celcius') {
                $('#changeType').html('Change to Fahrenheit');
            } else {
                $('#changeType').html('Change to Celcius');
            }
            $('#city-container').html('<h3>' + data.city + '</h3>');
            $('#prediction-confirm-container').removeAttr('style');
            $('#made-container').removeAttr('style');
            ga('send', 'event', 'Prediction', dataStore.events + '. ' + Math.ceil(dataStore.max_temp) + '&deg;C', response, 1);

        });
    }

    function geoIP() {
        console.log('geoip');
        $.get('http://freegeoip.net/json/', function(data) {
            getPrediction(data.latitude, data.longitude);
        });
    }


    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.log('User denied the request for Geolocation.');
                break;
            case error.POSITION_UNAVAILABLE:
                console.log('Location information is unavailable.');
                break;
            case error.TIMEOUT:
                console.log('The request to get user location timed out.');
                break;
            case error.UNKNOWN_ERROR:
                console.log('An unknown error occurred.');
                break;
        }
        geoIP();
    }

    if (navigator.geolocation) {
        console.log('HTML Location Available.');
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        console.log('HTML Location Not Supported.');
        geoIP();
    }

});
