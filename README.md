# AML-Decoder

## Beschreibung
Mit dieser Anwendung können AML-Daten ([Advanced Mobile Location)](https://de.wikipedia.org/wiki/Advanced_Mobile_Location) angefragt und verarbeitet werden. Zur Abfrage der Daten sind Zugangsdaten notwendig, die nur an 112-Leitstellen vergeben werden.

**Für die Funktionalität der Software wird keinerlei Haftung übernommen. Auch für Schäden an Systemen dritter wird keinerlei Haftung übernommen
Die Nutzung erfolgt ohne Zwang und auf eigene Gefahr.**


## Funktionsumfang
 - Anzeige von AML-Daten für eine Telefonnummer über eine Webseite (Daten + Karte)
 - Automatisches abrufen der Daten und Weitergabe an z.B. ein weiteres System

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


# Lizenz
#### [\[Creative Commons Attribution Share Alike 4.0 International\]](https://github.com/Robert-112/Wachalarm-IP-Web/blob/master/LICENSE.md)