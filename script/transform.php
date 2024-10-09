<?php

// Bindet das Skript extract.php für Rohdaten ein
$data = include('extract.php');

// $data = {"message": "success", "timestamp": 1728464611, "iss_position": {"longitude": "157.1696", "latitude": "-25.0592"}}

// transform data into array
$arrayData = json_decode($data, true);

if ($arrayData['message'] !== 'success') {
    die('Error: ' . $arrayData['message']);
}

// Wandelt die Rohdaten in ein assoziatives Array um 
$transformedData = [];
$transformedData['longitude'] = $arrayData['iss_position']['longitude'];
$transformedData['latitude'] = $arrayData['iss_position']['latitude'];
$transformedData['timestamp'] = date('H:i:s d.m.Y', $arrayData['timestamp']);

return json_encode($transformedData);
