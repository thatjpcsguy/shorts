$(document).ready(function(){

    $.get('/ajax/classify.php', {}, function(data){
        $('#prediction-container').html('<h1>'+data['prediction']+'</h1>');
        $('#location-container').html('<h4>'+data['location']+'</h4>');

    });


});
