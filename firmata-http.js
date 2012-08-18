var express = require('express'),
    firmata = require('firmata');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 8080);
});

// --- Endpoints ---

// Query the version of the board.
//
// GET /version/board
//   -> {"major": 1, "minor": 0}
app.get('/version/board', function(req, res) {
  board.reportVersion(function() {
    res.json(200, {
      major: board.version.major,
      minor: board.version.minor
    });
  });
});

// Query firmware version of the board.
//
// GET /version/firmware
//   -> {"major": 1, "minor": 2, "name": "awesome"}
app.get('/version/firmware', function(req, res) {
  board.queryfirmware(function() {
    res.json(200, {
      major: board.firmware.version.major,
      minor: board.firmware.version.minor,
      name: board.firmware.name
    });
  });
});

var board = new firmata.Board(serialPortPath, function() {
  app.listen(app.get('port'));
  console.log('Connected to board. HTTP server running.');
});

