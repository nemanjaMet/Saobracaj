// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);


        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        /*var element = document.getElementById("deviceready");
        element.innerHTML = 'Device Ready';
        element.className += ' ready';*/
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };

})();



/*Za pikabu hamburger menu*/
$(function () {
    pikabu = new Pikabu();

    // Script to adjust element heights for demo
    $('.m-heights-demo').on('click', 'a', function (e) {
        var $link = $(this), target = $link.data('target');

        e.preventDefault();

        $('.is-active').removeClass('is-active');
        $link.parents('li').addClass('is-active');

        $('.m-dummy-height').remove();

        target && $(target).append($('<div class="m-dummy-height">'));
        pikabu.closeSidebars();
    });
});

var loadMap = false;
var map = null;
var myPosition = null;
var markers = [];
var myMarker = null;
var zahtevBazi = true;
var lastLocation = null;
var mapClick = null;
var markerCheckPos = null;
var refreshMyMarker = false;

function setLoadMap() {
    loadMap = true;
    setMap(this);
}

function setMap(global) {
    "use strict";

    var latLong;
    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        if (loadMap) {
            document.addEventListener("online", onOnline, false);
            document.addEventListener("resume", onResume, false);

            loadMapsApi();
        }
        //navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }

    function onOnline() {
        loadMapsApi();
    }

    function onResume() {
        loadMapsApi();
    }

    function loadMapsApi() {
        if (navigator.connection.type === Connection.NONE || (global.google !== undefined && global.google.maps)) {
            return;
        }

        //TODO: Add your own Google maps API key to the URL below.
        $.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyCeRZWMQe9UPAUzbwKPad4dUxb2KCbjgBU&sensor=true&callback=onMapsApiLoaded');
    }

    global.onMapsApiLoaded = function () {
        // Maps API loaded and ready to be used.

        var prvobitnaLokacija = true;
        navigator.geolocation.getCurrentPosition(onSuccess, onError);

        var time = 60000;
        setInterval(ticktack, time);

        function ticktack() {
            //refreshMyMarker = true;
            //navigator.geolocation.getCurrentPosition(onSuccess, onError);
            if (map == null || zahtevBazi) {
                zahtevBazi = true;
                navigator.geolocation.getCurrentPosition(onSuccess, onError);
            }
            else {
                // stare pozicije
                var lastLat = lastLocation.lat();
                var lastLon = lastLocation.lng();

                myMarker.setMap(null);
                navigator.geolocation.getCurrentPosition(onSuccess, onError);

                var latMin = parseFloat(myPosition.lat()) - 0.005;
                var latMax = parseFloat(myPosition.lat()) + 0.005;
                var lonMin = parseFloat(myPosition.lng()) - 0.007;
                var lonMax = parseFloat(myPosition.lng()) + 0.007;

                // ako smo u blizini nekog dogadjaja izbaci notifikaciju
                for (var i = 0; i < markers.length; i++) {
                    var lat = markers[i].getPosition().lat();
                    var lon = markers[i].getPosition().lng();

                    if (lat > latMin && lat < latMax && lon > lonMin && lon < lonMax) {
                        alert("Notification! Near event....");
                        refreshMyMarker = true;
                        navigator.notification.beep(3);
                        navigator.geolocation.getCurrentPosition(onSuccess, onError);
                    }
                }

                // ako je veca razdaljina trazi nove podatke iz baze
                latMin = lastLat - 0.2;
                latMax = lastLat + 0.2;
                lonMin = lastLon - 0.2;
                lonMax = lastLon + 0.2;

                var currLat = myPosition.lat();
                var currLon = myPosition.lng();

                if (currLat < latMin || currLat > latMax || currLon < lonMin || currLon > lonMax) {
                    zahtevBazi = true;
                    navigator.geolocation.getCurrentPosition(onSuccess, onError);
                }

            }
        }

        /*navigator.geolocation.watchPosition(onSuccessWatch, onError, { timeout: 60000 });

        function onSuccessWatch() {


            if (map == null || zahtevBazi) {
                zahtevBazi = true;
                navigator.geolocation.getCurrentPosition(onSuccess, onError);
            }
            else {
                // stare pozicije
                var lastLat = lastLocation.lat();
                var lastLon = lastLocation.lng();

                myMarker.setMap(null);
                navigator.geolocation.getCurrentPosition(onSuccess, onError);

                var latMin = parseFloat(myPosition.lat()) - 0.005;
                var latMax = parseFloat(myPosition.lat()) + 0.005;
                var lonMin = parseFloat(myPosition.lng()) - 0.007;
                var lonMax = parseFloat(myPosition.lng()) + 0.007;

                // ako smo u blizini nekog dogadjaja izbaci notifikaciju
                for (var i = 0; i < markers.length; i++) {
                    var lat = markers[i].getPosition().lat();
                    var lon = markers[i].getPosition().lng();

                    if (lat > latMin && lat < latMax && lon > lonMin && lon < lonMax) {
                        // alert("Notification!");
                        refreshMyMarker = true;
                        navigator.notification.beep(3);
                        navigator.geolocation.getCurrentPosition(onSuccess, onError);
                    }
                }

                // ako je veca razdaljina trazi nove podatke iz baze
                latMin = lastLat - 0.2;
                latMax = lastLat + 0.2;
                lonMin = lastLon - 0.2;
                lonMax = lastLon + 0.2;

                var currLat = myPosition.lat();
                var currLon = myPosition.lng();

                if (currLat < latMin || currLat > latMax || currLon < lonMin || currLon > lonMax) {
                    zahtevBazi = true;
                    navigator.geolocation.getCurrentPosition(onSuccess, onError);
                }

            }
        }*/


        function onSuccess(position) {
            // alert("CDV position success");
            var longitude = position.coords.longitude;
            var latitude = position.coords.latitude;
            latLong = new google.maps.LatLng(latitude, longitude);
            myPosition = latLong;

            if (map == null) {
                map = new google.maps.Map(document.getElementById("maps"), {
                    zoom: 13,
                    center: latLong
                });
            }
            // ----- Postavljanje ikonica, komunikacija sa bazom --------
            if (zahtevBazi) {
                lastLocation = myPosition;

                // Klirovanje svih markera
                if (markers != null) {
                    for (var i = 0; i < markers.length; i++) {
                        markers[i].setMap(null);
                    }
                    markers = [];
                }
                if (myMarker != null)
                    myMarker.setMap(null);

                $.post("https://mosis.herokuapp.com/process_get",
                 {
                     longitude: longitude,
                     latitude: latitude,
                 },

                  function (data, status) {
                      data.forEach(function (object) {
                          // alert("ForEach");
                          //counter++;  

                          var description = "Title: " + object.Name + " \n" + "Description: " + object.Description + " \n" + "Time: " + object.TimePeriod;
                          if (object.Name == "Radar") {
                              var marker = new google.maps.Marker({
                                  position: new google.maps.LatLng(object.Latitude, object.Longitude),
                                  map: map,
                                  title: 'Radar',
                                  data: description,
                                  icon: {
                                      url: "images/police.png",
                                      scaledSize: new google.maps.Size(48, 48)
                                  }
                              });
                              //radar.push(object);
                              markers.push(marker);
                              google.maps.event.addListener(marker, 'click', function () { // Add a Click Listener to our marker
                                  //alert(marker.data);
                                  //window['counter'] = 0;
                                  var notification = document.querySelector('.mdl-js-snackbar');
                                  notification.MaterialSnackbar.showSnackbar(
                                    {
                                        message: marker.data
                                    }
                                  );
                              });
                          }
                          else if (object.Name == "Nezgode") {
                              var marker = new google.maps.Marker({
                                  position: new google.maps.LatLng(object.Latitude, object.Longitude),
                                  map: map,
                                  title: 'Nezgode',
                                  data: description,
                                  icon: {
                                      url: "images/accident.gif",
                                      scaledSize: new google.maps.Size(48, 48)
                                  }
                              });
                              //nezgode.push(object);
                              markers.push(marker);
                              google.maps.event.addListener(marker, 'click', function () { // Add a Click Listener to our marker
                                  //alert(marker.data);
                                  //window['counter'] = 0;
                                  var notification = document.querySelector('.mdl-js-snackbar');
                                  notification.MaterialSnackbar.showSnackbar(
                                    {
                                        message: marker.data
                                    }
                                  );
                              });
                          }
                          else if (object.Name == "Radovi na putu") {
                              var marker = new google.maps.Marker({
                                  position: new google.maps.LatLng(object.Latitude, object.Longitude),
                                  map: map,
                                  title: 'Radovi na putu',
                                  data: description,
                                  icon: {
                                      url: "images/roadWork.png",
                                      scaledSize: new google.maps.Size(48, 48)
                                  }
                              });
                              //radovi_na_putu.push(object);
                              markers.push(marker);
                              google.maps.event.addListener(marker, 'click', function () { // Add a Click Listener to our marker
                                  //alert(marker.data);
                                  //window['counter'] = 0;
                                  var notification = document.querySelector('.mdl-js-snackbar');
                                  notification.MaterialSnackbar.showSnackbar(
                                    {
                                        message: marker.data
                                    }
                                  );
                              });
                          }
                          else if (object.Name == "Zastoji") {
                              var marker = new google.maps.Marker({
                                  position: new google.maps.LatLng(object.Latitude, object.Longitude),
                                  map: map,
                                  title: 'Radar',
                                  data: description,
                                  icon: {
                                      url: "images/traffic.png",
                                      scaledSize: new google.maps.Size(48, 48)
                                  }
                              });
                              //zastojipush(object);
                              markers.push(marker);
                              google.maps.event.addListener(marker, 'click', function () { // Add a Click Listener to our marker
                                  //alert(marker.data);
                                  //window['counter'] = 0;
                                  var notification = document.querySelector('.mdl-js-snackbar');
                                  notification.MaterialSnackbar.showSnackbar(
                                    {
                                        message: marker.data
                                    }
                                  );
                              });
                          }
                          else if (object.Name == "Pomoc na putu") {
                              var marker = new google.maps.Marker({
                                  position: new google.maps.LatLng(object.Latitude, object.Longitude),
                                  map: map,
                                  title: 'Radar',
                                  data: description,
                                  icon: {
                                      url: "images/help.png",
                                      scaledSize: new google.maps.Size(48, 48)
                                  }
                              });
                              //pomoc_na_putu.push(object);
                              markers.push(marker);
                              google.maps.event.addListener(marker, 'click', function () { // Add a Click Listener to our marker
                                  //alert(marker.data);
                                  //window['counter'] = 0;
                                  var notification = document.querySelector('.mdl-js-snackbar');
                                  notification.MaterialSnackbar.showSnackbar(
                                    {
                                        message: marker.data
                                    }
                                  );
                              });
                          }
                          else if (object.Name == "Ostalo") {
                              var marker = new google.maps.Marker({
                                  position: new google.maps.LatLng(object.Latitude, object.Longitude),
                                  map: map,
                                  title: 'Radar',
                                  data: description,
                                  icon: {
                                      url: "images/other.png",
                                      scaledSize: new google.maps.Size(48, 48)
                                  }
                              });
                              //ostalo.push(object);
                              markers.push(marker);
                              google.maps.event.addListener(marker, 'click', function () { // Add a Click Listener to our marker
                                  //alert(marker.data);
                                  //window['counter'] = 0;
                                  var notification = document.querySelector('.mdl-js-snackbar');
                                  notification.MaterialSnackbar.showSnackbar(
                                    {
                                        message: marker.data
                                    }
                                  );
                              });
                          }
                      });
                  });
                zahtevBazi = false;
                refreshMyMarker = true;
            }
            // ---------------------------------------------

            if (refreshMyMarker) {
                placeMarker(latLong, map, 'My location');
                refreshMyMarker = false;
            }


            if (prvobitnaLokacija) {
                $("#longitude").val(longitude);
                $("#latitude").val(latitude);
            }

            if (mapClick != null) {
                google.maps.event.removeListener(mapClick);
                mapClick = null;
            }
        }

        function onError(error) {
            alert("Error on getting location. ");
            //alert("code: " + error.code + "\n" + "message: " + error.message);
        }

        // biranje nove lokacije
        google.maps.event.addDomListener(document.getElementById('chooseLocation'), 'click', function () {

            //alert("Nova mapa");
            $("#maps").show();
            $("#home").hide();
            $("#statistics").hide();
            $("#about").hide();
            $(".divDataInput").hide();

            mapClick = google.maps.event.addListener(map, 'click', function (e) {
                //alert("Mapa kliknuta!");
                //placeMarker(e.latLng, map);
                $(".divDataInput").show();
                $("#longitude").val(e.latLng.lng());
                $("#latitude").val(e.latLng.lat());

                prvobitnaLokacija = false;
                navigator.geolocation.getCurrentPosition(onSuccess, onError);
            });
        });


        // Proveravanje lokacije iz input polja
        google.maps.event.addDomListener(document.getElementById('checkLocation'), 'click', function () {
            if ($.trim($("#longitude").val()) != "" && $.trim($("#latitude").val()) != "") {
                /*map = new google.maps.Map(document.getElementById("maps"), {
                    zoom: 13,
                    center: new google.maps.LatLng($("#latitude").val(), $("#longitude").val())
                });*/


                map.setCenter(new google.maps.LatLng($("#latitude").val(), $("#longitude").val()));

                if (myMarker != null)
                    myMarker.setMap(null);

                placeMarker(new google.maps.LatLng($("#latitude").val(), $("#longitude").val()), map, 'Checked location');

                alert("Show map");
                $("#maps").show();
                $("#home").hide();
                $("#statistics").hide();
                $("#about").hide();
                $(".divDataInput").hide();

            }
        });

        function placeMarker(position, map, info) {
            var marker = new google.maps.Marker({
                position: position,
                map: map,
                title: info,
                data: info
            });
            myMarker = marker;
            map.panTo(position);
            google.maps.event.addListener(marker, 'click', function () { // Add a Click Listener to our marker
                //alert("Marker kliknut!");
                var notification = document.querySelector('.mdl-js-snackbar');
                notification.MaterialSnackbar.showSnackbar(
                  {
                      message: marker.data
                  }
                );
            });
        }
        //Geolocate. Cache location for 5 mins. Timeout after 6 seconds
        /* navigator.geolocation.getCurrentPosition(success, fail, {
             maximumAge: 500000,
             enableHighAccuracy: true,
             timeout: 6000
         });*/

        /*var map = new google.maps.Map(document.getElementById("maps"), {
            zoom: 10,
            center: new google.maps.LatLng(43.33344, 21.891948)
            
            //center: new google.maps.LatLng(myPosition.coords.longitude, myPosition.coords.latitude)
        });*/
    };

} (window);

//var socket = io.connect();
var socket;


function clientSide() {
    //var server = require('http').createServer();
    // var io = require('socket.io')(server);

    socket = io.connect("https://mosis.herokuapp.com");
    socket.on('connect', function (data) {
        //socket.emit('send', 'Hello World from client');
    });



    socket.on('messages', function (data) {
        //alert(data);

        var latMin = parseFloat(myPosition.lat()) - 0.3;
        var latMax = parseFloat(myPosition.lat()) + 0.3;
        var lonMin = parseFloat(myPosition.lng()) - 0.3;
        var lonMax = parseFloat(myPosition.lng()) + 0.3;

        if (data.latitude > latMin && data.latitude < latMax && data.longitude > lonMin && data.longitude < lonMax && $("#usernameHeader").text() != data.username) {
            alert("Notification! New event....");
            navigator.notification.vibrate(2000);
            navigator.notification.beep(2000);
            zahtevBazi = true;
        }

        /*var latLong = new google.maps.LatLng(43.324491, 21.889756);
        var marker = new google.maps.Marker({
            position: latLong,
            map: map,
            title: 'socket',
            data: "socket"
        });
        markers.push(marker);*/
    });

    /*socket.emit('Cordova: ', 'Hello from cordova!');
    io.on('connection', function (socket) {
        console.log('a user connected');
        socket.on('disconnect', function () {
            console.log('user disconnected');
        });
    });*/
    /*socket.on('connection', function (socket) {
        console.log('socket connected');

        socket.on('disconnect', function () {
            console.log('socket disconnected');
        });

        socket.emit('text', 'wow. such event. very real time.');
    });*/

    //server.listen(8081);
}
