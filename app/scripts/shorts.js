$(document).ready(function() {

    console.log('We have liftoff!');

    function showPosition(position) {

        getPrediction(position.coords.latitude, position.coords.longitude)

    }

    function getPrediction(latitude, longitude)
    {
        $.get('http://shorts.today:3000/weather/'+latitude+'/'+longitude+'/', function(data) {
            $('.spinner').remove();
             $('.loading').remove();
            $('#temp-container').html('<h4>'+(data.prob*100).toFixed(1)+'% Accurate. '+data.events+'. '+Math.ceil(data.max_temp) + '&deg;c</h4>');
            if (data.pred_class === 1)
            {
                $('#prediction-container').html('<h1>Shorts are a go!</h1>');
            }
            else
            {
                $('#prediction-container').html('<h1>I wouldn\'t recommend shorts today!</h1>');
            }
            $('#made-container').html('<br /><br /><p>Made by <a href="http://twitter.com/rheotron">@rheotron</a> and <a href="http://twitter.com/thatjpcsguy">@thatjpcsguy</a>. Source code available on <a href="http://github.com/thatjpcsguy/shorts">github</a>.');
        });
    }

    function geoIP()
    {
        console.log('geoip');
        $.get('http://freegeoip.net/json/', function(data)
        {
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
