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

// create markers features for the overlay map
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

    // function createLine(feature, latlng) {
    //     return L.polyline(latlng);
    // }




    // function createNew(feature) {
    //     var stylesInfo = {
    //         stroke: true,
    //         color: "tomato",
    //         weight: 1
    //     }
    //     return stylesInfo;
    // }
    // var faultlines = L.geoJSON(earthquakeData, {
    //     pointToLayer: createLine,
    //     style: createNew,
    //     onEachFeature: onEachFeature
    // });


    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);

};

// create a red polyline from an arrays of LatLng points
var polyline = L.polyline(latlng, { color: 'red' }).addTo(map);

// zoom the map to the polyline
map.fitBounds(polyline.getBounds());

// // create markers features for the map
// function createFeatures(earthquakeData) {

//     // Define a function we want to run once for each feature in the features array
//     // Give each feature a popup describing the place and time of the earthquake


//     function onEachFeature(feature, layer) {
//         layer.bindPopup("<h3>" + feature.properties.place +
//             "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
//     };

//     // Create a GeoJSON layer containing the features array on the earthquakeData object
//     // Run the onEachFeature function once for each piece of data in the array
//     function createMarker(feature, latlng) {
//         return L.circleMarker(latlng);
//     };

//     // style function with calling straight from API
//     function createStyle(feature) {
//         var styleInfo = {
//             fillColor: createColor(feature.properties.mag),
//             fillopacity: 1,
//             stroke: true,
//             color: "black",
//             weight: 1,
//             radius: feature.properties.mag * 8
//         }

//         return styleInfo;
//     };

//     // geojson the functions into one
//     var earthquakes = L.geoJSON(earthquakeData, {
//         pointToLayer: createMarker,
//         style: createStyle,
//         onEachFeature: onEachFeature
//     });


//     // Sending our earthquakes layer to the createMap function
//     createMap(earthquakes);

// };




// var myMap = L.map("map").setView([37.09, -95.71], 5);
function createMap(earthquakes) {


    // Create base layers by creating new style in mapbox studio
    var statellite = L.tileLayer('https://api.mapbox.com/styles/v1/kli99/ckewep1ef0jbb19osoltavxxm/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia2xpOTkiLCJhIjoiY2tlZGxtNDFqMGk5dDM1azlpMHVwbnk2YSJ9.PYjXx4q4ceRv1OjQZCNKKw', {

        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
    });

    var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/kli99/ckewfjx7q03cl19nu2zmtgmmg/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia2xpOTkiLCJhIjoiY2tlZGxtNDFqMGk5dDM1azlpMHVwbnk2YSJ9.PYjXx4q4ceRv1OjQZCNKKw", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        tileSize: 512,
        maxZoom: 18,

    });

    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/kli99/ckewevb490cqx19psxlblpa5b/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia2xpOTkiLCJhIjoiY2tlZGxtNDFqMGk5dDM1azlpMHVwbnk2YSJ9.PYjXx4q4ceRv1OjQZCNKKw", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        tileSize: 512,
        maxZoom: 18,
    });

    //var faultlines = L.layergroup

    // Define a baseMaps object to hold our base layers
    var baseMaps = {

        "Statellite": statellite,
        "Grayscale": grayscale,
        "Outdoors": outdoors
    };



    // // create a red polyline from an arrays of LatLng points
    // var polyline = L.polyline(latlng, { color: 'red' }).addTo(map);

    // // zoom the map to the polyline
    // map.fitBounds(polyline.getBounds());


    // Create overlay object to hold our overlay layer
    var overlayMaps = {

        "Fault Lines": polyline,
        "Earthquakes": earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {

        center: [
            37.09, -95.71
        ],
        zoom: 5,

        layers: [statellite, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false

    }).addTo(myMap);


    // set my map
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");

        var limits = [];
        var colors = ["#78fa61", "#c5f02b", "#f0d62b", "#f0ae2b", "#e68040", "#e64635"];
        var labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];

        //loop labels for each label, index push limits with color and label 
        labels.forEach(function(label, index) {
            limits.push("<li style=\"background-color: " + colors[index] + "\">" + label + "</li>");
        });

        div.innerHTML = "<div>" + limits.join("") + "</div>";


        return div;
    };

    legend.addTo(myMap);

};