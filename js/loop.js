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
    console.log("Original Date: ", dateString); // Debugging
    let dateParts = dateString.split("-");
    let formattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
    console.log("Formatted Date: ", formattedDate); // Debugging
    return formattedDate;
}

// Funktion, um die Daten von der API abzurufen
function getApiData(url) {
    console.log("Fetching data from API:", url); // Debugging
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
    console.log("Loading default data"); // Debugging
    getApiData('https://abgespacet.lucamosberger.ch/script/default.php'); // Fetch default data on page load
}

// Event Listener für den Such-Button
document.getElementById('search-button').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form submission and page reload

    let selectedDate = document.getElementById('datePicker').value;
    let fromTime = document.getElementById('fromTime').value;
    let toTime = document.getElementById('toTime').value;

    if (!selectedDate) {
        alert('Bitte ein Datum auswählen!');
        return;
    }

    console.log("Selected Date: ", selectedDate); // Debugging
    console.log("From Time: ", fromTime); // Debugging
    console.log("To Time: ", toTime); // Debugging

    // Datepicker-Format ist YYYY-MM-DD, wir müssen es in TT.MM.YYYY umwandeln
    let formattedDate = formatDate(selectedDate);

    // Kombiniere das Datum mit den Zeitangaben
    let startDateTime = `${fromTime} ${formattedDate}`;
    let endDateTime = `${toTime} ${formattedDate}`;

    console.log('Anfang:', startDateTime); // Debugging
    console.log('Ende:', endDateTime); // Debugging

    // API-URL mit dem formatierten Anfangs- und Enddatum (encodeURIComponent für sichere URL)
    const apiUrl = `https://abgespacet.lucamosberger.ch/script/loop.php?start=${encodeURIComponent(startDateTime)}&end=${encodeURIComponent(endDateTime)}`;
    console.log('API-URL:', apiUrl); // Debugging

    getApiData(apiUrl);
});

// Initialisiere alle Funktionen, wenn das DOM geladen ist
document.addEventListener("DOMContentLoaded", function() {
    loadDefaultData(); // Load default data on page load
});



