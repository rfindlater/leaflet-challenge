// Creating map object
var myMap = L.map('map').setView([37.8719845, -122.2708368], 13);
  
//   Adding tile layer to the map
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(myMap);

  
//   Store API query variables
var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  
  // Assemble API query URL
var url = baseURL;

// Function that will determine the color of a neighborhood based on the borough it belongs to
function chooseColor(magnitude) {
    switch (true) {
    case magnitude >= 5:
      return "purple";
    case magnitude >= 4:
      return "red";
    case magnitude >= 3:
      return "orange";
    case magnitude >= 2:
      return "green";
    case magnitude >= 1:
      return "yellow";
    default:
      return "black";
    }
  }
// Perform a GET request to the query URL
d3.json(url, function(data) {
    console.log(data)

 // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Style each feature (in this case a earthquake)
    style: function(feature) {
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color our earthquake
        fillColor: chooseColor(feature.properties.mag),
        fillOpacity: 0.5,
        weight: 1.5,
        radius: feature.properties.mag*6
      };
    },
    // direct to leaflet marker with data latlng
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
    },
    // Called on each feature
   onEachFeature: function(feature, layer) {
      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5
          });
        },
        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        click: function(event) {
          myMap.fitBounds(event.target.getBounds());
        }
      });
      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup("<h1>" + feature.properties.mag + "</h1> <hr> <h2>" + feature.properties.mag + "</h2>");

    }
  }).addTo(myMap);
  // Set up the legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0,1, 2, 3, 4, 5],
          colors = ["black", "yellow", "green", "orange", "red", "purple"];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);

});


