<!DOCTYPE html>
<html>

    <head>
        <link rel="stylesheet" href="./resources/leaflet.css" />
        <script src="./resources/leaflet.js"></script>
        <script src="./resources/arrow.js"></script>
    </head>

    <body>
        <?php
            // Config-Datei einbinden
            include('../config/config.php');
            // Hilfsdatei zur Darstellung eines Pfeils laden
            include('./resources/gps-arrow.php');
            // kurz warten
            if ($_GET['sleep']=='1') { 
                sleep($_GET['sleeptime']);
            };
            // Daten sammeln
            $str = $_SERVER['QUERY_STRING'];
            preg_match_all("/([^?= ]+)=([^?= ]+)/", $str, $r); 
            $result = array_combine($r[1], $r[2]);
            // Telefonnummer und Einsatznummer
            $enr_str = $result['enr_str'];
            $telefon = $result['telefon'];
            // Daten abfragen
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $curl_url.$telefon);
            curl_setopt($ch, CURLOPT_PROXY, $curl_proxy);
            curl_setopt($ch, CURLOPT_PORT , $curl_port);
            curl_setopt($ch, CURLOPT_VERBOSE, 0);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_SSLCERT, $curl_sslcert);
            curl_setopt($ch, CURLOPT_SSLKEY, $curl_sslkey);
            curl_setopt($ch, CURLOPT_SSLKEYPASSWD, $curl_sslkeypasswd);
            curl_setopt($ch, CURLOPT_CAINFO, $curl_cainfo);
            curl_setopt($ch, CURLOPT_POST, 0);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 1);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_USERPWD, $curl_userpwd);
            curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
            curl_setopt($ch, CURLOPT_SSLVERSION, CURL_SSLVERSION_TLSv1_2);
            // Daten auswerten
            $error_msg = "Curl-Fehler";
            $response = curl_exec($ch);
            if (curl_errno($ch)) {
                $error_msg = curl_error($ch);
            }
            curl_close($ch);
            // Fehlermeldungen erstellen
            $text="";
            // wenn keine Rückmeldung, Fehler ausgeben
            if ($response == "") { 
                $text  .= "Der Ortungsserver wurde nicht erreicht<br>Fehler: ".$error_msg."<br><br>";  
            };
            // Wenn nicht 'ok', dann Fehler ausgeben
            if ($response == '[{"status":"no aml data"}]') { 
                $text .= "Keine Ortungsdaten für Telefon ".$telefon." vorhanden.<br><br>"; 
            };
            // JSON-Ergebnis docodieren
            $obj = json_decode($response);
            $text .= "Abfrage für Telefonnummer: ".$obj[0]->{'number'}." (Enr ".$enr_str.")<br>";
            $text .= "Zeitpunkt der Ortung: ".$obj[0]->{'location_time'}."<br>";
            $text .= "GPS Koordinate (WGS84DEZ): ".$obj[0]->{'location_longitude'}."/".$obj[0]->{'location_latitude'}."<br>";
            $text .= "Genauigkeit in Meter: ".round($obj[0]->{'location_accuracy'},0)."<br>";
            $text .= "Geschwindigkeit: ".round($obj[0]->{'location_speed'}*3.6,0)." km/h - Richtung ".round($obj[0]->{'location_bearing'},0)." Grad <br>";
            $text .= "Quelle der Ortungsdaten am Endgerät: ".$obj[0]->{'location_source'}."";
            if ($obj[0]->{'location_source'}=='cell') {
                $text .= '<font color=red> Achtung - Es konnte nur der Standort der Funkzelle ermittelt werden.</font>';
            };
            $text .= "<br>";
            // Ergebnis auf der Webseite ausgeben
            echo $text;
            // Protokoll-Dateien erstellen im Ordner ../log
            file_put_contents('../log/'.date("Y.n.j").'.log', (date("d.m.Y H:i:s")." UTC ".$text."\n".$response."\n"), FILE_APPEND);
        ?>
        <!-- Karte anzeigen -->
        <div id="mapid" style="width: 98%; height: 570px;"></div>
        <script>
            // Kartenwerte festlegen
            <?php
                // Zoomstufe in Abhängigkeit der Genauigkeit festlegen
                $zoom = 13;
                if (round($obj[0]->{'location_accuracy'},0)<1000) {$zoom=14;}
                if (round($obj[0]->{'location_accuracy'},0)<500) {$zoom=15;}
                if (round($obj[0]->{'location_accuracy'},0)<100) {$zoom=16;}
               // Koordinaten festlegen
                echo "var mymap = L.map('mapid').setView([".$obj[0]->{'location_latitude'}.", ".$obj[0]->{ 'location_longitude'}."], $zoom);"
            ?>
            // Maps festlegen
            var basemaps = {
                Openstreetmap_Intern: L.tileLayer(<?php echo "'".$tile_layer."'" ?>, {
                    maxZoom: 18,
                    attribution: 'Map data &copy; <a href = "https://www.openstreetmap.org/" > OpenStreetMap < /a> contributors, ' +
                    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                    '',
                    id: 'mapbox.streets'
                }),
                Webatlas: L.tileLayer.wms(
                    'https://isk.geobasis-bb.de/mapproxy/bebb-webatlasde/service/wms?SERVICE=WMS&', {
                        maxZoom: 19,
                        layers: 'WebAtlasDE_BEBB_halbton'
                    }),
                Luftbilder: L.tileLayer.wms(
                    'https://isk.geobasis-bb.de/mapproxy/bebb_dop20c_bb-viewer/service/wms?SERVICE=WMS&', {
                        maxZoom: 19,
                        layers: 'bebb_dop20c'
                    })
            };
            // Basemaps hinzufügen
            L.control.layers(basemaps).addTo(mymap);
            basemaps.Openstreetmap_Intern.addTo(mymap);
            // Pfeil hinzufügen, sofern eine Geschwindigkeit mitgeliefert wird
            <?php
                if (round($obj[0]->{'location_speed'}, 0) > 5) { 
                    $target = geo_destination($obj[0]->{'location_latitude'}, $obj[0]->{'location_longitude'}, 0.03, round($obj[0]->{'location_bearing'}, 3));
                    echo "\nvar arrow = L.polyline([[".$obj[0]->{'location_latitude'}.", ".$obj[0]->{'location_longitude'}."], [".$target[0].", ".$target[1]."]], {color: '#f00'}).addTo(mymap);";
                    echo "    var arrowHead = L.polylineDecorator(arrow, {";
                    echo "        patterns: [";
                    echo "            {offset: '100%', repeat: 0, symbol: L.Symbol.arrowHead({pixelSize: 17, polygon: false, pathOptions: {color: '#f00' , stroke: true}})}";
                    echo "        ]";
                    echo "    }).addTo(mymap);";
                };
                // Kreis hinzufügen
                echo "L.circle([".$obj[0]->{'location_latitude'}.", ".$obj[0]->{'location_longitude'}."], {";
            ?>
            // Farbe festlegen
            color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5, 
                <?php
                    echo "	radius: ".round($obj[0]->{'location_accuracy'}, 0); 
                ?>
            }).addTo(mymap);
        </script>
        <p>Allgemeine Hinweise:<br>
        Zur Zeit können nur neuere Android Smartphones geortet werden. iPhones sollen bis Ende 2019 folgen. Das Smartphone benötigt eine Datenverbindung um die Daten zu übermitteln. GPS wird automatisch beim Notruf aktiviert. Die Ortungsdaten werden automatisch bei der Anwahl des Notrufs 112 übertragen und sind für eine Stunde abrufbar. Wenn das Smartphone keinen Notruf gewählt hat, ist keine Ortung möglich. Man muss keine App installieren.</p>
    </body>

</html>
