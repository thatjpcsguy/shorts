$(document).ready(function() {
    function showPosition(position) {
        console.log('lat: ' + position.coords.latitude);
        console.log('lon: ' + position.coords.longitude);

        $.get('http://localhost:3000/weather/'+position.coords.latitude+'/'+position.coords.longitude+'/', function(data) {
            $('.spinner').remove();
            $('#temp-container').html('<h4>' + data.max_temp + ' degrees celcius </h4>');
            if (data.class == 1)
                $('#prediction-container').html('<h1>Shorts are a go!</h1>');
            else
                $('#prediction-container').html('<h1>I Wouldn\'t reccomend shorts today!</h1>');
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
        // fall back to geo ip
    }

    if (navigator.geolocation) {
        console.log('HTML Location Available.');
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        console.log('HTML Location Not Supported.');
    }

});
