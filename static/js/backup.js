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

// // helping for radius setting 
//function calcRadius(magnitude) {
//     // return magnitude * 5;
//     return feature.properties.mag * 5;
// };

// create markers features for the map
//function createFeatures(earthquakeData) {

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


var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: createMarker,
    style: createStyle,
    onEachFeature: onEachFeature
});


// Perform a GET request to the query URL
d3.json(url, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
    // L.geoJson(data.features).addTo(myMap);
});




// Sending our earthquakes layer to the createMap function
//createMap(earthquakes);

L.featureGroup(eatherquakes).addTo(myMap);
// var myMap = L.map("map").setView([37.09, -95.71], 5);

// Create base layers
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
    Light: light,
    Dark: dark,

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

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {

    center: [
        37.09, -95.71
    ],
    zoom: 5,

    layers: [statelite, earthquakeLayer]
});

// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);



// // Loop through locations and create city and state markers
// for (var i = 0; i < locations.length; i++) {
//     // Setting the marker radius for the state by passing population into the markerSize function
//     stateMarkers.push(
//         L.circle(locations[i].coordinates, {
//             stroke: false,
//             fillOpacity: 0.75,
//             color: "white",
//             fillColor: "white",
//             radius: markerSize(locations[i].state.population)
//         })
//     );

//     // Setting the marker radius for the city by passing population into the markerSize function
//     cityMarkers.push(
//         L.circle(locations[i].coordinates, {
//             stroke: false,
//             fillOpacity: 0.75,
//             color: "purple",
//             fillColor: "purple",
//             radius: markerSize(locations[i].city.population)
//         })
//     );
// }


// Set up the legend




var legend = L.control({ position: "bottomright" });

legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");

    var limits = [0, 1, 2, 3, 4, 5];
    var colors = ["#78fa61", "#c5f02b", "#f0d62b", "#f0ae2b", "#e68040", "#e64635"];
    var labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];

    // Add min & max
    var legendInfo =
        "<div class=\"labels\">" +
        "</div>";

    div.innerHTML = legendInfo;


    limits.forEach(function(index) {
        limits.push("<li style=\"background-color: " + colors[index] + "\">" + labels[index] + "</li>");
    });


    div.innerHTML = "<ul>" + limits.join("") + "</ul>";

    return div
};

legend.addTo(myMap);

// // Update the legend's innerHTML with the last updated time and station count
// function updateLegend(time, stationCount) {
//     document.querySelector(".legend").innerHTML = [
//         "<p>Updated: " + moment.unix(time).format("h:mm:ss A") + "</p>",
//         "<p class='out-of-order'>Out of Order Stations: " + stationCount.OUT_OF_ORDER + "</p>",
//         "<p class='coming-soon'>Stations Coming Soon: " + stationCount.COMING_SOON + "</p>",
//         "<p class='empty'>Empty Stations: " + stationCount.EMPTY + "</p>",
//         "<p class='low'>Low Stations: " + stationCount.LOW + "</p>",
//         "<p class='healthy'>Healthy Stations: " + stationCount.NORMAL + "</p>"
//     ].join("");
// }


// Adding legend to the map