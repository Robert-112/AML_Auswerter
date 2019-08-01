// Module laden
const dgram = require('dgram');
const udp_server = dgram.createSocket({
    type: "udp4",
    reuseAddr: true
});
const hex2ascii = require('hex2ascii');
const request = require('request');
const fs = require('fs');
require('console-stamp')(console, {
    pattern: 'yyyy-mm-dd HH:MM:ss.l'
})

// Config-Datei laden
var app_cfg = require('./config/app_cfg.js');

// UDP-Einstellungen
const UDP_PORT = app_cfg.udp_port;
const MULTICAST_ADDR = app_cfg.multicast_addr;

// zu verwendende ISSIs definieren
var usable_issi = app_cfg.issi;

// Aufbau phone_data: Zeitstempel, Rufnummer, AML_JSON, ISSI
var phone_data = {};

// TODO: beim Script-Strat alles zurücksetzen

// Warten auf UDP-Daten
udp_server.on('message', function (message, remote) {
    // empfangene Daten in hex umwandeln
    var data_hex = Buffer.from(message).toString('hex');
    // wenn x30 und x05 im Paket vorhanden, dann ist es eine Anruf-Signalisierung
    if (data_hex.substr(16, 2) == '30' && data_hex.substr(18, 2) == '05') {
        // variablen Teil des Paketes auswerten
        var var_hex = data_hex.substr(144, data_hex.length);
        // Kanalnummer ermitteln
        var kanal_laenge = parseInt('0x' + var_hex.substr(0, 2));
        var kanal_nr = hex2ascii(var_hex.substr(2, kanal_laenge * 2));
        // Kanal-werte entfernen
        var_hex = var_hex.substr(2 + (kanal_laenge * 2), var_hex.length)
        // Telefonnummer ermitteln
        var telefon_laenge = parseInt('0x' + var_hex.substr(0, 2));
        var telefon_nr = hex2ascii(var_hex.substr(2, telefon_laenge * 2));
        // erste 0 von Telefonnummer entfernen
        telefon_nr = telefon_nr.toString().substr(1);
        // Daten nur Speichern wenn eine Kanalnummer im Bereich des Notrufes liegt, und es keine Festnetznummer mit 03 am Anfang ist
        if (app_cfg.kanalnummer_min < kanal_nr && kanal_nr < app_cfg.kanalnummer_max && telefon_nr.substr(0, 2) !== app_cfg.vorwahlfilter) {
            // falls die Telefonnummer schon vorhanden ist (erneuerter Anruf), Zeit dort neu setzen
            if (telefon_nr in phone_data) {
                phone_data[telefon_nr].zeitstempel = Date.now();
            } else {
                // Telefondaten in phone_data mit Zeitstempel schreiben
                var tmp_obj = {};
                tmp_obj.zeitstempel = Date.now();
                phone_data[telefon_nr] = tmp_obj;
                console.log('Notruf auf Kanal ' + kanal_nr + ' erkannt. Rufnummer: ' + telefon_nr);
            };
        };
    };
});

// jede Sekunde neue/alte Daten auswerten
setInterval(function () {
    // phone_data jede Sekunde durchgehen
    const phones = Object.keys(phone_data)
    for (const phone of phones) {
        if (typeof phone_data[phone] !== 'undefined') {
            var time_passed = Math.round(Math.floor((new Date() - phone_data[phone].zeitstempel) / 1000))
            // AML-Daten nach 6, 11, 21 und 35 Sekunden abrufen
            if (
                time_passed == 6 ||
                time_passed == 11 ||
                time_passed == 21 ||
                time_passed == 35
            ) {
                console.log('Frage AML-Daten für Rufnummer ' + phone + ' nach ' + time_passed + ' Sekunden ab.');
                // Datei zur Überwachung schreiben
                fs.writeFile("./aml_gesendet.txt", Date.now(), function (err) {
                    if (err) {
                        return console.error(err);
                    };
                });
                // AML-Anfrage mit Telefonnummer
                var req_options = {
                    url: app_cfg.aml_url + phone,
                    port: app_cfg.aml_port,
                    auth: {
                        user: app_cfg.aml_auth_user,
                        pass: app_cfg.aml_auth_pass
                    },
                    proxy: app_cfg.porxy,
                    cert: fs.readFileSync(app_cfg.aml_cert, 'utf8'),
                    key: fs.readFileSync(app_cfg.aml_key, 'utf8'),
                    passphrase: app_cfg.aml_passphrase,
                    ca: fs.readFileSync(app_cfg.aml_ca, 'utf8'),
                    agentOptions: {
                        secureProtocol: 'TLSv1_2_method'
                    }
                };
                // AML-Antwort auswerten
                request.get(req_options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        // Fehler-Datei löschen, falls vorhanden
                        fs.stat("./aml_fehler.txt", function (err, stats) {
                            if (!err) {
                                fs.unlink('./aml_fehler.txt', function (err) {
                                    if (err) {
                                        return console.log(err);
                                    };
                                });
                            };
                        });
                        // request in JSON umwandeln und in phone_data speichern
                        phone_data[phone].aml = JSON.parse(body);
                        // wenn AML-Status (erste Zeile) OK und Koordinate genauer als 50 Meter, dann weiter
                        if (phone_data[phone].aml[0].status == 'ok' && parseInt(phone_data[phone].aml[0].location_accuracy) < app_cfg.location_accuracy_max) {
                            // Datei zur Überwachung schreiben
                            fs.writeFile("./aml_erhalten.txt", Date.now(), function (err) {
                                if (err) {
                                    return console.log(err);
                                };
                            });
                            // erste verfügbare ISSI wählen und setzen, sofern noch keine ISSI vorhanden
                            if (!("issi" in phone_data[phone])) {
                                var issi_to_use = usable_issi[0].issi;
                                // falls diese ISSI bereits einer Telefonnumer zugeordnet ist, dann bei dieser Nummer die ISSI löschen
                                if (("phone" in usable_issi[0])) {
                                    delete phone_data[usable_issi[0].phone].issi;
                                };
                                // Telefonnummer zur ISSI dazu schreiben, um später zu erkennen ob ISSI schon verwendet wird
                                usable_issi[0].phone = phone;
                                // ISSI in phone_data setzen
                                phone_data[phone].issi = issi_to_use;
                                // ISSI nach hinten schieben damit beim nächsten Durchlauf die nächste ISSI genutzt wird
                                usable_issi.push(usable_issi.shift());
                            };
                            // AML-Daten erhalten
                            console.log('AML-Daten zur Nummer ' + phone + ' vorhanden, übermittle Daten an das Einsatzleitsystem. (' + phone_data[phone].aml[0].location_latitude + ', ' + phone_data[phone].aml[0].location_longitude + ', ' + phone_data[phone].issi + ')');
                            var xml_fms_status = app_cfg.status_fms_1[0] + phone_data[phone].issi + app_cfg.status_fms_1[1];
                            var xml_geo_position = app_cfg.status_position[0]  + phone_data[phone].issi + app_cfg.status_position[1] + phone_data[phone].aml[0].location_longitude + app_cfg.status_position[2] + phone_data[phone].aml[0].location_latitude + app_cfg.status_position[3];
                            // Status 1 für ISSI senden
                            request.post({
                                url: app_cfg.status_url,
                                port: app_cfg.status_port,
                                method: "POST",
                                headers: {
                                    'Content-Type': 'application/xml',
                                },
                                body: xml_fms_status
                            }, function (error, response, body) {
                                if (error || response.statusCode !== 200) {
                                    console.error('XML für Status konnte nicht gesendet werden: ' + error + ' ' + response.statusCode);
                                };
                            });
                            // Position senden
                            request.post({
                                url: app_cfg.status_url,
                                port: app_cfg.status_port,
                                method: "POST",
                                headers: {
                                    'Content-Type': 'application/xml',
                                },
                                body: xml_geo_position
                            }, function (error, response, body) {
                                if (error || response.statusCode !== 200) {
                                    console.error('XML für Position konnte nicht gesendet werden: ' + error + ' ' + response.statusCode);
                                };
                            });
                        } else {
                            if (phone_data[phone].aml[0].status !== 'ok') {
                                console.log('Keine AML-Daten zur Nummer ' + phone + ' verfügbar.');
                            } else {
                                console.info('AML-Daten zur Nummer ' + phone + ' zu ungenau. location_accuracy: ' + phone_data[phone].aml[0].location_accuracy);
                            };
                        };
                    } else {
                        console.error('error:', error);
                        console.error('statusCode:', response && response.statusCode);
                        // falls ein HTML-Fehler bei der Anfrage auftritt, in phone_data dennoch einen aml.status setzen
                        phone_data[phone].aml = [{
                            "status": "error"
                        }];
                        // Datei zur Überwachung schreiben, falls die AML-Anfrage scheitert
                        fs.writeFile("./aml_fehler.txt", response.statusCode, function (err) {
                            if (err) {
                                return console.log(err);
                            };
                        });
                    };
                });
            };
            // nach 40 Sekunden ohne Daten, oder nach 300 Sekunden, alles löschen und Status 2 für ISSI
            if (
                (time_passed > 40 && phone_data[phone].aml[0].status !== 'ok') ||
                time_passed > 300
            ) {
                console.log('Lösche Daten für Telefonnummer ' + phone + ' nach ' + time_passed + ' Sekunden!');
                // temporäre Kopie von phone_data anlegen
                var tmp_obj = phone_data[phone];
                // Daten aus Objekt phone_data löschen
                delete phone_data[phone];
                // Sende Status 2 für ISSI, sofern vorhanden
                if (("issi" in tmp_obj)) {
                    tmp_issi = {};
                    tmp_issi.issi = tmp_obj.issi;
                    //ISSI in Liste wieder nach oben geben
                    usable_issi = usable_issi.filter(item => item.issi !== tmp_obj.issi);
                    usable_issi.unshift(tmp_issi);
                    if (("phone" in usable_issi[0])) {
                        delete usable_issi[0].phone;
                    };
                    // Status senden
                    console.log('Sende Satus 2 für ISSI ' + tmp_obj.issi);
                    var xml_fms_status = app_cfg.status_fms_2[0] + tmp_obj.issi + app_cfg.status_fms_2[1];
                    request.post({
                        url: app_cfg.status_url,
                        port: app_cfg.status_port,
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/xml',
                        },
                        body: xml_fms_status
                    }, function (error, response, body) {
                        if (error || response.statusCode !== 200) {
                            console.error('XML für Status konnte nicht gesendet werden: ' + error + ' ' + response.statusCode);
                        };
                    });
                };
            };
        };
    };
}, 1000);

// UDP-Server für Schnittstelle starten
udp_server.bind(UDP_PORT);
udp_server.on('listening', function () {
    udp_server.addMembership(MULTICAST_ADDR);
    var address = udp_server.address();
    console.info('UDP Server auf ' + address.address + ':' + address.port + ' gestartet. PID: ' + process.pid);
});
