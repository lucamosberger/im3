console.log("Script loaded");

var map = L.map('map').setView([46.8521, 9.5297], 3);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap'
}).addTo(map);

// ISS Icon konfigurieren
var issIcon = L.icon({
    iconUrl: 'images/ISS.png',
    iconSize: [64, 64],
    iconAnchor: [32, 32],
});

// Variable für Marker und Polylinie (wird genutzt, um sie zu löschen)
var currentMarker = null;
var currentPath = null;

// Funktion, um die ISS-Koordinaten auf der Karte zu setzen
function setIssCoordinates(lat, lon) {
    console.log("setIssCoordinates", lat, lon);
    if (currentMarker) {
        map.removeLayer(currentMarker); // Entferne den vorherigen Marker
    }
    currentMarker = L.marker([lat, lon], { icon: issIcon }).addTo(map); // Füge neuen Marker hinzu
}

// Funktion, um den Pfad der ISS auf der Karte zu zeichnen
function drawIssPath(path) {
    if (currentPath) {
        map.removeLayer(currentPath); // Entferne den vorherigen Pfad
    }
    currentPath = L.polyline(path, { color: 'red' }).addTo(map);
    map.fitBounds(currentPath.getBounds()); // Passe die Ansicht an den Pfad an
}

// Popup, wenn die Karte angeklickt wird
var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent(e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);

// Funktion zum Formatieren des Datums von YYYY-MM-DD zu TT.MM.YYYY
function formatDate(dateString) {
    let dateParts = dateString.split("-");
    return `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
}

// Funktion, um die Daten von der API abzurufen
function getApiData(url) {
    fetch(url)
        .then((response) => response.json())
        .then((myData) => {
            console.log(myData, "Daten von der API empfangen");

            // Array für die Positionen
            let posArray = [];
            for (let i = 0; i < myData.length; i++) {
                posArray.push([myData[i].latitude, myData[i].longitude]);
            }

            // Den Pfad der ISS auf der Karte zeichnen
            drawIssPath(posArray);

            // Die aktuelle Position der ISS auf der Karte anzeigen
            setIssCoordinates(myData[0].latitude, myData[0].longitude);
        })
        .catch((error) => {
            console.error('Fehler beim Abrufen der API-Daten:', error);
        });
}

// Funktion für das Laden der Standarddaten beim Seitenladen
function loadDefaultData() {
     getApiData('https://abgespacet.lucamosberger.ch/script/default.php'); // Fetch default data on page load
 }

// Event Listener für den DatePicker
function initDatePicker() {
    document.getElementById('datePicker').addEventListener('change', function () {
        let selectedDate = document.getElementById('datePicker').value;
        console.log('Datum ausgewählt:', selectedDate);
        let formattedDate = formatDate(selectedDate);
        console.log('Formatiertes Datum:', formattedDate);

        // API-URL mit dem formatierten Datum
        const apiUrl = `https://abgespacet.lucamosberger.ch/script/luca_api.php?date=${formattedDate}`;
        console.log('API-URL:', apiUrl);

        getApiData(apiUrl);
    });
}

// Initialisiere alle Funktionen, wenn das DOM geladen ist
document.addEventListener("DOMContentLoaded", function() {
    loadDefaultData(); // Load default data on page load
    initDatePicker(); // Initialize date picker functionality
 });
