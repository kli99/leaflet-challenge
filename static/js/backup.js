// Store our USGS earthquake API endpoint for the past 30 days inside queryUrl 
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});


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

// create markers features for the map
function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake


    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    };

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    function createMarker(feature, latlng) {
        return L.circleMarker(latlng);
    };

    // style function with calling straight from API
    function createStyle(feature) {
        var styleInfo = {
            fillColor: createColor(feature.properties.mag),
            fillopacity: 1,
            stroke: true,
            color: "black",
            weight: 1,
            radius: feature.properties.mag * 8
        }

        return styleInfo;
    };

    // geojson the functions into one
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: createMarker,
        style: createStyle,
        onEachFeature: onEachFeature
    });


    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);

};

// var myMap = L.map("map").setView([37.09, -95.71], 5);
function createMap(earthquakes) {


    // Create base layers
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
        "Statelite": statelite,
        "Grayscale": grayscale,
        "Outdoors": outdoors
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {

        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {

        center: [
            37.09, -95.71
        ],
        zoom: 5,

        layers: [statelite, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);


    // set my map
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create("div", "legend");

        var limits = [0, 1, 2, 3, 4, 5];
        var colors = ["#78fa61", "#c5f02b", "#f0d62b", "#f0ae2b", "#e68040", "#e64635"];
        var labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];


        for (var i = 0; i < limits.length; i++) {



            div.innerHTML +=
                limits.push("<i class=\"circle\" style=\"background-color: " + colors + "\">" + labels + "</li>");
        };


        div.innerHTML = labels.join("<br>");

        return div;
    };

    legend.addTo(myMap);

};