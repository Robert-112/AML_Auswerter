<?php

/**
 * Calculate a new coordinate based on start, distance and bearing
 *
 * @param $start float - start coordinate as decimal lat/lon pair
 * @param $start2 float - start coordinate as decimal lat/lon pair
 * @param $dist  float - distance in kilometers
 * @param $brng  float - bearing in degrees (compass direction)
 */

function geo_destination($start,$start2,$dist,$brng){
    $lat1 = toRad($start);
    $lon1 = toRad($start2);
    $dist = $dist/6371.01; //Earth's radius in km
    $brng = toRad($brng);
 
    $lat2 = asin( sin($lat1)*cos($dist) +
                  cos($lat1)*sin($dist)*cos($brng) );
    $lon2 = $lon1 + atan2(sin($brng)*sin($dist)*cos($lat1),
                          cos($dist)-sin($lat1)*sin($lat2));
    $lon2 = fmod(($lon2+3*pi()),(2*pi())) - pi();
 
    return array(toDeg($lat2),toDeg($lon2));
}
function toRad($deg){
    return $deg * pi() / 180;
}
function toDeg($rad){
    return $rad * 180 / pi();
}


?>