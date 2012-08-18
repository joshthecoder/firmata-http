var events = require('events'),
    util = require('util');

var express = require('express'),
    firmata = require('firmata');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 8080);
});

// -- Channels --
// Channels provide a way for clients
// to consume pin data on a dedicated "data"
// connection which provides a streaming response.
// Multiple pins can feed data into a channel.
function Channel() {
  events.EventEmitter.call(this);
}
util.inherits(Channel, events.EventEmitter);

Channel.prototype.addFeed = function(pinNumber) {
  var self = this;

  console.log('Feed added for pin ' + pinNumber);

  return function(newValue) {
    self.emit('data', pinNumber, newValue);
  }
}

var channels = { };

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
  board.queryFirmware(function() {
    res.json(200, {
      major: board.firmware.version.major,
      minor: board.firmware.version.minor,
      name: board.firmware.name
    });
  });
});

// Write digital or analog data to a pin.
//
// POST /pins/:num/write?type=digital&value=1
app.post('/pins/:num/write', function(req, res) {
  var pinNumber = req.params.num,
      value = parseInt(req.query.value),
      dataType = req.query.type;

  if (Number.isNaN(value)) {
    res.send(400, 'Invalid value. Must be a number.');
    return;
  }

  if (dataType == 'digital') {
    board.digitalWrite(pinNumber, value);
  } else if (dataType == 'analog') {
    board.analogWrite(pinNumber, value);
  } else {
    res.send(400, 'Invalid type. Must be digital or analog.');
    return;
  }

  res.send(200);
});

// Read digital or analog pin data.
// Pin data is delivered to a channel as it arrives.
//
// GET /pins/2/read?type=digital&channel=1
app.get('/pins/:num/read', function(req, res) {
  var pinNumber = req.params.num,
      dataType = req.query.type,
      channelID = req.query.channel;

  if (typeof(channelID) == 'undefined') {
    res.send(400, 'Must provide a channel ID.');
    return;
  }

  var channel = channels[channelID];
  if (typeof(channel) == 'undefined') {
    channel = channels[channelID] = new Channel;
  }
  var dataCallback = channel.addFeed(pinNumber);

  if (dataType == 'digital') {
    board.digitalRead(pinNumber, dataCallback);
  } else if (dataType == 'analog') {
    board.analogRead(pinNumber, dataCallback);
  } else {
    res.send(400, 'Invalid type. Must be digital or analog.');
    return;
  }

  res.send(200);
});

// Connect to channel and start receiving data.
// This endpoint provides a streaming response
// of JSON objects delimited by a newline character.
//
// GET /channels/1
//   -> {pin: 2, value: 0}\n
//   -> {pin: 4, value: 128}\n
//   ...
app.get('/channels/:id', function(req, res) {
  var id = req.params.id;
  if (typeof(id) == 'undefined') {
    res.send(400, 'Must provide a channel ID.');
    return;
  }

  var channel = channels[id];
  if (typeof(channel) == 'undefined') {
    // Create the channel if it does not exist yet.
    // The client might want to connect first before
    // subscribing to a pin's data.
    channel = channels[id] = new Channel;
  }

  function onData(pinNumber, value) {
    res.write(JSON.stringify({pin: pinNumber, value: value}) + '\n');
  }

  res.on('close', function() {
    console.log('Channel client disconnected.');
    channel.removeListener('data', onData);
  });

  channel.on('data', onData);
});

// Usage: node firmata-http.js <serialPortPath>
var serialPortPath = process.argv[2];

var board = new firmata.Board(serialPortPath, function() {
  app.listen(app.get('port'));
  console.log('Connected to board. HTTP server running.');
});

