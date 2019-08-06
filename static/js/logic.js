console.log("running")
// Store our API endpoint inside queryUrl var
var queryUrl3 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";
// Perform a request to retrieve the Geo json from the query URL
d3.json(queryUrl3, function(data) {
  // send the data.features object to the createFeatures function.
  console.log(data)
  createFeatures(data.features);
});

// Function to create features using the earthquake data.
function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlon) {
              return L.circleMarker(latlon, {
        radius: markerSize(feature.properties.mag),
        fillColor: fillColor(feature.properties.mag),
        color: "black",
        weight: 0.6,
        opacity: 0.4,
        fillOpacity: 0.6
      });
      },

      // Create popups
      onEachFeature: function (feature, layer) {
        return layer.bindPopup(`<strong>Place:</strong> ${feature.properties.place}<br><strong>Magnitude:</strong> ${feature.properties.mag}`);
      }
    });

    // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

//creting  map using two layers.
function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
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

  // Create our map, giving it the streetmap and earthquakes layers to display in the browser.
  // Define map center as Trenton, NJ.
  var myMap = L.map("map", {
    center: [
      40.22, -74.75
    ],
    zoom: 3,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


// Set up the legend and the color variance for magnitude from leaflet documentation
var legend = L.control({ position: 'bottomright'});


  legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend');
      var magnitude = [0,1,2,3,4,5];
        var colors = ["#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
  ];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitude.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
    }

    return div;
};
   // Add legend to the map
legend.addTo(myMap);
  };


// Define colors depending on the magnitude of the earthquake
function fillColor(magnitude) {

    switch (true) {
      case magnitude >= 6.0:
        return 'red';
        break;
      
      case magnitude >= 5.0:
        return 'orangered';
        break;

      case magnitude >= 4.0:
        return 'darkorange';
        break;
      
      case magnitude >= 3.0:
        return 'orange';
        break;

      case magnitude >= 2.0:
        return 'gold';
        break;

      case magnitude >= 1.0:
        return 'yellow';
        break;

      default:
        return 'greenyellow';
    };
};


// Reflect the earthquake magnitude
function markerSize(magnitude) {
  return magnitude*3;
}