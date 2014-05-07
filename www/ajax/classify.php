<?php

$location = $_GET['location'];

header("Content-type: text/json");

$ret = array('location' => 'Sydney, Australia', 'prediction' => 'Today is one hell of a shorts day!');

echo json_encode($ret);

