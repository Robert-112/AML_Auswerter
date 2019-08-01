<?php
    $curl_url = "https://aml-daten.irgendwas.com:1234/hilfe/daten?"; // URL der AML-Adresse
    $curl_proxy = "192.168.1.80:80"; // IP:Port des Proxy-Servers, sofern vorhanden
    $curl_port = 443; // Port des AML-Servers
    $curl_sslcert = "/var/notrufdaten-certifikat.pem"; // Speicherort des notwendigen Zertifkats
    $curl_sslkey = "/var/notrufdaten-ssl.pem"; // Speicherort des notwendigen Zertifkats
    $curl_sslkeypasswd = "1234567890"; // SSL-Key
    $curl_cainfo = "/var/ca-certificates.crt"; // CA
    $curl_userpwd = "benutzer:passwort"; // Benutzer und Passwort für mit : getrennt
    $tile_layer = "http://192.168.1.90/tiles/osm/{z}/{x}/{y}.png"; // Eigener Tile-Server für Kartendarstellung
?>