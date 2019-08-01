var app_cfg = {};

app_cfg = {
	udp_port: 5432, // UDP-Port
	multicast_addr: "192.168.2.1", // Adresse des Multicast-Servers, welcher die Anrufdaten übermittelt
	issi: [{
			"issi": 1234567
		},
		{
			"issi": 1234568
		},
		{
			"issi": 1234569
		},
		{
			"issi": 1234560
		}
	], // Liste der Geärte für Kartendarstellung
	kanalnummer_min: 7, // geringste Kanalnummer auf der ein Anruf eingehen kann, Wert -1
	kanalnummer_max: 25, // maximale Kanalnummer auf der ein Anruf eingehen kann, Wert +1
	vorwahlfilter: "03", // Anrufe mit dieser Vorwahl werden nicht abgefragt
	aml_url: "https://aml-daten.irgendwas.com:1234/hilfe/daten?", // URL der AML-Adresse
	aml_port: 443, // Port des AML-Servers
	aml_auth_user: "benuzter", // Benutzername
	aml_auth_pass: "passwort", //Kennwort
	aml_cert: "/var/notrufdaten-certifikat.pem", // Speicherort des notwendigen Zertifkats
	aml_key: "/var/notrufdaten-ssl.pem", // Speicherort des notwendigen Zertifkats
	aml_passphrase: "1234567890", // SSL-Key
	aml_ca: "/var/ca-certificates.crt", // CA
	proxy: "http://192.168.1.20:80", // Proxy, sofern genutzt
	location_accuracy_max: 51, // max Genauigkeit in Metern
	status_url: "http://192.168.2.50:8081", // Adresse des Web-Servers der Status-Telegramme empfängt
	status_port: 8069, // Port des Web-Servers der Status-Telegramme empfängt
	status_fms_1: [
		'<fms>',
		'</fms><status>1</status>'
	], // Status 1
	status_fms_2: [
		'<fms>',
		'</fms><status>2</status>'
	], // Status 2
	status_position: [
		'<Position><fsm>',
		'</fms><wgs84_x>',
		'</wgs84_x><wgs84_y>',
		'</wgs84_y></Position>'
	] // GPS-Position
};

module.exports = app_cfg;
