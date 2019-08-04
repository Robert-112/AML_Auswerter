# AML-Decoder

## Beschreibung
Mit dieser Anwendung können AML-Daten ([Advanced Mobile Location)](https://de.wikipedia.org/wiki/Advanced_Mobile_Location) angefragt und verarbeitet werden. Zur Abfrage der Daten sind Zugangsdaten notwendig, die nur an 112-Leitstellen vergeben werden.

**Für die Funktionalität der Software wird keinerlei Haftung übernommen. Auch für Schäden an Systemen Dritter wird keinerlei Haftung übernommen.
Die Nutzung erfolgt ohne Zwang und auf eigene Gefahr.**

## Funktionsumfang
 - Anzeige von AML-Daten für eine Telefonnummer über eine Webseite (Daten + Karte)
 - Automatisches Abrufen der Daten und Weitergabe an andere Systeme

## Installation & Konfiguration
### Vorbereitung & Installation
 1. Installation eines Linux-Servers (Debian etc.)
 2. Schaffen der Netz-Infrastruktur 
 3. Installation von [Node.js](https://nodejs.org/) (Version 8 oder höher)
 4. Installation eines Webservers [Apache](https://httpd.apache.org/) oder Vergleichbar
 5. Download des Quellcodes ([Master](https://github.com/Robert-112/...))
 6. Entpacken der *.zip-Datei
 7. Die Dateien config.php und app_cfg.js anpassen
 7. aml.php und config/config.php in das Verzeichnis des Webservers kopieren
 6. Komandozeile öffnen (Terminal, SSH etc.) und in das Verzeichnis mit der Datei app.js wechseln. Dort folgende Befehle eingeben:
 7. `npm install` (lädt und installiert alle Pakete)
 8. `npm start` (startet die Anwendung)
 9. *optional:* forever-service (https://www.npmjs.com/package/forever-service) installieren und app.js als Service einbinden

## Beispiel der Webseite (PHP-Skript)
(folgt)

## Beispiel des automatischen Abrufs (NodeJS)
```
[2019-08-02 17:00:10.678] [INFO]   UDP Server auf 0.0.0.0:1554 gestartet. PID: 12569
[2019-08-02 17:03:18.169] [LOG]    Notruf auf Kanal 4 erkannt. Rufnummer: 015123456789
[2019-08-02 17:03:19.880] [LOG]    Frage AML-Daten für Rufnummer 015123456789 nach 1 Sekunden ab.
[2019-08-02 17:03:20.433] [LOG]    Keine AML-Daten zur Nummer 015123456789 verfügbar.
[2019-08-02 17:03:24.895] [LOG]    Frage AML-Daten für Rufnummer 015123456789 nach 6 Sekunden ab.
[2019-08-02 17:03:25.303] [LOG]    AML-Daten zur Nummer 015123456789 vorhanden, übermittle Daten an das Einsatzleitsystem.
[2019-08-02 17:03:25.304] [LOG]    Position: 51.733152, 14.337873 (wifi)
[2019-08-02 17:03:25.304] [LOG]    Genauigkeit: 17.489
[2019-08-02 17:03:25.304] [LOG]    Geschwindigkeit: 5 m/s - Richtung: 192 Grad
[2019-08-02 17:03:25.304] [LOG]    ISSI: 1234567
```

# Lizenz
#### [\[Creative Commons Attribution Share Alike 4.0 International\]](https://github.com/Robert-112/Wachalarm-IP-Web/blob/master/LICENSE.md)