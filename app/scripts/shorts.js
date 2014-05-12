$(document).ready(function() {
    function showPosition(position) {
        console.log('lat: ' + position.coords.latitude);
        console.log('lon: ' + position.coords.longitude);

        $.get('/ajax/classify.php', {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        }, function(data) {
            console.log(data.res);

            $('#weather-container').html('<h4>' + kelvinToCelcius(data.res.list[0].temp.day) + ' degrees celcius </h4>');
            $('#prediction-container').html('<h1>' + data.prediction + '</h1>');
            $('#location-container').html('<h4>' + data.location + '</h4>');

        });

    }

    function kelvinToCelcius(temp) {
        return parseInt(temp - 273.15);
    }

    function kelvinToFahrenheit(temp) {
        return parseInt(9 / 5 * (temp - 273) + 32);
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
        // fall back to geo ip
    }

    if (navigator.geolocation) {
        console.log('HTML Location Available.');
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        console.log('HTML Location Not Supported.');
    }

});
