// Store API link
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// Perform a GET request to the query URL
d3.json(link, function(data) {
    
    createFeatures(data.features);
  });
  
  function createFeatures(earthquakeData) {
  
    var earthquakes = L.geoJSON(earthquakeData, {
    // Define a function for each feature in feature array

    // Give each feature the popup info on the earthquake
   onEachFeature : function (feature, layer) {
  
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " +  feature.properties.mag + "</p>")
      },     pointToLayer: function (feature, latlng) {

        return new L.circle(latlng,
          {radius: markerSize(feature.properties.mag),
          fillColor: markerColor(feature.properties.mag),
          fillOpacity: 1,
          stroke: false,
      })
    }
    });
// Send earthquakes to createMap

createMap(earthquakes);
}

function createMap(earthquakes) {

    // Satelite and Darkmap layers

    var satmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 20,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 20,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define baseMap object and create layers

  var baseMaps = {
    "Satelite Map": satmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  //Create map and give it layers

  var myMap = L.map("map", {
    center: [30,-100],
    zoom: 3,
    layers: [satmap, earthquakes]
  });

  // Layer control and passing in basemaps and overlay
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}


//Function to create marker size and color based on magnitude of earthquake

function markerSize(mag) {
    return mag * 25000;
  }
  
  function markerColor(mag) {
    if (mag <= 1) {
        return "#ADFF2F";

    } else if (mag <= 2) {
        return "#9ACD32";

    } else if (mag <= 3) {
        return "#FFFF00";

    } else if (mag <= 4) {
        return "#ffd700";

    } else if (mag <= 5) {
        return "#FFA500";

    } else {
        return "#FF0000";

    };
  }
