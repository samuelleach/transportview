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
  disruptions = $.xml2json(xml).Disruptions.Disruption;
  console.log(disruptions);


  // Reform times into ISO8601
  var dateFormat = d3.time.format("%Y-%m-%dT%H:%M:%SZ");
  disruptions.forEach(function(d, i) {
      d.index = i;
      d.startTime = dateFormat.parse(d.startTime);
      d.lastModTime = dateFormat.parse(d.lastModTime);
      // d.remarkTime = dateFormat.parse(d.remarkTime); // Problems with this field
  });  

  // Crossfilter
  // weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
  disruption = crossfilter(disruptions);
  all = disruption.groupAll();
  category = disruption.dimension(function(d) { return d.category; });
  categories = category.group();
  day = disruption.dimension(function(d) { return d.startTime.getDay(); });
  // day = disruption.dimension(function(d) { return weekday[d.startTime.getDay()]; });
  days = day.group();
  // console.log(days.top(Infinity));
  date = disruption.dimension(function(d) { return d.startTime; });
  dates = date.group(d3.time.day);
  hour = disruption.dimension(function(d) { return d.startTime.getHours() + d.startTime.getMinutes() / 60; }),
  hours = hour.group(Math.floor);

  topCategories = categories.top(Infinity);

  markersSel = svg.selectAll("circle");
  markersData = markersSel.data(disruptions);

  updateMarkers();
  redrawMap();

  svg.call(zoom);

  var charts = [

      barChart()
          .dimension(date)
          .group(dates)
          .round(d3.time.day.round)
        .x(d3.time.scale()
          .domain([new Date(2012, 11, 1), new Date(2013, 8, 1)]) // Tuned by hand
          .rangeRound([0, 10 * 90])),
           
      barChart()
          .dimension(hour)
          .group(hours)
        .x(d3.scale.linear()
          .domain([0, 24])
          .rangeRound([0, 10 * 24])),

      barChart()
          .dimension(day)
          .group(days)
        .x(d3.scale.linear()
          .domain([0, 7])
          .rangeRound([0, 10 * 7]))
    ];

  // Given our array of charts, which we assume are in the same order as the
  // .chart elements in the DOM, bind the charts to the DOM and render them.
  // We also listen to the chart's brush events to update the display.
  var chart = d3.selectAll(".chart")
                  .data(charts)
                  .each(function(chart) { chart.on("brush", renderAll).on("brushend", renderAll); });
 
  // Render the total.
  var formatNumber = d3.format(",d");
  d3.selectAll("#total")
      .text(formatNumber(disruption.size()));

  renderAll();

  // Renders the specified chart or list.
  function render(method) {
    d3.select(this).call(method);
  }

  // Whenever the brush moves, re-rendering everything.
  function renderAll() {
    chart.each(render);
    updateMarkers();
    redrawMap();
    // list.each(render);
    d3.select("#active").text(formatNumber(all.value()));
  }

  window.filter = function(filters) {
    filters.forEach(function(d, i) { charts[i].filter(d); });
    renderAll();
  };

  window.reset = function(i) {
    charts[i].filter(null);
    renderAll();
  };

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
      category.filter(categoryKey);
      updateMarkers(categoryKey);
      renderAll();
      redrawMap();
  })

  tooltipSel = d3.select('#tooltip');

  // messageboardSel  = messageboard.selectAll("g.category");
  // messageboardData = messageboardSel.data(topCategories);
  // redrawMessageBoard();
});

function updateMarkers() {
    markersData.remove();
    markersData = markersSel
                    .data(category.top(Infinity));

    markers = markersData
                   .enter()
                   .append("circle")
                   .attr("r", 5);

    markers
        .on("mouseover", markerMouseOver)
        .on("mouseout", markerMouseOut)
        .on('mousemove', mouseMoveFunction);
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

function markerMouseOver(d) {
  tooltipSel
      .classed("hidden", false)
      .select("p")
      .text(d.comments)
      .style("opacity", 0.0)
      .transition().duration(500)
      .style("opacity", 1.0);

  var thisMarker = d3.select(this);

  thisMarker
    .transition()
    .attr("r", 10)
    .duration(500);
}

function markerMouseOut() {
  tooltipSel
    .classed("hidden", true);

  var thisMarker = d3.select(this);
  thisMarker
        .transition()
        .attr("r", 5)
        .duration(500);
}

var mouseMoveFunction = function() {
  tooltipSel
    .style("left", (d3.event.pageX + 30) + "px")     
    .style("top", (d3.event.pageY - 30) + "px");  
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
     .attr("cx", function(d) { return projection(lonlat(d))[0]; })
     .attr("cy", function(d) { return projection(lonlat(d))[1]; });

  image.enter().append("image")
      // .attr("xlink:href", function(d) { return "http://" + ["a", "b", "c", "d"][Math.random() * 4 | 0] + ".tiles.mapbox.com/v3/examples.map-vyofok3q/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
      // .attr("xlink:href", function(d) { return "http://" + ["a", "b", "c", "d"][Math.random() * 4 | 0] + ".tile.stamen.com/toner/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
      .attr("xlink:href", function(d) { return "http://a.tile.stamen.com/toner/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
      // .attr("xlink:href", function(d) { return "http://a.tile.cloudmade.com/API KEY HERE/998/256/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
      .attr("width", 1.0)
      .attr("height", 1.0)
      .attr("x", function(d) { return d[0]; })
      .attr("y", function(d) { return d[1]; });

}

function barChart() {
  if (!barChart.id) barChart.id = 0;

  var margin = {top: 10, right: 10, bottom: 20, left: 10},
      x,
      y = d3.scale.linear().range([100, 0]),
      id = barChart.id++,
      axis = d3.svg.axis().orient("bottom"),
      brush = d3.svg.brush(),
      brushDirty,
      dimension,
      group,
      round;

  function chart(div) {
    var width = x.range()[1],
        height = y.range()[0];

    y.domain([0, group.top(1)[0].value]);

    div.each(function() {
      var div = d3.select(this),
          g = div.select("g");

      // Create the skeletal chart.
      if (g.empty()) {
        div.select(".title").append("a")
            .attr("href", "javascript:reset(" + id + ")")
            .attr("class", "reset")
            .text("reset")
            .style("display", "none");

        g = div.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        g.append("clipPath")
            .attr("id", "clip-" + id)
          .append("rect")
            .attr("width", width)
            .attr("height", height);

        g.selectAll(".bar")
            .data(["background", "foreground"])
          .enter().append("path")
            .attr("class", function(d) { return d + " bar"; })
            .datum(group.all());

        g.selectAll(".foreground.bar")
            .attr("clip-path", "url(#clip-" + id + ")");

        g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(axis);

        // Initialize the brush component with pretty resize handles.
        var gBrush = g.append("g").attr("class", "brush").call(brush);
        gBrush.selectAll("rect").attr("height", height);
        gBrush.selectAll(".resize").append("path").attr("d", resizePath);
      }

      // Only redraw the brush if set externally.
      if (brushDirty) {
        brushDirty = false;
        g.selectAll(".brush").call(brush);
        div.select(".title a").style("display", brush.empty() ? "none" : null);
        if (brush.empty()) {
          g.selectAll("#clip-" + id + " rect")
              .attr("x", 0)
              .attr("width", width);
        } else {
          var extent = brush.extent();
          g.selectAll("#clip-" + id + " rect")
              .attr("x", x(extent[0]))
              .attr("width", x(extent[1]) - x(extent[0]));
        }
      }

      g.selectAll(".bar").attr("d", barPath);
    });

    function barPath(groups) {
      var path = [],
          i = -1,
          n = groups.length,
          d;
      while (++i < n) {
        d = groups[i];
        path.push("M", x(d.key), ",", height, "V", y(d.value), "h9V", height);
      }
      return path.join("");
    }

    function resizePath(d) {
      var e = +(d == "e"),
          x = e ? 1 : -1,
          y = height / 3;
      return "M" + (.5 * x) + "," + y
          + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
          + "V" + (2 * y - 6)
          + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y)
          + "Z"
          + "M" + (2.5 * x) + "," + (y + 8)
          + "V" + (2 * y - 8)
          + "M" + (4.5 * x) + "," + (y + 8)
          + "V" + (2 * y - 8);
    }
  }

  brush.on("brushstart.chart", function() {
    var div = d3.select(this.parentNode.parentNode.parentNode);
    div.select(".title a").style("display", null);
  });

  brush.on("brush.chart", function() {
    var g = d3.select(this.parentNode),
        extent = brush.extent();
    if (round) g.select(".brush")
        .call(brush.extent(extent = extent.map(round)))
      .selectAll(".resize")
        .style("display", null);
    g.select("#clip-" + id + " rect")
        .attr("x", x(extent[0]))
        .attr("width", x(extent[1]) - x(extent[0]));
    dimension.filterRange(extent);
  });

  brush.on("brushend.chart", function() {
    if (brush.empty()) {
      var div = d3.select(this.parentNode.parentNode.parentNode);
      div.select(".title a").style("display", "none");
      div.select("#clip-" + id + " rect").attr("x", null).attr("width", "100%");
      dimension.filterAll();
    }
  });

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.x = function(_) {
    if (!arguments.length) return x;
    x = _;
    axis.scale(x);
    brush.x(x);
    return chart;
  };

  chart.y = function(_) {
    if (!arguments.length) return y;
    y = _;
    return chart;
  };

  chart.dimension = function(_) {
    if (!arguments.length) return dimension;
    dimension = _;
    return chart;
  };

  chart.filter = function(_) {
    if (_) {
      brush.extent(_);
      dimension.filterRange(_);
    } else {
      brush.clear();
      dimension.filterAll();
    }
    brushDirty = true;
    return chart;
  };

  chart.group = function(_) {
    if (!arguments.length) return group;
    group = _;
    return chart;
  };

  chart.round = function(_) {
    if (!arguments.length) return round;
    round = _;
    return chart;
  };

  return d3.rebind(chart, brush, "on");
}
