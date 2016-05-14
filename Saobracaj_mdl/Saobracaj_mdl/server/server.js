var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var bodyParser = require('body-parser');
var fs = require("fs");
var path = require("path");

app.use(express.static(__dirname + '/node_modules'));
app.get('/', function (req, res, next) {
    //res.sendFile(__dirname + '/index.html');
});


/*io.on('connection', function (client) {
    console.log('Client connected...');

    client.on('send', function (data) {
        console.log(data);
        console.log("sennd client!")
        client.emit('messages', 'Hello from server');
    });

    client.on('disconnect', function () {
        console.log('user disconnected');
    });
});*/





// Baza SQLite
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('SaobracajDB.db');
var check;
db.serialize(function () {

    db.run("CREATE TABLE if not exists 'User' (" +
        "'ID'	INTEGER PRIMARY KEY AUTOINCREMENT," +
        "'Username'	TEXT NOT NULL UNIQUE," +
        "'Password'	TEXT NOT NULL" +
    ");");

    db.run("CREATE TABLE if not exists 'Saobracaj' (" +
      "'ID'	INTEGER PRIMARY KEY AUTOINCREMENT," +
      "'Username'	TEXT NOT NULL," +
      "'Name'	TEXT NOT NULL," +
      "'Description'	TEXT," +
      "'Longitude'	TEXT NOT NULL," +
      "'Latitude'	TEXT NOT NULL," +
      "'TimePeriod'	TEXT" +
  ");");

    //Perform INSERT operation.
    //db.run("INSERT into Saobracaj(Username,Name,Description,Longitude,Latitude,TimePeriod) VALUES ('userTest','nameTest','descTest','longTest', 'latTest', '1')");

});

db.close();


//var expressWS = require('express-ws')(app);

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//app.use(express.static('public'));
//app.use(express.static(__dirname + '/public'));

/*expressWS.getWss().on('connection', function (ws) {
    console.log('connection open');
    //ws.send('Server WebSocket ack');

});*/

/*app.get('/index.htm', function (req, res) {
    res.sendFile(__dirname + "/" + "index.htm");
});*/


app.post('/process_newuser', urlencodedParser, function (req, res) {

    // Prepare output in JSON format
    response = {
        username: req.body.username,
        password: req.body.password
    };

    var db = new sqlite3.Database('SaobracajDB.db');
    db.serialize(function () {
        db.run("INSERT into User(Username,Password) VALUES ('" + response.username + "','" + response.password + "')");
    });
    db.close();
    //console.log("---SEND---");
    /* console.log(INSERT into Saobracaj(Username,Name,Description,Longitude,Latitude,TimePeriod) VALUES ('userTest','" + response.naslov +
         + "','"+ response.description +"','"+ response.longitude +"', '"+ response.latitude +"', '"+ response.procenaTrajanja+"')")*/
    console.log(response);
    //res.end(JSON.stringify(response));
    //res.end("complete");
    res.send("success");
    /*res.format({
        'text/plain': function () {
            res.send('complete');
        }
    });*/
});

app.post('/process_post', urlencodedParser, function (req, res) {

    // Prepare output in JSON format
    response = {
        username: req.body.username,
        naslov: req.body.naslov,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        procenaTrajanja: req.body.procenaTrajanja,
        description: req.body.description
    };

    var db = new sqlite3.Database('SaobracajDB.db');
    db.serialize(function () {
        db.run("INSERT into Saobracaj(Username,Name,Description,Longitude,Latitude,TimePeriod) VALUES ('" + response.username + "','" + response.naslov + "','" + response.description + "','" + response.longitude + "', '" + response.latitude + "', '" + response.procenaTrajanja + "')");
    });
    db.close();
    console.log("---Sending data... Complete---");
    /* console.log(INSERT into Saobracaj(Username,Name,Description,Longitude,Latitude,TimePeriod) VALUES ('userTest','" + response.naslov +
         + "','"+ response.description +"','"+ response.longitude +"', '"+ response.latitude +"', '"+ response.procenaTrajanja+"')")*/
    //console.log(response);
    //res.end(JSON.stringify(response));
    //res.end("complete");
    res.send("complete");
    io.emit('messages', response);
    /*res.format({
        'text/plain': function () {
            res.send('complete');
        }
    });*/
});

app.post('/process_checkuser', urlencodedParser, function (req, res) {
    console.log("Got a GET request for /process_checkuser");
    //res.send('Page Pattern Match');

    // Prepare output in JSON format
    var response = {
        username: req.body.username,
        password: req.body.password
    };

   // console.log("Username: " + response.username + "Password: " + response.password);

    var db = new sqlite3.Database('SaobracajDB.db');
    db.serialize(function () {
        db.all("SELECT * from User where Username='" + response.username + "' and Password='" + response.password + "'", function (err, rows) {
            //rows contain values while errors, well you can figure out.
            // res.send(JSON.stringify(rows));

            var broj = 0;
            rows.forEach(function (row) {
                broj++;
            });

            //console.log(rows);
           // console.log(broj);
            /*var test = JSON.stringify(rows);
            console.log("Test: " + test);*/
            if (broj == '1') {
                res.send("correct");
            }
            else
                res.send("notCorrect");
        });
        db.close();
    });


});

app.post('/process_get', urlencodedParser, function (req, res) {
    console.log("Got a GET request for /process_get");
    //res.send('Page Pattern Match');
    // db.all("SELECT * from Saobracaj where Name='Zastoji'", function (err, rows)

    var latLong = {
        longitude: req.body.longitude,
        latitude: req.body.latitude
    };
    var latMin = parseFloat(latLong.latitude) - 0.5;
    var latMax = parseFloat(latLong.latitude) + 0.5;
    var lonMin = parseFloat(latLong.longitude) - 0.5;
    var lonMax = parseFloat(latLong.longitude) + 0.5;

    //console.log("Longitude: " + latLong.longitude + "  Latitude: " + latLong.latitude + " \n");
    //console.log("LatMin: " + latMin + "  LatMax: " + latMax + "LonMin: " + lonMin + "LonMax: " + lonMax + " \n");

    var db = new sqlite3.Database('SaobracajDB.db');
    db.serialize(function () {
        db.all("SELECT * from Saobracaj where Latitude > '" + latMin + "' and Latitude < '" + latMax + "' and Longitude > '" + lonMin + "' and Longitude < '" + lonMax + "'", function (err, rows) {
            //rows contain values while errors, well you can figure out.
            // res.send(JSON.stringify(rows));
            /*rows.forEach(function (row) {
                console.log(JSON.stringify(row));
            });*/
            res.send(rows);
        });
        db.close();
    });
});

/*var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

});*/

var server = http.listen(process.env.PORT || 8081, function () {

    var host = 'localhost'; //server.address().address;
    var port = process.env.PORT; //server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);

});


