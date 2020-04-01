// Source Website.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {

  // Once we get a response.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function and give each feature a popup.
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
    " (" + feature.properties.mag + " mag)" +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>")
  };

  // Define function for styling circle markers.
  function styleCircles(feature) {
    if (feature.properties.mag < 1) {
      var color = "#FDE725FF"
    }
    else if (feature.properties.mag < 2) {
      var color = "#95D840FF"
    }
    else if (feature.properties.mag < 3) {
      var color = "#29AF7FFF"
    }
    else if (feature.properties.mag < 4) {
      var color = "#287D8EFF"
    }
    else if (feature.properties.mag < 5) {
      var color = "#404788FF"
    }
    else {
      var color = "#481567FF"
    }
    return {
      radius: 4 * feature.properties.mag,
      fillColor: color,
      color: color,
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }
  };

  // Create a GeoJSON layer and run the onEachFeature function.
  var earthquakes = L.geoJSON(earthquakeData, {
    style: styleCircles,
    onEachFeature: onEachFeature,
    pointToLayer: (feature, latlng) => {return L.circleMarker(latlng)}
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-basic",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [38.5, -96],
    zoom: 5,
    layers: [darkmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  /*Legend specific*/
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Magnitudes</h4>";
    div.innerHTML += '<i style="background: #FDE725FF"></i><span>0 - 1</span><br>';
    div.innerHTML += '<i style="background: #95D840FF"></i><span>1 - 2</span><br>';
    div.innerHTML += '<i style="background: #29AF7FFF"></i><span>2 - 3</span><br>';
    div.innerHTML += '<i style="background: #287D8EFF"></i><span>3 - 4</span><br>';
    div.innerHTML += '<i style="background: #404788FF"></i><span>4 - 5</span><br>';
    div.innerHTML += '<i style="background: #481567FF"></i><span>5 +</span><br>';
    return div;
  };
  legend.addTo(myMap);
}
