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

// var styleId = 998;
// var styleId = 999; // Midnight commander
// // var styleId = 20760; // Grey

// var po = org.polymaps;

// var map = po.map()
//     // .container(document.getElementById("map").appendChild(po.svg("svg")))
//     .container(d3.select("#map").append("svg:svg").node())
//     .add(po.interact())
//     .add(po.hash());


// map.add(po.image()
//     .url(po.url("http://{S}tile.cloudmade.com"
//     + "/API KEY" // http://cloudmade.com/register
//     + "/"+styleId+"/256/{Z}/{X}/{Y}.png")
//     .hosts(["a.", "b.", "c.", ""])));


// map.add(po.compass()
//     .pan("none"));


// Pure d3 example

var width = self.innerWidth, 
    height = 500;

var tile = d3.geo.tile()
    .size([width, height]);

var projection = d3.geo.mercator()
       .translate([width / 2, height / 2])
       .scale((1 << 20) / 2.0 / Math.PI);

var london_coord = [-0.09, 51.505];

var center = projection(london_coord);

var path = d3.geo.path()
    .projection(projection);

var zoom = d3.behavior.zoom()
    .scale(projection.scale() * 2 * Math.PI)
    .scaleExtent([1 << 11, 1 << 25])
    .translate([width - center[0], height - center[1]])
    .on("zoom", redrawMap);

var svg = d3.select("#map").append("svg")
            .attr("height", height);
            // .attr("width", width);

var messageboard = d3.select("#messageboard");


var raster = svg.append("g");
var vector = svg.append("path");

// function lonlat(d) {
//     return [d.lon, d.lat];
// }
// d3.csv("data/cities.csv", function(error, data) {

// function lonlat(d) {
//     return d.geometry.coordinates;
// }
// d3.json("data/tfl_stationlocations.geo.json", function(error, data) {
//   data = data.features;

function lonlat(d) {
    return d.CauseArea.DisplayPoint.Point.coordinatesLL.split(',');
}
d3.xml("data/stream.xml", "application/xml", function(error, xml) {
  data = $.xml2json(xml).Disruptions.Disruption;
  console.log(data);

  // Crossfilter
  disruptions = crossfilter(data);
  disruptionsByCategory = disruptions.dimension(function(d) { return d.category; });
  topCategories = disruptionsByCategory.group().top(Infinity);

  markersSel = svg.selectAll("circle");
  markersData = markersSel.data(data);
  updateMarkers();

  svg.call(zoom);
  redrawMap();

  // Dropdown menu
  var dropdown = messageboard.append('select');
  categoryKeys = _.pluck(topCategories,'key');

  dropdown.selectAll("option")
          .data(categoryKeys)
          .enter()
          .append("option")
          .attr("value", function(d) { return d })
          .text(function(d) { return d });

  dropdown.on("change", function() {
      var categoryKey = categoryKeys[this.selectedIndex];
      updateMarkers(categoryKey);
      redrawMap();
  })

  messageboardSel  = messageboard.selectAll("g.category");
  messageboardData = messageboardSel.data(topCategories);
  redrawMessageBoard();
});

function updateMarkers(categoryKey) {
    disruptionsByCategory.filter(categoryKey);
    selectedDisruptions = disruptionsByCategory.top(Infinity);

    markersData.remove();
    markersData = markersSel
                    .data(selectedDisruptions);

    markers = markersData
                   .enter()
                   .append("circle");
}

function redrawMessageBoard() {
   messageboardData.remove();

   messageboardData = messageboardSel.data(topCategories);

   var messageboardEnter = messageboardData.enter()
                                       .append("g")
                                       .classed("category", true)
                                       .append("text")
                                       .classed("name", true);

   messageboardData.select("text.name")
              .text(function(d) { return d.key+' '+ d.value + '; ' });
}

function redrawMap() {
  var tiles = tile
      .scale(zoom.scale())
      .translate(zoom.translate())();

  projection
      .scale(zoom.scale() / 2 / Math.PI)
      .translate(zoom.translate());

  vector
      .attr("d", path);

  var image = raster
      .attr("transform", "scale(" + tiles.scale + ")translate(" + tiles.translate + ")")
    .selectAll("image")
      .data(tiles, function(d) { return d; });

  image.exit()
      .remove();

  markers
     .attr("r", 5)
     .attr("cx", function(d) {
             return projection(lonlat(d))[0];
     })
     .attr("cy", function(d) {
             return projection(lonlat(d))[1];
     });

  image.enter().append("image")
      // .attr("xlink:href", function(d) { return "http://" + ["a", "b", "c", "d"][Math.random() * 4 | 0] + ".tiles.mapbox.com/v3/examples.map-vyofok3q/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
      // .attr("xlink:href", function(d) { return "http://" + ["a", "b", "c", "d"][Math.random() * 4 | 0] + ".tile.stamen.com/toner/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
      .attr("xlink:href", function(d) { return "http://a.tile.stamen.com/toner/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
      // .attr("xlink:href", function(d) { return "http://a.tile.cloudmade.com/API KEY HERE/998/256/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
      .attr("width", 1)
      .attr("height", 1)
      .attr("x", function(d) { return d[0]; })
      .attr("y", function(d) { return d[1]; });

}