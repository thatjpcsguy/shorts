<?php

$lat = $_GET['lat'];
$lon = $_GET['lon'];

$res = json_decode(file_get_contents("http://api.openweathermap.org/data/2.5/forecast/daily?lat=".$lat."&lon=".$lon."&mode=json"));

header("Content-type: text/json");

$ret = array('location' => 'Sydney, Australia', 'prediction' => 'Today is one hell of a shorts day!', 'res' => $res);

echo json_encode($ret);

