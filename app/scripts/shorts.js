String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var dataStore;

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


$(document).ready(function() {

    document.body.addEventListener('touchmove', function(event) { // Disable the scrolling
        event.preventDefault();
    }, false);

    $("#changeType").click(function() {
        $('#changeType').html('Change to ' + degreesType.capitalize());
        degreesType = _setTemp(degreesType);
        createCookie('degreesType', degreesType, 1000); // Save to the cookie
    });

    var _shortsPositive = ['Shorts are a go!', 'Show off those legs!'];
    var _shortsNegative = ['Negative on the shorts...', 'Maybe not today...', 'DON\'T DO IT!'];

    var url = 'http://shorts.today:3000/weather/';
    if (window.location.host.match(/9000/)) { // If we are running this locally, use localhost for the server
        url = 'http://localhost:3000/weather/'
    }

    var degreesType = 'celcius';

    var c = getCookie('degreesType');
    if (c) degreesType = c;

    function showPosition(position) {
        getPrediction(position.coords.latitude, position.coords.longitude)
    }

    function getPrediction(latitude, longitude) {

        $.get(url + latitude + '/' + longitude + '/', function(data) {
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
                var response = _shortsPositive[Math.floor((Math.random() * _shortsPositive.length))];
                $('#prediction-container').html('<h1>' + response + '</h1>');
            } else {
                var response = _shortsNegative[Math.floor((Math.random() * _shortsNegative.length))];
                $('#prediction-container').html('<h1>' + response + '</h1>');
            }

            if (degreesType == 'celcius') {
                $('#changeType').html('Change to Fahrenheit');
            } else {
                $('#changeType').html('Change to Celcius');
            }
            $('#city-container').html('<h3>' + data.city + '</h3>');
            $('#made-container').html('<br /><br /><p>Made by <a href="http://twitter.com/rheotron">@rheotron</a> and <a href="http://twitter.com/thatjpcsguy">@thatjpcsguy</a>. Source code available on <a href="http://github.com/thatjpcsguy/shorts">github</a>.');
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
