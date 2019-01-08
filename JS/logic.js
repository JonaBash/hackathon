// function initMap() {
//     var routends = {lat: 32.056849, lng: 34.772060};
//     var location = {lat: 32.052849, lng: 34.772060};
//     var map = new google.maps.Map(document.getElementById("map"),{
//         zoom: 17,
//         center: location
//     });
//     var marker = new google.maps.Marker({
//         position: location,
//         map: map,
//         title: 'Start'
//     });
//     var marker2 = new google.maps.Marker({
//         position: routends,
//         map: map,
//         title: 'End'
//     });
//     var route1 = new google.maps.DirectionsService({
//         origin: "tel-aviv",
//         destination: "jerusalem",
//         travelMode: 'WALKING',
//         transitOptions: '',
//         drivingOptions: '',
//         unitSystem: 'METRIC',
//         waypoints: [],
//         optimizeWaypoints: false,
//         provideRouteAlternatives: false,
//         avoidFerries: true,
//         avoidHighways: true,
//         avoidTolls: true,
//         region: ''   
//     })
//     var g = route1.route();
//     console.log(g); 
// }


// var route1 = [
//     { lat: 32.052849, lng: 34.772060 },
//     { lat: 32.054707, lng: 34.772186 },
//     { lat: 32.054834, lng: 34.775403 },
//     { lat: 32.049560, lng: 34.773516 },
//     { lat: 32.050578, lng: 34.771521 },
//     { lat: 32.052849, lng: 34.772060 }];

var map, infoWindow;
function initMap() {
    mapData = {
        routes : [],
        markers : [],
        colors: ["blue", "red", "green", "yellow", "pink"]
    }
    
    var latInit = 32.052849
    var lngInit = 34.772060

    //GET ROUTE 1
    var showPath = function () {
        console.log('hey')
        $.ajax({
            type: "GET",
            url: "./data",
            dataType: "json",
            data: {num: [50,51,52]},
            success: function (data) {
                for(var i = 0; i < data.length; i++){
                    data[i] = JSON.parse(data[i])
                }
                centerMap(data[0][0]);
                for(let i = 0; i < data.length; i++){
                    for (let j = 0; j < data[i].length; j++) {
                        data[i][j].lat = parseFloat(data[i][j].lat)
                        data[i][j].lng = parseFloat(data[i][j].lng)
                    }
                    
                    drawMap(data[i], mapData.colors[i]);
                    
                }
            },
            error: function (msg) {
                console.log(msg + "error");
            },
        });
    }
    $('#run').on('click', showPath);
    $('#clean').on('click', clearMap);

    var showRunners = function(){
        $.ajax({
            type: "GET",
            url: "./runners",
            dataType: "json",
            success: function (data) {
                console.log(data)
                console.log(typeof(data[0].latitude))
                for (let i = 0; i < data.length; i++) {
                    var status
                    if(data[i].status == 1) {
                        status = "Ready to run with you !"
                    } else {
                        status = "Runner !"
                    }
                    var marker = new google.maps.Marker({
                        position: { lat: parseFloat(data[i].latitude), lng: parseFloat(data[i].longitude) },
                        map: map,
                        title: status
                    });
                    mapData.markers.push(marker)
                }
            },
            error: function (msg) {
                console.log(msg + "error");
            },
        });
    }
    $('#runners').on('click', showRunners);


    map = new google.maps.Map(document.getElementById('map'), {
        map: map,
        zoom: 16,
        center: { lat: latInit, lng: lngInit },
    });
    infoWindow = new google.maps.InfoWindow;

    var marker = new google.maps.Marker({
        position: '',
        map: map,
        title: 'Start'
    });
    // Instantiate a directions service.
    // directionsService = new google.maps.DirectionsService,
    // directionsDisplay = new google.maps.DirectionsRenderer({
    //     map: map
    // });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('You are here');

            infoWindow.open(map);
            map.setCenter(pos);
            marker = new google.maps.Marker({
                position: pos,
                map: map
            });
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    }
    else {
        handleLocationError(false, infoWindow, map.getCenter());
    }

    function clearMap(){
        for(let i = 0; i < mapData.routes.length; i++){
            mapData.routes[i].setMap(null)
        }
        for(let i = 0; i < mapData.markers.length; i++){
            mapData.markers[i].setMap(null)
        }
    }

    //EMILIE
    function drawMap(e, color) {
        var flightPath = new google.maps.Polyline({
            path: e,
            geodesic: true,
            strokeColor: color,
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        flightPath.setMap(map);
        mapData.routes.push(flightPath);
        var marker = new google.maps.Marker({
            position: e[0],
            map: map,
            title: 'Start'
        });
        mapData.markers.push(marker);
    }

    function centerMap(e) {
        e.lat = parseFloat(e.lat);
        e.lng = parseFloat(e.lng);
        map = new google.maps.Map(document.getElementById('map'), {
            map: map,
            zoom: 16,
 
            center: e
        });
        infoWindow = new google.maps.InfoWindow;

    }

}

// function calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
//     var waypts = [];
// var route1 = document.getElementById('waypoints');
// for (var i = 0; i < route1.length; i++) {
//     if (route1.options[i].selected) {
//         waypts.push({
//             location: route1[i].value,
//             stopover: true
//         });
//     }
// }
// directionsService.route({
//     origin: pointA,
//     destination: pointB,
//     waypoints: waypts,
//     travelMode: google.maps.TravelMode.WALKING
// }, function (response, status) {
//     if (status == google.maps.DirectionsStatus.OK) {
//         directionsDisplay.setDirections(response);
//     } else {
//         window.alert('Directions request failed due to ' + status);
//     }
// });


////// HOT MAP


// function runHotMap() {
//     console.log('hey')
//     var overlay;
//       USGSOverlay.prototype = new google.maps.OverlayView();

//       // Initialize the map and the custom overlay.

//       function initMap() {
//         var map = new google.maps.Map(document.getElementById('map'), {
//           zoom: 11,
//           center: {lat: 62.323907, lng: -150.109291},
//           mapTypeId: 'satellite'
//         });

//         var bounds = new google.maps.LatLngBounds(
//             new google.maps.LatLng(32.03559, 34.744247),
//             new google.maps.LatLng(32.12139, 34.823461));

//         // The photograph is courtesy of the U.S. Geological Survey.
//         var srcImage = '../img/hotMap.png';

//         // The custom USGSOverlay object contains the USGS image,
//         // the bounds of the image, and a reference to the map.
//         overlay = new USGSOverlay(bounds, srcImage, map);
//       }

//       /** @constructor */
//       function USGSOverlay(bounds, image, map) {

//         // Initialize all properties.
//         this.bounds_ = bounds;
//         this.image_ = image;
//         this.map_ = map;

//         // Define a property to hold the image's div. We'll
//         // actually create this div upon receipt of the onAdd()
//         // method so we'll leave it null for now.
//         this.div_ = null;

//         // Explicitly call setMap on this overlay.
//         this.setMap(map);
//       }

//       /**
//        * onAdd is called when the map's panes are ready and the overlay has been
//        * added to the map.
//        */
//       USGSOverlay.prototype.onAdd = function() {

//         var div = document.createElement('div');
//         div.style.borderStyle = 'none';
//         div.style.borderWidth = '0px';
//         div.style.position = 'absolute';

//         // Create the img element and attach it to the div.
//         var img = document.createElement('img');
//         img.src = this.image_;
//         img.style.width = '100%';
//         img.style.height = '100%';
//         img.style.position = 'absolute';
//         div.appendChild(img);

//         this.div_ = div;

//         // Add the element to the "overlayLayer" pane.
//         var panes = this.getPanes();
//         panes.overlayLayer.appendChild(div);
//       };

//       USGSOverlay.prototype.draw = function() {

//         // We use the south-west and north-east
//         // coordinates of the overlay to peg it to the correct position and size.
//         // To do this, we need to retrieve the projection from the overlay.
//         var overlayProjection = this.getProjection();

//         // Retrieve the south-west and north-east coordinates of this overlay
//         // in LatLngs and convert them to pixel coordinates.
//         // We'll use these coordinates to resize the div.
//         var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
//         var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

//         // Resize the image's div to fit the indicated dimensions.
//         var div = this.div_;
//         div.style.left = sw.x + 'px';
//         div.style.top = ne.y + 'px';
//         div.style.width = (ne.x - sw.x) + 'px';
//         div.style.height = (sw.y - ne.y) + 'px';
//       };

//       // The onRemove() method will be called automatically from the API if
//       // we ever set the overlay's map property to 'null'.
//       USGSOverlay.prototype.onRemove = function() {
//         this.div_.parentNode.removeChild(this.div_);
//         this.div_ = null;
//       };

//       google.maps.event.addDomListener(window, 'load', initMap);

// }

//$('#hot').on('click', runHotMap);

initMap();