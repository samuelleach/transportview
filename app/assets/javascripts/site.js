// # Place all the behaviors and hooks related to the matching controller here.
// # All this logic will automatically be available in application.js.
// # You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

// var map = L.map('map').setView([51.505, -0.09], 13);

// // Cloudmade tiles - needs API key

// // L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
// //     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
// //     maxZoom: 18,
// //     key: 'PUT API KEY HERE',
// //     // styleId: 997
// //     // styleId: 22677
// //     styleId: 998
// // 	// styleId: 999
// // }).addTo(map);


// // Open street map tiles

// // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
// //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
// //     maxZoom: 18,
// // }).addTo(map);


// // Stamen tiles

// // toner, watercolor, terrain

// // L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
// //     attribution: '<a href="http://content.stamen.com/dotspotting_toner_cartography_available_for_download">Stamen Toner</a>, <a href="http://www.openstreetmap.org/">OpenStreetMap</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
// //     maxZoom: 17
// // }).addTo(map);



// var marker = L.marker([51.5, -0.09]).addTo(map);

// var circle = L.circle([51.508, -0.11], 500, {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5
// }).addTo(map);

// var polygon = L.polygon([
//     [51.509, -0.08],
//     [51.503, -0.06],
//     [51.51, -0.047]
// ]).addTo(map);


// var popup = L.popup();

// function onMapClick(e) {
//     popup
//         .setLatLng(e.latlng)
//         .setContent("You clicked the map at " + e.latlng.toString())
//         .openOn(map);
// }

// map.on('click', onMapClick);


//Polymaps example

var styleId = 998;
var styleId = 999; // Midnight commander
// var styleId = 20760; // Grey

var po = org.polymaps;

var map = po.map()
    // .container(document.getElementById("map").appendChild(po.svg("svg")))
    .container(d3.select("#map").append("svg:svg").node())
    .add(po.interact())
    .add(po.hash());


map.add(po.image()
    .url(po.url("http://{S}tile.cloudmade.com"
    + "/1479bc84eb4447488feb7261292df9f7" // http://cloudmade.com/register
    + "/"+styleId+"/256/{Z}/{X}/{Y}.png")
    .hosts(["a.", "b.", "c.", ""])));


map.add(po.compass()
    .pan("none"));
