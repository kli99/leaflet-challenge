// Store our USGS earthquake API endpoint for the past 30 days inside queryUrl 
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// creating createColor function to help createStyle for the fillcolor and legend setting outside feature function
function createColor(magnitude) {
    var color = "";
    if (magnitude >= 0 && magnitude < 1) {
        color = "#78fa61";
    } else if (magnitude >= 1 && magnitude < 2) {
        color = "#c5f02b";
    } else if (magnitude >= 2 && magnitude < 3) {
        color = "#f0d62b";
    } else if (magnitude >= 3 && magnitude < 4) {
        color = "#f0ae2b";
    } else if (magnitude >= 4 && magnitude < 5) {
        color = "#e68040";
    } else { color = "#e64635"; }

    return color;
};

// Grabbing our GeoJSON data..
d3.json(url, function(data) {

    console.log(data);

    var data = data.features;
    // Creating a geoJSON layer with the retrieved data
    var earthquakes = L.geoJson(data, {

        pointToLayer: function(feature, latlng) {
            //console.log(latlng);

            return L.circleMarker(latlng);
        },


        // style: function(feature) {
        //     return {
        //         fillColor: "pink",
        //         //createColor(feature.properties.mag),
        //         fillopacity: 1,
        //         stroke: true,
        //         color: "black",
        //         weight: 1,
        //         radius: 500
        //     };
        // },

        // onEachFeature: function(feature, layer) {

        //     layer.bindPopup("<h3>" + feature.properties.place +
        //         "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        // }

    });



    var earthquakeLayer = L.layerGroup(earthquakes);

    // Define streetmap and darkmap layers
    var statelite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        // Light: light,
        // Dark: dark,

        // adding the var into to baseMaps to show
        "Statelite": statelite,
        "Grayscale": grayscale,
        "Outdoors": outdoors
    };

    //var earthquakes = {}
    // Create overlay object to hold our overlay layer
    var overlayMaps = {

        Earthquakes: earthquakeLayer
    };

    var myMap = L.map("map", {

        center: [
            37.09, -95.71
        ],
        zoom: 5,

        layers: [statelite, earthquakeLayer]
    });
    // Create a layer control // Pass in our baseMaps and overlayMaps
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);


});