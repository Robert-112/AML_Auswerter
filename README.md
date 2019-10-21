# AML-Decoder
Aktualisiert am 21.10.2019

## Beschreibung
Mit dieser Anwendung können AML-Daten ([Advanced Mobile Location)](https://de.wikipedia.org/wiki/Advanced_Mobile_Location) angefragt und verarbeitet werden. Zur Abfrage der Daten sind Zugangsdaten notwendig, die nur an 112-Leitstellen vergeben werden.

**Für die Funktionalität der Software wird keinerlei Haftung übernommen. Auch für Schäden an Systemen Dritter wird keinerlei Haftung übernommen.
Die Nutzung erfolgt ohne Zwang und auf eigene Gefahr.**

## Funktionsumfang
Dieses Repository besteht aus zwei Teilen:

### A) Webseite zur Anzeige der AML-Daten 
Über eine PHP-Webseite können AML-Daten für eine Telefonnummer abgefragt werden. 
Das Ergebnis wird in einer Karte im Browser dargestellt.
![AML über Webseite](https://user-images.githubusercontent.com/19272095/67205616-5ee17a00-f410-11e9-8b5c-5aefdd651def.png)

### B) System zur automatischen Abfrage der AML-Daten
Das automatische Abrufen der Daten erfolgt über eine Auswertung der Notrufnummer beim Klingeln und ist optional (also zusätzliche zur Variante A). Danach erfolgt eine Weitergabe der AML-Positionsdaten (soforn vorhanden) an andere Systeme (z.B. das Kartenmodul des Einsatzleitsystems). Diese Version wurde bisher nur im Land Brandenburg erfolgreich umgesetzt.
![autmoatische Darstellung im Drittsystem](https://user-images.githubusercontent.com/19272095/67206072-3c9c2c00-f411-11e9-8410-b60b3bd8cd32.png)

## Installation & Konfiguration
 1. Installation eines Linux-Servers (Debian, Ubuntu etc.)
 2. Schaffen der Netz-Infrastruktur (IP-Verbindung, ggf. DMZ und Proxy)
 3. Installation der notwendigen Pakete
 - für Variante A (PHP-Webseite):
    Webserver installieren, z.B. [Apache](https://httpd.apache.org/) oder Vergleichbar (z.B. Ngnix), prüfen ob notwendige Pakte zum Ausführen von Curl installiert sind (Curl für das Linux-System und für den Web-Server)
 - für Variante B (automatisches Abfragen, wird nicht zwingend benötigt)
    Installation von [Node.js](https://nodejs.org/) (Version 8 oder höher)
 5. Download des Quellcodes ([Master](https://github.com/Robert-112/AML_Auswerter/archive/master.zip))
 6. Entpacken der *.zip-Datei
 7. Die Konfigurations-Dateien anpassen und Datein verschieben
 - für Variante A (PHP-Webseite):
    config.php anpassen; aml.php und config/config.php in das Verzeichnis des Webservers kopieren
 - für Variante B (automatisches Abfragen)
    app_cfg.js anpassen
 8. Anwendung starten:
  - für Variante A (PHP-Webseite):
    Webserver starten und nach http://ip-das-servers:port/verzeichnis/aml.php navigieren
 - für Variante B (automatisches Abfragen)
    Komandozeile öffnen (Terminal, SSH etc.) und in das Verzeichnis mit der Datei app.js wechseln. Dort folgende Befehle eingeben:
 - `npm install` (lädt und installiert alle Pakete)
 - `npm start` (startet die Anwendung)
 - *optional:* forever-service (https://www.npmjs.com/package/forever-service) installieren und app.js als Service einbinden

## Beispiel-Konfiguration der Webseite (PHP-Script)
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