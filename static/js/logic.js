var myMap = L.map("map", {
    center: [
        37.09, -95.71
    ],
    zoom: 5,
})

var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryURL).then(function(data) {
    console.log(data.features);
L.geoJSON(data, {
    pointToLayer: function(feature,latlng) {
      var depth = feature.geometry.coordinates[2] 
      var magnitude = feature.properties.mag*5 
      console.log(magnitude) 
      switch (true) {
        case depth > 50:
          color = "#EA2C2C"
          break;
        case depth > 40:
          color =  "#FF4600"
          break;
        case depth > 30:
          color = "#ff8000";
          break;
        case depth > 20:
          color = "#ffbf00"
          break;
        case depth > 10:
          color = "#FFEC00"
        default:
          color = "#83FF00"
      }
      return L.circleMarker(latlng, {
        radius: magnitude, 
        fillColor: color,
        fillOpacity: 0.75,
        color: "black", 
        weight: .5
      });
    },
    onEachFeature: function(feature, layer) {
      var mag = feature.properties.mag
      var depth = feature.geometry.coordinates[2]
      var loc = feature.properties.place
      layer.bindPopup("<b>Magnitude</b><br>" + mag +
      "<br><b>Depth</b><br>" + depth + 
      "<br><b>Location</b><br>" + loc 
      );
    }
  })
.addTo(myMap);
})

var map = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

var legend = L.control({
  position: "bottomright"
});

legend.onAdd = function() {    
  var div = L.DomUtil.create("div", "info legend");
    var grades = [-10, 10, 20, 30, 40, 50];    
    var colors = [      
      "#83FF00",      
      "#FFEC00",      
      "#ffbf00",      
      "#ff8000",      
      "#FF4600",      
      "#EA2C2C"    
    ];
    
    for (var i = 0; i < grades.length; i++) {      
      div.innerHTML += "<i style='background-color: " + colors[i] + "'> &nbsp; &nbsp; </i> "      
      + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");    
    }    
    return div;  
  };
  legend.addTo(myMap);


