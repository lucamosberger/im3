var map = L.map('map').setView([46.8521, 9.5297], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// ISS Icon
var issIcon = L.icon({
iconUrl: 'images/ISS.png',
iconSize: [64, 64],
iconAnchor: [32, 32],
});

L.marker([46.84822092641077, 9.501919346543152], {icon: issIcon}).addTo(map);

// hier ist das medienhaus
//var marker = L.marker([46.84822092641077, 9.501919346543152]).addTo(map);

// hier ist die beste wg no cap
var circle = L.circle([46.86311270734969, 9.53343707562261], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 100
}).addTo(map);

circle.bindPopup("Krassisti WG no cap").openPopup();

// das coop bermuda dreieck von chur
var polygon = L.polygon([
    [46.84709138840044, 9.508265305732754],
    [46.85245320233996, 9.534896215172118],
    [46.85950903954763, 9.526837349085262]
]).addTo(map);

// aktuelle position als popup
var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent(e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);

// Zoom: https://leafletjs.com/examples/zoom-levels/

// Markers: https://leafletjs.com/examples/custom-icons/ 





