<?php
    $curl_url = "https://aml-daten.irgendwas.com:1234/hilfe/daten?number="; // URL der AML-Adresse
    $curl_proxy = "192.168.1.80:80"; // IP:Port des Proxy-Servers, sofern vorhanden
    $curl_port = 1234; // Port des AML-Servers
    $curl_sslcert = "/var/notrufdaten-certifikat.pem"; // Speicherort des notwendigen Zertifkats
    $curl_sslkey = "/var/notrufdaten-ssl.pem"; // Speicherort des notwendigen Zertifkats
    $curl_sslkeypasswd = "1234567890"; // SSL-Key
    $curl_cainfo = "/etc/ssl/certs/ca-certificates.crt"; // lokales CA-Zertifikat des Linux-Systems
    $curl_userpwd = "benutzer:passwort"; // Benutzer und Passwort für mit : getrennt
    $tile_layer = "https://a.tile.openstreetmap.de/{z}/{x}/{y}.png"; // Eigener Tile-Server für Kartendarstellung
?>